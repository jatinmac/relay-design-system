import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextField } from './TextField';

describe('TextField', () => {
  it('connects its label, hint, error, and required state', () => {
    render(
      <TextField
        label="Email"
        hint="Use your work address."
        error="Enter a valid email."
        required
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(
      'Use your work address. Enter a valid email.',
    );
  });

  it('forwards native disabled and read-only behavior', () => {
    const { rerender } = render(<TextField label="Name" disabled />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();

    rerender(<TextField label="Name" readOnly />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute(
      'readonly',
    );
  });
});
