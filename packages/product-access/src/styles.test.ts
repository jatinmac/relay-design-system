// @vitest-environment node

import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const componentStyles = new URL(
  './AccessManagementPage/AccessManagementPage.module.css',
  import.meta.url,
);

describe('product styling contract', () => {
  it('uses only variables from the public token contract', async () => {
    const [manifestSource, source] = await Promise.all([
      readFile(
        new URL(import.meta.resolve('@relay/tokens/tokens.json')),
        'utf8',
      ),
      readFile(componentStyles, 'utf8'),
    ]);
    const manifest = JSON.parse(manifestSource) as {
      tokens: Array<{ cssVariable: string }>;
    };
    const approvedVariables = new Set(
      manifest.tokens.map((token) => token.cssVariable),
    );
    const usedVariables = [...source.matchAll(/var\((--ds-[^) ,]+)/g)]
      .map((match) => match[1])
      .filter((variable): variable is string => variable !== undefined);

    expect(usedVariables.length).toBeGreaterThan(0);
    expect(
      usedVariables.filter((variable) => !approvedVariables.has(variable)),
    ).toEqual([]);
  });

  it('contains no raw color, spacing, radius, or motion values', async () => {
    const [manifestSource, source] = await Promise.all([
      readFile(
        new URL(import.meta.resolve('@relay/tokens/tokens.json')),
        'utf8',
      ),
      readFile(componentStyles, 'utf8'),
    ]);
    const manifest = JSON.parse(manifestSource) as {
      breakpoints: Record<string, string>;
    };
    const sourceWithoutContractBreakpoints = Object.values(
      manifest.breakpoints,
    ).reduce(
      (currentSource, breakpoint) => currentSource.replaceAll(breakpoint, ''),
      source,
    );

    expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(source).not.toMatch(/\brgba?\(/i);
    expect(sourceWithoutContractBreakpoints).not.toMatch(
      /\b\d+(?:\.\d+)?(?:px|rem|ms|s)\b/i,
    );
  });
});
