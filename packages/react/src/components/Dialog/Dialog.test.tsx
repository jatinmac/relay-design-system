import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../Button/Button';
import { DesignSystemProvider } from '../../provider/DesignSystemProvider';
import { Dialog } from './Dialog';

function DialogHarness({ dismissible = true }: { dismissible?: boolean }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <DesignSystemProvider theme="relay">
      <Button onClick={() => setOpen(true)}>Open details</Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Member details"
        description="Review the current access."
        dismissible={dismissible}
      >
        <Button>Continue</Button>
      </Dialog>
    </DesignSystemProvider>
  );
}

describe('Dialog', () => {
  it('manages initial focus, Escape dismissal, and focus restoration', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    const trigger = screen.getByRole('button', { name: 'Open details' });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', {
      name: 'Member details',
    });
    expect(dialog).toHaveAccessibleDescription('Review the current access.');
    expect(dialog.closest('[data-ds-theme]')).toHaveAttribute(
      'data-ds-theme',
      'relay',
    );
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('traps keyboard focus within the modal', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Open details' }));
    const close = await screen.findByRole('button', { name: 'Close dialog' });
    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(close).toHaveFocus();
    await user.tab();
    expect(continueButton).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
  });

  it('can require an explicit application action to close', async () => {
    const user = userEvent.setup();
    render(<DialogHarness dismissible={false} />);

    await user.click(screen.getByRole('button', { name: 'Open details' }));
    await screen.findByRole('dialog', { name: 'Member details' });
    await user.keyboard('{Escape}');

    expect(
      screen.getByRole('dialog', { name: 'Member details' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close dialog' }),
    ).not.toBeInTheDocument();
  });
});
