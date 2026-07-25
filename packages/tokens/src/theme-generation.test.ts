import { describe, expect, it } from 'vitest';

import { renderThemeCss, validateAllThemes } from '../scripts/lib.mjs';

describe('theme generation', () => {
  it('validates contract parity across themes, modes, and densities', async () => {
    await expect(validateAllThemes()).resolves.toBeDefined();
  });

  it('emits every provider state and reduced-motion overrides', async () => {
    const css = await renderThemeCss('relay');

    expect(css).toContain('[data-ds-color-mode="light"]');
    expect(css).toContain('[data-ds-color-mode="dark"]');
    expect(css).toContain('[data-ds-color-mode="system"]');
    expect(css).toContain('[data-ds-density="comfortable"]');
    expect(css).toContain('[data-ds-density="compact"]');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('emits only resolved semantic variables', async () => {
    const [relay, northstar] = await Promise.all([
      renderThemeCss('relay'),
      renderThemeCss('northstar'),
    ]);

    expect(relay).toContain(
      '@layer reset, tokens, base, components, utilities;',
    );
    expect(relay).not.toContain('--ds-primitive-');
    expect(northstar).not.toContain('--ds-primitive-');
    expect(relay).not.toContain('[object Object]');
    expect(northstar).not.toContain('[object Object]');
    expect(relay).not.toEqual(northstar);
  });
});
