import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from './FormField';

describe('FormField', () => {
  it('provides reusable label, hint, and error relationships', () => {
    render(
      <FormField
        label="Biography"
        hint="Keep it concise."
        error="Biography is required."
        required
      >
        {(controlProps) => <textarea {...controlProps} />}
      </FormField>,
    );

    const field = screen.getByRole('textbox', { name: 'Biography' });
    expect(field).toBeRequired();
    expect(field).toBeInvalid();
    expect(field).toHaveAccessibleDescription(
      'Keep it concise. Biography is required.',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Biography is required.',
    );
  });
});
