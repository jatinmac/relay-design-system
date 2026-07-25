import { expect, test } from '@playwright/test';

const themes = ['relay', 'northstar'] as const;
const modes = ['light', 'dark'] as const;
const viewports = [
  { name: 'narrow', width: 390, height: 844, density: 'compact' },
  { name: 'medium', width: 800, height: 1_000, density: 'comfortable' },
  { name: 'wide', width: 1_440, height: 1_000, density: 'comfortable' },
] as const;

for (const theme of themes) {
  for (const mode of modes) {
    for (const viewport of viewports) {
      test(`${theme} ${mode} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto('/');
        await expect(
          page.getByRole('table', { name: 'Workspace members' }),
        ).toBeVisible();

        if (theme === 'northstar') {
          await page.getByRole('radio', { name: 'Northstar' }).check();
        }
        await page.getByLabel('Color mode').selectOption(mode);
        await page.getByLabel('Density').selectOption(viewport.density);
        await expect(page.locator('[data-ds-theme]')).toHaveAttribute(
          'data-ds-theme',
          theme,
        );
        await expect(page.locator('[data-ds-theme]')).toHaveAttribute(
          'data-ds-color-mode',
          mode,
        );
        await page.evaluate(() => document.fonts.ready);

        await expect(page).toHaveScreenshot(
          `reference-${theme}-${mode}-${viewport.name}.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            fullPage: true,
            maxDiffPixelRatio: 0.01,
          },
        );
      });
    }
  }
}

test('restricted permissions state', async ({ page }) => {
  await page.setViewportSize({ width: 1_440, height: 1_000 });
  await page.goto('/');
  await expect(
    page.getByRole('table', { name: 'Workspace members' }),
  ).toBeVisible();
  await page.getByLabel('Scenario').selectOption('restricted');
  await expect(page.getByRole('note')).toBeVisible();
  await expect(page).toHaveScreenshot('reference-restricted.png', {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

test('long and incomplete content state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(
    page.getByRole('table', { name: 'Workspace members' }),
  ).toBeVisible();
  await page.getByLabel('Scenario').selectOption('edge-cases');
  await expect(
    page.getByText(
      'Dr. Ana María de la Cruz-Watanabe with an intentionally extended localized display name',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page).toHaveScreenshot('reference-edge-cases-narrow.png', {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
