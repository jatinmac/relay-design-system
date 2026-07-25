import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('uses its required label as the accessible name', () => {
    render(<IconButton aria-label="Dismiss" icon={<span>×</span>} />);

    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '×' })).not.toBeInTheDocument();
  });
});
