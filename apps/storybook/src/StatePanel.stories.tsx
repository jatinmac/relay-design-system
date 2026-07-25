import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Stack, StatePanel } from '@relay/react';

const meta = {
  title: 'Universal/StatePanel',
  component: StatePanel,
  args: {
    status: 'empty',
    title: 'State title',
  },
} satisfies Meta<typeof StatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateMatrix: Story = {
  render: () => (
    <Stack gap="lg">
      <StatePanel status="loading" title="Loading members" />
      <StatePanel
        status="empty"
        title="No members yet"
        description="Invite a teammate to start collaborating."
        action={<Button>Invite member</Button>}
      />
      <StatePanel
        status="no-results"
        title="No matching members"
        description="Try changing or clearing your filters."
      />
      <StatePanel
        status="error"
        title="Members could not load"
        description="Check your connection and try again."
        action={<Button variant="secondary">Retry</Button>}
      />
      <StatePanel
        status="no-access"
        title="You do not have access"
        description="Ask an administrator for the required permission."
      />
    </Stack>
  ),
};
