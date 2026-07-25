// @vitest-environment node

import { readFile, readdir } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const stylesRoot = new URL('./', import.meta.url);
const providerRoot = new URL('../provider/', import.meta.url);
const componentsRoot = new URL('../components/', import.meta.url);

async function readComponentStyles() {
  const paths = await readdir(componentsRoot, { recursive: true });
  const cssPaths = paths.filter((path) => path.endsWith('.module.css'));

  return Promise.all(
    cssPaths.map(async (path) => ({
      path,
      source: await readFile(new URL(path, componentsRoot), 'utf8'),
    })),
  );
}

describe('styling foundation', () => {
  it('declares the stable cascade layer order', async () => {
    const css = await readFile(new URL('layers.css', stylesRoot), 'utf8');

    expect(css.trim()).toBe(
      '@layer reset, tokens, base, components, utilities;',
    );
  });

  it('scopes reset and base rules to a theme boundary', async () => {
    const [reset, base] = await Promise.all([
      readFile(new URL('reset.css', stylesRoot), 'utf8'),
      readFile(new URL('base.css', stylesRoot), 'utf8'),
    ]);

    expect(reset).toContain('[data-ds-theme]');
    expect(base).toContain('[data-ds-theme]');
    expect(base).toContain(':focus-visible');
    expect(base).toContain('prefers-reduced-motion: reduce');
  });

  it('uses semantic variables without raw color values', async () => {
    const base = await readFile(new URL('base.css', stylesRoot), 'utf8');

    expect(base).toContain('var(--ds-color-background-canvas)');
    expect(base).toContain('var(--ds-color-border-focus)');
    expect(base).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(base).not.toMatch(/\brgba?\(/i);
  });

  it('references only variables from the public token contract', async () => {
    const [manifestSource, base, provider, componentStyles] = await Promise.all(
      [
        readFile(
          new URL(import.meta.resolve('@relay/tokens/tokens.json')),
          'utf8',
        ),
        readFile(new URL('base.css', stylesRoot), 'utf8'),
        readFile(
          new URL('DesignSystemProvider.module.css', providerRoot),
          'utf8',
        ),
        readComponentStyles(),
      ],
    );
    const manifest = JSON.parse(manifestSource) as {
      tokens: Array<{ cssVariable: string }>;
    };
    const approvedVariables = new Set(
      manifest.tokens.map((token) => token.cssVariable),
    );
    const componentSource = componentStyles
      .map(({ source }) => source)
      .join('\n');
    const usedVariables = [
      ...`${base}\n${provider}\n${componentSource}`.matchAll(
        /var\((--ds-[^) ,]+)/g,
      ),
    ]
      .map((match) => match[1])
      .filter((variable): variable is string => variable !== undefined);

    expect(usedVariables.length).toBeGreaterThan(0);
    expect(
      usedVariables.filter((variable) => !approvedVariables.has(variable)),
    ).toEqual([]);
  });

  it('does not place raw design values in component CSS', async () => {
    const [provider, componentStyles, manifestSource] = await Promise.all([
      readFile(
        new URL('DesignSystemProvider.module.css', providerRoot),
        'utf8',
      ),
      readComponentStyles(),
      readFile(
        new URL(import.meta.resolve('@relay/tokens/tokens.json')),
        'utf8',
      ),
    ]);
    const manifest = JSON.parse(manifestSource) as {
      breakpoints: Record<string, string>;
    };

    for (const { path, source } of [
      { path: 'provider/DesignSystemProvider.module.css', source: provider },
      ...componentStyles,
    ]) {
      const sourceWithoutContractBreakpoints = Object.values(
        manifest.breakpoints,
      ).reduce(
        (currentSource, breakpoint) => currentSource.replaceAll(breakpoint, ''),
        source,
      );

      expect(source, path).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source, path).not.toMatch(/\brgba?\(/i);
      expect(sourceWithoutContractBreakpoints, path).not.toMatch(
        /\b\d+(?:\.\d+)?(?:px|rem|ms|s)\b/i,
      );
    }
  });
});
