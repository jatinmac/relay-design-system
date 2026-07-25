import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, Stack } from '@relay/react';

const meta = {
  title: 'Universal/Stack',
  component: Stack,
  args: {
    direction: 'row',
    gap: 'md',
    align: 'center',
    wrap: true,
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Badge>First item</Badge>
      <Badge tone="info">Second item with localized content</Badge>
      <Badge tone="success">Third item</Badge>
    </Stack>
  ),
};
