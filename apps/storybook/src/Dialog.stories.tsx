import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Button, Dialog, Stack, TextField } from '@relay/react';

const meta = {
  title: 'Universal/Dialog',
  component: Dialog,
  args: {
    isOpen: false,
    onOpenChange: () => undefined,
    title: 'Dialog title',
    children: 'Dialog content',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogExample() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Invite a member"
        description="They will receive an email with an invitation link."
        footer={
          <Stack direction="row" gap="sm" wrap>
            <Button variant="quiet" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invitation</Button>
          </Stack>
        }
      >
        <TextField label="Email address" type="email" required />
      </Dialog>
    </>
  );
}

export const Controlled: Story = {
  render: () => <DialogExample />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole('dialog', {
      name: 'Invite a member',
    });
    await expect(dialog).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Close dialog' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
