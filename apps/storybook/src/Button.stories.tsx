import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, IconButton, Stack } from '@relay/react';

const meta = {
  title: 'Universal/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateMatrix: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack direction="row" gap="sm" wrap>
        <Button>Primary action</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="critical">Remove access</Button>
        <Button variant="quiet">Quiet action</Button>
      </Stack>
      <Stack direction="row" gap="sm" wrap>
        <Button size="sm">Small</Button>
        <Button size="md" loading>
          Saving changes
        </Button>
        <Button size="lg" disabled>
          Disabled
        </Button>
        <IconButton aria-label="Add member" icon={<span>+</span>} />
      </Stack>
    </Stack>
  ),
};
