import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Checkbox, Stack } from '@relay/react';

const meta = {
  title: 'Universal/Checkbox',
  component: Checkbox,
  args: {
    label: 'Checkbox',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxStateMatrix() {
  const [checked, setChecked] = useState(false);

  return (
    <Stack gap="lg">
      <Checkbox
        label="Receive product updates"
        description="Important account notices are always sent."
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Checkbox label="Some members selected" indeterminate />
      <Checkbox label="Required agreement" required />
      <Checkbox label="Read-only selection" checked readOnly />
      <Checkbox label="Unavailable option" disabled />
    </Stack>
  );
}

export const StateMatrix: Story = {
  render: () => <CheckboxStateMatrix />,
  play: async ({ canvas, userEvent }) => {
    const updates = canvas.getByRole('checkbox', {
      name: 'Receive product updates',
    });
    await expect(updates).not.toBeChecked();
    await userEvent.click(updates);
    await expect(updates).toBeChecked();

    const readOnly = canvas.getByRole('checkbox', {
      name: 'Read-only selection',
    });
    await userEvent.click(readOnly);
    await expect(readOnly).toBeChecked();
  },
};
