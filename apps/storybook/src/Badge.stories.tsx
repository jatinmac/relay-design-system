import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, Stack } from '@relay/react';

const meta = {
  title: 'Universal/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Badge>Neutral</Badge>
      <Badge tone="info">Information</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Pending review</Badge>
      <Badge tone="critical">Access revoked</Badge>
    </Stack>
  ),
};
