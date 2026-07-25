import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import StyleDictionary from 'style-dictionary';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
export const repositoryRoot = resolve(scriptDirectory, '../../..');
const tokenPackageRoot = resolve(repositoryRoot, 'packages/tokens');
const baseTokenPath = resolve(tokenPackageRoot, 'src/base.tokens.json');
const supportedThemes = ['relay', 'northstar'];

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertValidSegment(segment, sourceName) {
  if (!/^[A-Za-z0-9][A-Za-z0-9]*$/.test(segment)) {
    throw new Error(
      `${sourceName}: token segment "${segment}" must be alphanumeric camelCase`,
    );
  }
}

export function collectTokens(
  document,
  sourceName = 'token document',
  path = [],
  inheritedType,
  result = new Map(),
) {
  if (!isObject(document)) {
    throw new Error(`${sourceName}: expected a JSON object`);
  }

  if (Object.hasOwn(document, '$value')) {
    if (path.length === 0) {
      throw new Error(`${sourceName}: a root token must have a name`);
    }

    const type = document.$type ?? inheritedType;
    if (typeof type !== 'string' || type.length === 0) {
      throw new Error(
        `${sourceName}: ${path.join('.')} has no effective $type`,
      );
    }

    const tokenPath = path.join('.');
    if (result.has(tokenPath)) {
      throw new Error(`${sourceName}: duplicate token ${tokenPath}`);
    }

    result.set(tokenPath, {
      description:
        typeof document.$description === 'string'
          ? document.$description
          : undefined,
      path: tokenPath,
      type,
      value: document.$value,
    });
    return result;
  }

  const nextType =
    typeof document.$type === 'string' ? document.$type : inheritedType;

  for (const [key, value] of Object.entries(document)) {
    if (key.startsWith('$')) {
      continue;
    }

    assertValidSegment(key, sourceName);
    collectTokens(value, sourceName, [...path, key], nextType, result);
  }

  return result;
}

export function contractSignature(tokens) {
  return [...tokens.values()]
    .map((token) => [token.path, token.type])
    .sort(([first], [second]) => first.localeCompare(second));
}

function mergeTokenMaps(label, ...maps) {
  const merged = new Map();
  for (const map of maps) {
    for (const [path, token] of map) {
      if (merged.has(path)) {
        throw new Error(`${label}: duplicate token ${path}`);
      }
      merged.set(path, token);
    }
  }
  return merged;
}

function assertSameContract(firstLabel, first, secondLabel, second) {
  const firstSignature = contractSignature(first);
  const secondSignature = contractSignature(second);

  if (JSON.stringify(firstSignature) !== JSON.stringify(secondSignature)) {
    const firstMap = new Map(firstSignature);
    const secondMap = new Map(secondSignature);
    const differences = [];

    for (const [path, type] of firstMap) {
      if (!secondMap.has(path)) {
        differences.push(`${secondLabel} is missing ${path}`);
      } else if (secondMap.get(path) !== type) {
        differences.push(
          `${path} has type ${type} in ${firstLabel} and ${secondMap.get(path)} in ${secondLabel}`,
        );
      }
    }
    for (const path of secondMap.keys()) {
      if (!firstMap.has(path)) {
        differences.push(`${firstLabel} is missing ${path}`);
      }
    }

    throw new Error(
      `Token contract mismatch:\n${differences.map((item) => `- ${item}`).join('\n')}`,
    );
  }
}

function collectReferences(value, result = []) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/\{([^}]+)\}/g)) {
      result.push(match[1]);
    }
    return result;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferences(item, result);
    }
    return result;
  }

  if (isObject(value)) {
    for (const item of Object.values(value)) {
      collectReferences(item, result);
    }
  }

  return result;
}

function validateReferences(label, tokens) {
  const failures = [];
  for (const token of tokens.values()) {
    for (const reference of collectReferences(token.value)) {
      if (!tokens.has(reference)) {
        failures.push(`${token.path} references missing token ${reference}`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `${label} contains invalid references:\n${failures
        .map((failure) => `- ${failure}`)
        .join('\n')}`,
    );
  }
}

function themeRoot(theme) {
  if (!supportedThemes.includes(theme)) {
    throw new Error(
      `Unknown theme "${theme}". Expected one of: ${supportedThemes.join(', ')}`,
    );
  }
  return resolve(repositoryRoot, `packages/theme-${theme}`);
}

function themePaths(theme) {
  const root = themeRoot(theme);
  const tokens = resolve(root, 'src/tokens');
  return {
    common: resolve(tokens, 'semantic.common.tokens.json'),
    comfortable: resolve(tokens, 'density.comfortable.tokens.json'),
    compact: resolve(tokens, 'density.compact.tokens.json'),
    dark: resolve(tokens, 'semantic.dark.tokens.json'),
    output: resolve(root, 'dist/theme.css'),
    primitives: resolve(tokens, 'primitives.tokens.json'),
    light: resolve(tokens, 'semantic.light.tokens.json'),
    root,
  };
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function readTokenMap(path) {
  return collectTokens(await readJson(path), path);
}

async function loadTheme(theme) {
  const paths = themePaths(theme);
  const [base, primitives, common, light, dark, comfortable, compact] =
    await Promise.all([
      readTokenMap(baseTokenPath),
      readTokenMap(paths.primitives),
      readTokenMap(paths.common),
      readTokenMap(paths.light),
      readTokenMap(paths.dark),
      readTokenMap(paths.comfortable),
      readTokenMap(paths.compact),
    ]);

  return {
    maps: { base, primitives, common, light, dark, comfortable, compact },
    paths,
  };
}

export async function validateTheme(theme) {
  const loaded = await loadTheme(theme);
  const { maps } = loaded;
  const lightContract = mergeTokenMaps(
    `${theme} light`,
    maps.common,
    maps.light,
  );
  const darkContract = mergeTokenMaps(`${theme} dark`, maps.common, maps.dark);

  assertSameContract(
    `${theme} light`,
    lightContract,
    `${theme} dark`,
    darkContract,
  );
  assertSameContract(
    `${theme} comfortable`,
    maps.comfortable,
    `${theme} compact`,
    maps.compact,
  );

  for (const [variant, semantic, density] of [
    ['light comfortable', maps.light, maps.comfortable],
    ['light compact', maps.light, maps.compact],
    ['dark comfortable', maps.dark, maps.comfortable],
    ['dark compact', maps.dark, maps.compact],
  ]) {
    const complete = mergeTokenMaps(
      `${theme} ${variant}`,
      maps.base,
      maps.primitives,
      maps.common,
      semantic,
      density,
    );
    validateReferences(`${theme} ${variant}`, complete);
  }

  return loaded;
}

export async function validateAllThemes() {
  const [relay, northstar] = await Promise.all(
    supportedThemes.map((theme) => validateTheme(theme)),
  );

  const relaySemantic = mergeTokenMaps(
    'relay semantic',
    relay.maps.common,
    relay.maps.light,
  );
  const northstarSemantic = mergeTokenMaps(
    'northstar semantic',
    northstar.maps.common,
    northstar.maps.light,
  );

  assertSameContract(
    'relay semantic',
    relaySemantic,
    'northstar semantic',
    northstarSemantic,
  );
  assertSameContract(
    'relay density',
    relay.maps.comfortable,
    'northstar density',
    northstar.maps.comfortable,
  );

  return { northstar, relay };
}

function kebabCase(segment) {
  return segment
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

export function cssVariableName(path) {
  return `--ds-${path.split('.').map(kebabCase).join('-')}`;
}

function dimensionToString(value, path) {
  if (
    !isObject(value) ||
    typeof value.value !== 'number' ||
    typeof value.unit !== 'string'
  ) {
    throw new Error(`${path} must be a DTCG dimension object`);
  }
  return `${value.value}${value.unit}`;
}

function renderTypeScript(tokens, breakpoints) {
  const tokenNames = [...tokens.keys()].sort();
  const breakpointEntries = [...breakpoints.values()].sort((first, second) =>
    first.path.localeCompare(second.path),
  );

  const tokenNameLines = tokenNames.map((name) => `  '${name}',`).join('\n');
  const cssVarLines = tokenNames
    .map((name) => {
      const variable = cssVariableName(name);
      const singleLine = `  '${name}': '${variable}',`;
      return singleLine.length <= 80
        ? singleLine
        : `  '${name}':\n    '${variable}',`;
    })
    .join('\n');
  const breakpointLines = breakpointEntries
    .map((token) => {
      const name = token.path.replace('breakpoint.', '');
      return `  ${name}: '${dimensionToString(token.value, token.path)}',`;
    })
    .join('\n');

  return `// This file is generated by @relay/tokens. Do not edit directly.

export const tokenNames = [
${tokenNameLines}
] as const;

export type TokenName = (typeof tokenNames)[number];
export type CssVarName = \`--ds-\${string}\`;

export const cssVarNames = {
${cssVarLines}
} as const satisfies Record<TokenName, CssVarName>;

export const breakpoints = {
${breakpointLines}
} as const;

export const breakpointNames = Object.keys(breakpoints) as Array<
  keyof typeof breakpoints
>;

export type BreakpointName = keyof typeof breakpoints;
`;
}

function renderTokenManifest(tokens, breakpoints) {
  return `${JSON.stringify(
    {
      schemaVersion: 1,
      tokens: [...tokens.values()]
        .sort((first, second) => first.path.localeCompare(second.path))
        .map((token) => ({
          cssVariable: cssVariableName(token.path),
          description: token.description,
          name: token.path,
          type: token.type,
        })),
      breakpoints: Object.fromEntries(
        [...breakpoints.values()]
          .sort((first, second) => first.path.localeCompare(second.path))
          .map((token) => [
            token.path.replace('breakpoint.', ''),
            dimensionToString(token.value, token.path),
          ]),
      ),
    },
    null,
    2,
  )}\n`;
}

function renderFoundationCss(breakpoints) {
  const declarations = [...breakpoints.values()]
    .sort((first, second) => first.path.localeCompare(second.path))
    .map(
      (token) =>
        `    ${cssVariableName(token.path)}: ${dimensionToString(token.value, token.path)};`,
    )
    .join('\n');

  return `/* Generated by @relay/tokens. Do not edit directly. */
@layer tokens {
  :root {
${declarations}
  }
}
`;
}

export async function renderContractArtifacts() {
  const { relay } = await validateAllThemes();
  const semantic = mergeTokenMaps(
    'canonical token contract',
    relay.maps.common,
    relay.maps.light,
    relay.maps.comfortable,
  );

  return {
    css: renderFoundationCss(relay.maps.base),
    manifest: renderTokenManifest(semantic, relay.maps.base),
    typescript: renderTypeScript(semantic, relay.maps.base),
  };
}

async function writeOutput(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}

export async function buildContract() {
  const artifacts = await renderContractArtifacts();
  await Promise.all([
    writeOutput(
      resolve(tokenPackageRoot, 'src/generated/tokens.ts'),
      artifacts.typescript,
    ),
    writeOutput(
      resolve(tokenPackageRoot, 'dist/tokens.json'),
      artifacts.manifest,
    ),
    writeOutput(resolve(tokenPackageRoot, 'dist/tokens.css'), artifacts.css),
  ]);
}

function indentCss(css, spaces) {
  const indentation = ' '.repeat(spaces);
  return css
    .trim()
    .split('\n')
    .map((line) => `${indentation}${line}`)
    .join('\n');
}

async function renderCssVariant({
  buildPath,
  destination,
  include,
  selector,
  source,
}) {
  const dictionary = new StyleDictionary({
    hooks: {
      transforms: {
        'ds/duration-css': {
          filter: (token) =>
            (token.$type === 'duration' || token.type === 'duration') &&
            isObject(token.$value ?? token.value),
          transform: (token) =>
            dimensionToString(
              token.$value ?? token.value,
              token.path.join('.'),
            ),
          transitive: true,
          type: 'value',
        },
      },
    },
    include,
    log: {
      verbosity: 'silent',
    },
    source,
    usesDtcg: true,
    platforms: {
      css: {
        buildPath,
        prefix: 'ds',
        transformGroup: 'css',
        transforms: ['ds/duration-css'],
        files: [
          {
            destination,
            filter: (token) =>
              token.path[0] !== 'primitive' && token.path[0] !== 'breakpoint',
            format: 'css/variables',
            options: {
              outputReferences: false,
              selector,
              showFileHeader: false,
              sort: 'name',
            },
          },
        ],
      },
    },
  });

  await dictionary.buildAllPlatforms();
  return readFile(resolve(buildPath, destination), 'utf8');
}

export async function renderThemeCss(theme) {
  const loaded = await validateTheme(theme);
  const { paths } = loaded;
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), `relay-${theme}-tokens-`),
  );

  try {
    const include = [baseTokenPath, paths.primitives];
    const [light, dark, systemDark, comfortable, compact] = await Promise.all([
      renderCssVariant({
        buildPath: temporaryDirectory,
        destination: 'light.css',
        include,
        selector: [
          `[data-ds-theme="${theme}"][data-ds-color-mode="light"]`,
          `[data-ds-theme="${theme}"]:not([data-ds-color-mode])`,
          `[data-ds-theme="${theme}"][data-ds-color-mode="system"]`,
        ].join(',\n'),
        source: [paths.common, paths.light],
      }),
      renderCssVariant({
        buildPath: temporaryDirectory,
        destination: 'dark.css',
        include,
        selector: `[data-ds-theme="${theme}"][data-ds-color-mode="dark"]`,
        source: [paths.common, paths.dark],
      }),
      renderCssVariant({
        buildPath: temporaryDirectory,
        destination: 'system-dark.css',
        include,
        selector: `[data-ds-theme="${theme}"][data-ds-color-mode="system"]`,
        source: [paths.common, paths.dark],
      }),
      renderCssVariant({
        buildPath: temporaryDirectory,
        destination: 'comfortable.css',
        include,
        selector: [
          `[data-ds-theme="${theme}"][data-ds-density="comfortable"]`,
          `[data-ds-theme="${theme}"]:not([data-ds-density])`,
        ].join(',\n'),
        source: [paths.comfortable],
      }),
      renderCssVariant({
        buildPath: temporaryDirectory,
        destination: 'compact.css',
        include,
        selector: `[data-ds-theme="${theme}"][data-ds-density="compact"]`,
        source: [paths.compact],
      }),
    ]);

    return `/* Generated by @relay/tokens. Do not edit directly. */
@layer reset, tokens, base, components, utilities;
@layer tokens {
${indentCss(light, 2)}

${indentCss(dark, 2)}

${indentCss(comfortable, 2)}

${indentCss(compact, 2)}

  @media (prefers-color-scheme: dark) {
${indentCss(systemDark, 4)}
  }

  @media (prefers-reduced-motion: reduce) {
    [data-ds-theme="${theme}"] {
      --ds-motion-duration-fast: var(--ds-motion-duration-reduced);
      --ds-motion-duration-normal: var(--ds-motion-duration-reduced);
      --ds-motion-duration-slow: var(--ds-motion-duration-reduced);
    }
  }
}
`;
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}

export async function buildTheme(theme) {
  const paths = themePaths(theme);
  await writeOutput(paths.output, await renderThemeCss(theme));
}

async function assertFileMatches(path, expected) {
  let current;
  try {
    current = await readFile(path, 'utf8');
  } catch {
    throw new Error(`Generated file is missing: ${path}`);
  }

  if (current !== expected) {
    throw new Error(
      `Generated file is stale: ${path}\nRun "pnpm tokens:build" and commit the result.`,
    );
  }
}

export async function checkGeneratedArtifacts() {
  const artifacts = await renderContractArtifacts();
  await Promise.all([
    assertFileMatches(
      resolve(tokenPackageRoot, 'src/generated/tokens.ts'),
      artifacts.typescript,
    ),
    assertFileMatches(
      resolve(tokenPackageRoot, 'dist/tokens.json'),
      artifacts.manifest,
    ),
    assertFileMatches(
      resolve(tokenPackageRoot, 'dist/tokens.css'),
      artifacts.css,
    ),
    ...supportedThemes.map(async (theme) =>
      assertFileMatches(themePaths(theme).output, await renderThemeCss(theme)),
    ),
  ]);
}
