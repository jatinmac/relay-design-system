import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const repositoryRoot = path.resolve(packageRoot, '../..');
const sourceRoot = path.join(packageRoot, 'src');
const outputRoot = path.join(packageRoot, 'dist');
const lifecycle = ['experimental', 'beta', 'stable', 'deprecated', 'removed'];

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function readPublicExports(relativePath) {
  const source = await fs.readFile(
    path.join(repositoryRoot, relativePath),
    'utf8',
  );
  const values = new Set();
  const types = new Set();

  for (const match of source.matchAll(
    /export\s*\{(?<exports>[\s\S]*?)\}\s*from/g,
  )) {
    const exportList = match.groups?.exports;
    if (!exportList) {
      continue;
    }

    for (const rawSpecifier of exportList.split(',')) {
      const specifier = rawSpecifier.trim();
      if (!specifier) {
        continue;
      }

      if (specifier.startsWith('type ')) {
        types.add(
          specifier
            .slice(5)
            .trim()
            .split(/\s+as\s+/u)[0],
        );
      } else {
        values.add(specifier.split(/\s+as\s+/u)[0]);
      }
    }
  }

  return { values, types };
}

function readPropsByExport(configRelativePath, indexRelativePath) {
  const configPath = path.join(repositoryRoot, configRelativePath);
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  assert(
    !configFile.error,
    `Unable to read TypeScript config ${configRelativePath}.`,
  );
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  );
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
  });
  const checker = program.getTypeChecker();
  const indexPath = path.join(repositoryRoot, indexRelativePath);
  const indexSource = program.getSourceFile(indexPath);
  assert(
    indexSource,
    `Unable to load public entry point ${indexRelativePath}.`,
  );
  const moduleSymbol = checker.getSymbolAtLocation(indexSource);
  assert(moduleSymbol, `Unable to resolve exports for ${indexRelativePath}.`);
  const exportedSymbols = new Map(
    checker
      .getExportsOfModule(moduleSymbol)
      .map((symbol) => [symbol.getName(), symbol]),
  );

  return (exportName) => {
    const exportedSymbol = exportedSymbols.get(exportName);
    assert(
      exportedSymbol,
      `${exportName} is not exported by ${indexRelativePath}.`,
    );
    const symbol =
      exportedSymbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exportedSymbol)
        : exportedSymbol;
    const declaration = symbol.declarations?.[0];
    assert(declaration, `Unable to inspect ${exportName}.`);
    const type = checker.getTypeAtLocation(
      'name' in declaration && declaration.name
        ? declaration.name
        : declaration,
    );
    const properties = new Set();

    function collectProperties(currentType) {
      for (const property of checker.getPropertiesOfType(currentType)) {
        properties.add(property.getName());
      }
      if (currentType.isUnionOrIntersection()) {
        for (const nestedType of currentType.types) {
          collectProperties(nestedType);
        }
      }
    }

    collectProperties(type);
    return properties;
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

async function validateComponents(contract) {
  assert(contract.schemaVersion === 1, 'Unsupported component schema version.');
  assert(
    Array.isArray(contract.components) && contract.components.length > 0,
    'Component contracts must not be empty.',
  );

  const packageIndexes = {
    '@relay/react': 'packages/react/src/index.ts',
    '@relay/product-access': 'packages/product-access/src/index.ts',
  };
  const packageConfigs = {
    '@relay/react': 'packages/react/tsconfig.json',
    '@relay/product-access': 'packages/product-access/tsconfig.json',
  };
  const exportsByPackage = new Map();
  const propsReadersByPackage = new Map();

  for (const [packageName, indexPath] of Object.entries(packageIndexes)) {
    exportsByPackage.set(packageName, await readPublicExports(indexPath));
    propsReadersByPackage.set(
      packageName,
      readPropsByExport(packageConfigs[packageName], indexPath),
    );
  }

  const names = new Set();
  for (const component of contract.components) {
    assert(
      !names.has(component.name),
      `Duplicate component: ${component.name}`,
    );
    names.add(component.name);
    assert(
      lifecycle.includes(component.status),
      `${component.name} has an invalid lifecycle status.`,
    );
    assert(
      component.status === 'beta',
      `${component.name} must be beta for v0.1.`,
    );
    assert(
      component.package === '@relay/react' ||
        component.package === '@relay/product-access',
      `${component.name} uses an unsupported package boundary.`,
    );
    assert(
      component.layer ===
        (component.package === '@relay/react' ? 'universal' : 'product'),
      `${component.name} is assigned to the wrong ownership layer.`,
    );

    const packageExports = exportsByPackage.get(component.package);
    assert(
      packageExports?.values.has(component.name),
      `${component.name} is not a public value export of ${component.package}.`,
    );
    assert(
      packageExports?.types.has(component.props.type),
      `${component.props.type} is not publicly exported by ${component.package}.`,
    );
    assert(
      component.props.required.every((prop) =>
        component.props.allowed.includes(prop),
      ),
      `${component.name} has a required prop outside its allowed prop list.`,
    );
    const publicProps = propsReadersByPackage.get(component.package)(
      component.props.type,
    );
    const staleProps = component.props.allowed.filter(
      (prop) => !publicProps.has(prop),
    );
    assert(
      staleProps.length === 0,
      `${component.name} documents props missing from ${component.props.type}: ${staleProps.join(', ')}`,
    );

    const sourcePath = path.join(repositoryRoot, component.source);
    const source = await fs.readFile(sourcePath, 'utf8');
    assert(
      source.includes(component.name) && source.includes(component.props.type),
      `${component.name} does not match its declared source file.`,
    );

    const examplePath = path.join(sourceRoot, component.example);
    const example = await fs.readFile(examplePath, 'utf8');
    assert(
      example.includes(component.name),
      `${component.example} does not demonstrate ${component.name}.`,
    );
  }

  for (const component of contract.components) {
    for (const dependency of component.composes) {
      assert(
        names.has(dependency),
        `${component.name} composes unknown component ${dependency}.`,
      );
      const dependencyContract = contract.components.find(
        (candidate) => candidate.name === dependency,
      );
      assert(
        component.layer !== 'universal' ||
          dependencyContract?.layer === 'universal',
        `${component.name} violates the universal-to-product dependency boundary.`,
      );
    }
  }

  for (const [packageName, packageExports] of exportsByPackage) {
    const documented = new Set(
      contract.components
        .filter((component) => component.package === packageName)
        .map((component) => component.name),
    );
    const undocumented = sorted(packageExports.values).filter(
      (exportName) => !documented.has(exportName),
    );
    assert(
      undocumented.length === 0,
      `${packageName} has undocumented public values: ${undocumented.join(', ')}`,
    );
  }
}

function validatePatterns(contract, components) {
  assert(contract.schemaVersion === 1, 'Unsupported pattern schema version.');
  const componentNames = new Set(
    components.components.map((component) => component.name),
  );
  const patternIds = new Set();

  for (const pattern of contract.patterns) {
    assert(!patternIds.has(pattern.id), `Duplicate pattern: ${pattern.id}`);
    patternIds.add(pattern.id);
    assert(
      pattern.form === 'coded' || pattern.form === 'recipe',
      `${pattern.id} has an invalid pattern form.`,
    );
    if (pattern.form === 'coded') {
      assert(
        componentNames.has(pattern.export),
        `${pattern.id} references unknown export ${pattern.export}.`,
      );
      assert(
        pattern.status === 'beta',
        `${pattern.id} coded patterns must use a component lifecycle state.`,
      );
    } else {
      assert(
        pattern.status === 'guidance',
        `${pattern.id} recipes must be marked as guidance.`,
      );
      assert(
        pattern.documentation,
        `${pattern.id} recipes require durable documentation.`,
      );
    }
  }
}

function validateTokens(tokens) {
  assert(tokens.schemaVersion === 1, 'Unsupported token schema version.');
  assert(Array.isArray(tokens.tokens), 'Token artifact has no token list.');
  const names = new Set();
  const cssVariables = new Set();

  for (const token of tokens.tokens) {
    assert(!names.has(token.name), `Duplicate token name: ${token.name}`);
    assert(
      !cssVariables.has(token.cssVariable),
      `Duplicate token CSS variable: ${token.cssVariable}`,
    );
    assert(
      /^--ds-[a-z0-9-]+$/u.test(token.cssVariable),
      `${token.name} has an invalid CSS variable.`,
    );
    assert(
      /^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/u.test(token.name),
      `${token.name} does not follow the semantic token taxonomy.`,
    );
    names.add(token.name);
    cssVariables.add(token.cssVariable);
  }
}

function createConstraints() {
  return `# Relay AI constraints

Generated by \`@relay/knowledge\`. Do not edit the generated copy.

## Dependency direction

\`\`\`text
@relay/tokens
├── @relay/theme-relay / @relay/theme-northstar
└── @relay/react
      ↓
@relay/product-access
      ↓
applications
\`\`\`

- Universal code may depend on React, approved accessibility utilities, and the semantic token contract.
- Product compositions may depend on \`@relay/react\`.
- Applications may depend on any public design-system package.
- Never import product or application code into \`@relay/react\`.
- Never import API clients, authentication, routing, caching, or server state into design-system packages.

## Props and composition

- Use intent props such as \`tone="critical"\`; never add appearance props such as \`color="red"\`.
- Use the discriminated state unions documented in \`components.json\`.
- Prefer composition and stable slots over boolean-heavy APIs.
- New domain anatomy belongs in a product package, not a universal component.
- Variable workflows remain documented recipes until repeated use proves a stable API.
- Do not invent props. Check \`components.json\` and the exported TypeScript props type.

## Styling and themes

- Component CSS consumes semantic \`--ds-*\` variables only.
- Do not embed raw color, spacing, radius, shadow, or motion values in components.
- Brand differences belong in theme token values; component structure stays brand-neutral.
- The application loads one or more theme stylesheets and selects a theme through \`DesignSystemProvider\`.
- Use container queries for reusable component responsiveness; applications own viewport-level page layout.

## State and accessibility

- Components own ephemeral interaction state; consumers control reusable UI state; applications own server and business state.
- Cover loading, empty, no-results, error, refreshing, pending mutation, rollback, restricted permission, and long-content behavior when applicable.
- Accessible names, semantic roles, label relationships, keyboard operation, focus entry/trapping/restoration, and reduced motion are public API.
- Do not remove required labels or replace semantic elements with generic elements plus ARIA.
- Automated accessibility checks do not replace keyboard and assistive-technology review.

## Change governance

- All v0.1 public components are \`beta\`.
- User-facing package changes require a Changeset.
- Breaking changes require an ADR, a major Changeset, and migration guidance in \`MIGRATIONS.md\`.
- Lifecycle transitions follow \`experimental → beta → stable → deprecated → removed\`.
`;
}

function createAiUsage() {
  return `# Using Relay with AI coding agents

Generated by \`@relay/knowledge\`. The repository source remains authoritative.

## Read in this order

1. \`constraints.md\` for non-negotiable architecture and accessibility rules.
2. \`components.json\` for ownership, lifecycle, allowed props, variants, slots, and controlled-state responsibilities.
3. \`patterns.json\` to choose a coded product pattern or a documented recipe.
4. \`tokens.json\` when authoring theme or component CSS.
5. \`examples/*.tsx\` for type-checked composition examples.

## Selection algorithm

1. Reuse an existing universal component when its semantics and anatomy match.
2. Compose universal components in an application for one-off product UI.
3. Use a coded product component when the documented domain workflow matches.
4. Follow a recipe when sequence and structure vary by product.
5. Propose a new universal API only after repeated cross-product evidence.

## Generation workflow

- Run \`pnpm knowledge:build\` after changing public exports, token contracts, patterns, examples, or lifecycle metadata.
- Run \`pnpm knowledge:check\` to fail on stale artifacts or API mismatches.
- Never hand-edit files under \`packages/knowledge/dist\`.

## Consumer integration

- Import components only from their public package entry points.
- Import the selected theme CSS and \`@relay/react/styles.css\` in the application entry point.
- Put \`DesignSystemProvider\` above Relay UI.
- Map HTTP/cache state into controlled component contracts in application containers.
- Keep authorization enforcement on the server; permission props control presentation, not security.
`;
}

async function collectExpectedFiles() {
  const components = await readJson(
    path.join(sourceRoot, 'contracts/components.json'),
  );
  const patterns = await readJson(
    path.join(sourceRoot, 'contracts/patterns.json'),
  );
  const tokens = await readJson(
    path.join(repositoryRoot, 'packages/tokens/dist/tokens.json'),
  );

  await validateComponents(components);
  validatePatterns(patterns, components);
  validateTokens(tokens);

  const expected = new Map();
  expected.set(
    'components.json',
    `${JSON.stringify(
      {
        schemaVersion: components.schemaVersion,
        generatedFrom: [
          'packages/react/src/index.ts',
          'packages/product-access/src/index.ts',
          'packages/knowledge/src/contracts/components.json',
        ],
        lifecycle,
        components: components.components,
      },
      null,
      2,
    )}\n`,
  );
  expected.set(
    'patterns.json',
    `${JSON.stringify(
      {
        schemaVersion: patterns.schemaVersion,
        generatedFrom: [
          'packages/knowledge/src/contracts/patterns.json',
          'docs/patterns/filter-query-results.md',
        ],
        patterns: patterns.patterns,
      },
      null,
      2,
    )}\n`,
  );
  expected.set(
    'tokens.json',
    `${JSON.stringify(
      {
        schemaVersion: tokens.schemaVersion,
        generatedFrom: 'packages/tokens/dist/tokens.json',
        contract: 'semantic',
        naming: {
          token: 'category.role.state',
          cssVariable: '--ds-{kebab-case-token-name}',
        },
        tokens: tokens.tokens,
      },
      null,
      2,
    )}\n`,
  );
  expected.set('constraints.md', createConstraints());
  expected.set('AI_USAGE.md', createAiUsage());

  const examplesRoot = path.join(sourceRoot, 'examples');
  for (const entry of await fs.readdir(examplesRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const content = await fs.readFile(
        path.join(examplesRoot, entry.name),
        'utf8',
      );
      expected.set(
        `examples/${entry.name}`,
        content.endsWith('\n') ? content : `${content}\n`,
      );
    }
  }

  return expected;
}

async function listOutputFiles(directory, prefix = '') {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(
        ...(await listOutputFiles(
          path.join(directory, entry.name),
          relativePath,
        )),
      );
    } else {
      files.push(relativePath);
    }
  }
  return files;
}

async function build(expected) {
  for (const [relativePath, content] of expected) {
    const outputPath = path.join(outputRoot, relativePath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content);
  }

  for (const relativePath of await listOutputFiles(outputRoot)) {
    if (!expected.has(relativePath)) {
      await fs.unlink(path.join(outputRoot, relativePath));
    }
  }

  process.stdout.write(`Generated ${expected.size} AI knowledge artifacts.\n`);
}

async function check(expected) {
  const problems = [];
  const actualFiles = new Set(await listOutputFiles(outputRoot));

  for (const [relativePath, content] of expected) {
    const outputPath = path.join(outputRoot, relativePath);
    let actual;
    try {
      actual = await fs.readFile(outputPath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        problems.push(`missing ${relativePath}`);
        continue;
      }
      throw error;
    }
    if (actual !== content) {
      problems.push(`stale ${relativePath}`);
    }
    actualFiles.delete(relativePath);
  }

  for (const relativePath of sorted(actualFiles)) {
    problems.push(`unexpected ${relativePath}`);
  }

  if (problems.length > 0) {
    throw new Error(
      `AI knowledge artifacts are not clean:\n- ${problems.join('\n- ')}\nRun pnpm knowledge:build.`,
    );
  }

  process.stdout.write(
    'AI manifests match public exports and generated artifacts.\n',
  );
}

const command = process.argv[2] ?? 'check';
const expected = await collectExpectedFiles();

if (command === 'build') {
  await build(expected);
} else if (command === 'check') {
  await check(expected);
} else {
  throw new Error(`Unknown command: ${command}`);
}
