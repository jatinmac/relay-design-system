import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatePanel } from './StatePanel';

describe('StatePanel', () => {
  it('announces loading politely and exposes busy state', () => {
    render(<StatePanel status="loading" title="Loading members" />);

    const panel = screen.getByRole('status');
    expect(panel).toHaveAttribute('aria-live', 'polite');
    expect(panel).toHaveAttribute('aria-busy', 'true');
  });

  it('announces server errors assertively with recovery content', () => {
    render(
      <StatePanel
        status="error"
        title="Members could not load"
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
  });
});
