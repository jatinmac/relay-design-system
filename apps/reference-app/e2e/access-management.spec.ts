import { expect, test, type Page } from '@playwright/test';

function monitorBrowserErrors(page: Page) {
  const errors: Array<string> = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function openReadyApplication(page: Page) {
  await page.goto('/');
  await expect(
    page.getByRole('table', { name: 'Workspace members' }),
  ).toBeVisible();
}

test('covers loading, empty, request error, long content, and permissions', async ({
  page,
}) => {
  const browserErrors = monitorBrowserErrors(page);
  await page.goto('/');
  const scenario = page.getByLabel('Scenario');
  await scenario.selectOption('loading');
  await expect(page.getByRole('status')).toContainText('Loading data');
  await scenario.selectOption('success');
  await expect(
    page.getByRole('table', { name: 'Workspace members' }),
  ).toBeVisible();

  await scenario.selectOption('empty');
  await expect(page.getByText('No data available')).toBeVisible();

  await scenario.selectOption('request-error');
  await expect(
    page.getByText('The member service is temporarily unavailable.'),
  ).toBeVisible();
  const retry = page.getByRole('button', { name: 'Try again' });
  await expect(retry).toBeEnabled();
  await retry.click();
  await expect(
    page.getByText('The member service is temporarily unavailable.'),
  ).toBeVisible();

  await scenario.selectOption('edge-cases');
  await expect(
    page.getByText(
      'Dr. Ana María de la Cruz-Watanabe with an intentionally extended localized display name',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText('No email address')).toBeVisible();
  await expect(
    page.getByRole('cell', { name: 'No recent activity' }),
  ).toHaveCount(2);

  await scenario.selectOption('restricted');
  await expect(
    page.getByRole('table', { name: 'Workspace members' }),
  ).toBeVisible();
  await expect(page.getByRole('note')).toContainText(
    'Only workspace owners and administrators',
  );
  await expect(
    page.getByRole('button', { name: 'Invite member' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('combobox', { name: 'Role for Morgan Lee' }),
  ).toBeDisabled();

  expect(browserErrors).toEqual([]);
});

test('prevents duplicate invitation submission and restores focus', async ({
  page,
}) => {
  const browserErrors = monitorBrowserErrors(page);
  await openReadyApplication(page);

  const trigger = page.getByRole('button', { name: 'Invite member' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Invite a member' });
  await expect(dialog).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Email address' })
    .fill('avery@example.com');
  await page.getByRole('button', { name: 'Send invitation' }).click();

  const pendingSubmit = page.getByRole('button', {
    name: 'Sending invitation',
  });
  await expect(pendingSubmit).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();

  await expect(
    page.getByText('That email already belongs to a workspace member.'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(browserErrors).toEqual([]);
});

test('rolls back an optimistic role update after a failed mutation', async ({
  page,
}) => {
  const browserErrors = monitorBrowserErrors(page);
  await openReadyApplication(page);
  await page.getByLabel('Scenario').selectOption('mutation-error');

  const role = page.getByRole('combobox', { name: 'Role for Morgan Lee' });
  await expect(role).toHaveValue('viewer');
  await role.selectOption('editor');
  await expect(role).toHaveValue('editor');
  await expect(
    page.getByText('The role update failed and was rolled back.'),
  ).toBeVisible();
  await expect(role).toHaveValue('viewer');
  expect(browserErrors).toEqual([]);
});

test('supports keyboard dialog, sorting, selection, and responsive overflow', async ({
  page,
}) => {
  const browserErrors = monitorBrowserErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openReadyApplication(page);

  const trigger = page.getByRole('button', { name: 'Invite member' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Close dialog' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('textbox', { name: 'Email address' }),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page.getByRole('button', { name: 'Close dialog' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  const memberSort = page.getByRole('button', {
    name: 'Member',
    exact: true,
  });
  await memberSort.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('row').nth(1).getByText('Samira Okafor', { exact: true }),
  ).toBeVisible();

  const morganSelection = page.getByRole('checkbox', {
    name: 'Select Morgan Lee',
  });
  await morganSelection.focus();
  await page.keyboard.press('Space');
  await expect(morganSelection).toBeChecked();
  await expect(page.getByText('1 member selected')).toBeVisible();

  const scroller = page.getByRole('region', { name: 'Scrollable table' });
  await scroller.focus();
  await expect(scroller).toBeFocused();
  expect(
    await scroller.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  expect(browserErrors).toEqual([]);
});

test('honors the reduced-motion contract', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openReadyApplication(page);

  expect(
    await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
  ).toBe(true);

  await page.getByRole('button', { name: 'Invite member' }).click();
  const dialog = page.getByRole('dialog', { name: 'Invite a member' });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
});
