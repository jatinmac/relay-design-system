export interface TokenRecord {
  description?: string;
  path: string;
  type: string;
  value: unknown;
}

export function collectTokens(
  document: unknown,
  sourceName?: string,
): Map<string, TokenRecord>;

export function contractSignature(
  tokens: Map<string, TokenRecord>,
): ReadonlyArray<readonly [string, string]>;

export function cssVariableName(path: string): `--ds-${string}`;

export function renderThemeCss(theme: string): Promise<string>;

export function validateAllThemes(): Promise<unknown>;
