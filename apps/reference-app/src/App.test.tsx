import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { App } from './App';
import { resetMockApi } from './api/mockApi';

describe('reference application', () => {
  beforeEach(() => {
    resetMockApi();
  });

  it('demonstrates request states and permission restrictions', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading data');
    expect(
      await screen.findByRole('table', { name: 'Workspace members' }),
    ).toBeVisible();

    await user.selectOptions(screen.getByLabelText('Scenario'), 'empty');
    expect(await screen.findByText('No data available')).toBeVisible();

    await user.selectOptions(
      screen.getByLabelText('Scenario'),
      'request-error',
    );
    expect(
      await screen.findByText('The member service is temporarily unavailable.'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();

    await user.selectOptions(screen.getByLabelText('Scenario'), 'restricted');
    expect(
      await screen.findByRole('table', { name: 'Workspace members' }),
    ).toBeVisible();
    expect(screen.getByRole('note')).toHaveTextContent(
      'Only workspace owners and administrators',
    );
    expect(
      screen.getByRole('button', { name: 'Invite member' }),
    ).toBeDisabled();
  });

  it('switches theme, color mode, and density without changing product markup', async () => {
    const user = userEvent.setup();
    render(<App />);

    const boundary = screen
      .getByRole('heading', { name: 'Production states' })
      .closest('[data-ds-theme]');
    expect(boundary).toHaveAttribute('data-ds-theme', 'relay');

    await user.click(screen.getByRole('radio', { name: 'Northstar' }));
    await user.selectOptions(screen.getByLabelText('Color mode'), 'dark');
    await user.selectOptions(screen.getByLabelText('Density'), 'compact');

    expect(boundary).toHaveAttribute('data-ds-theme', 'northstar');
    expect(boundary).toHaveAttribute('data-ds-color-mode', 'dark');
    expect(boundary).toHaveAttribute('data-ds-density', 'compact');
  });

  it('rolls back an optimistic role update when the mock mutation fails', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole('table', { name: 'Workspace members' });
    await user.selectOptions(
      screen.getByLabelText('Scenario'),
      'mutation-error',
    );
    const roleSelect = await screen.findByRole('combobox', {
      name: 'Role for Morgan Lee',
    });

    await user.selectOptions(roleSelect, 'editor');
    expect(roleSelect).toHaveValue('editor');
    expect(
      await screen.findByText('The role update failed and was rolled back.'),
    ).toBeVisible();
    await waitFor(() => expect(roleSelect).toHaveValue('viewer'));
  });

  it('surfaces duplicate invitation errors while preventing resubmission', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByRole('table', { name: 'Workspace members' });
    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Invite a member',
    });
    await user.type(
      screen.getByRole('textbox', { name: 'Email address' }),
      'avery@example.com',
    );
    const submit = screen.getByRole('button', { name: 'Send invitation' });
    await user.click(submit);

    expect(
      await screen.findByText(
        'That email already belongs to a workspace member.',
      ),
    ).toBeVisible();
    expect(dialog).toBeInTheDocument();
    expect(submit).toBeEnabled();
  });
});
