import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from './Stack';

describe('Stack', () => {
  it('renders the requested semantic element and forwards its props', () => {
    render(
      <Stack as="ul" aria-label="Tasks" direction="row" gap="sm" wrap>
        <li>First</li>
        <li>Second</li>
      </Stack>,
    );

    const list = screen.getByRole('list', { name: 'Tasks' });
    expect(list.tagName).toBe('UL');
    expect(list.className).toEqual(expect.stringContaining('row'));
    expect(list.className).toEqual(expect.stringContaining('gap-sm'));
  });
});
