import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('expresses semantic tone without adding an implicit live region', () => {
    render(<Badge tone="success">Active</Badge>);

    const badge = screen.getByText('Active').parentElement;
    expect(badge?.className).toEqual(expect.stringContaining('success'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
