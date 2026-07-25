import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('supports pointer and keyboard changes with a description', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Select member"
        description="Adds this member to the bulk action."
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Select member' });
    expect(checkbox).toHaveAccessibleDescription(
      'Adds this member to the bulk action.',
    );

    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    checkbox.focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('exposes indeterminate state and prevents read-only changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox
        label="Select all"
        indeterminate
        readOnly
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute('aria-readonly', 'true');

    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
