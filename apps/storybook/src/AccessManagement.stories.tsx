import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  AccessManagementPage,
  type AccessManagementPageProps,
  type AccessMember,
} from '@relay/product-access';

import { AccessManagementDocumentationExample } from './docs/examples/AccessManagementDocumentationExample';

const members: Array<AccessMember> = [
  {
    id: 'member-1',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'owner',
    status: 'active',
    lastActiveLabel: 'Today at 09:42',
  },
  {
    id: 'member-2',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    role: 'viewer',
    status: 'active',
    lastActiveLabel: '3 days ago',
  },
  {
    id: 'member-3',
    name: 'Pending invitation',
    email: 'new.member@example.com',
    role: 'editor',
    status: 'pending',
  },
];

const edgeCaseMembers: Array<AccessMember> = [
  {
    id: 'edge-1',
    name: 'Dr. Aleksandra-Chiamaka Fernández-Wojciechowski',
    email: 'a.fernandez-wojciechowski@international-example.test',
    role: 'admin',
    status: 'active',
    lastActiveLabel: 'Yesterday at 23:59 in the workspace time zone',
  },
  {
    id: 'edge-2',
    name: 'Name unavailable',
    role: 'viewer',
    status: 'pending',
  },
];

const fullPermissions = {
  canInvite: true,
  canChangeRoles: true,
  canRemoveMembers: true,
} as const;

const idleProps = {
  permissions: fullPermissions,
  selection: new Set<string>(),
  sort: { column: 'name', direction: 'ascending' },
  inviteState: { status: 'idle' },
  memberMutationState: { status: 'idle' },
  onSelectionChange: () => undefined,
  onSortChange: () => undefined,
  onInviteMember: () => false,
  onChangeRole: () => undefined,
  onRemoveMember: () => undefined,
} satisfies Omit<AccessManagementPageProps, 'collection'>;

const meta = {
  title: 'Product/Access management',
  component: AccessManagementPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AccessManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: members },
  },
  render: () => <AccessManagementDocumentationExample />,
  play: async ({ canvas, userEvent }) => {
    const morganSelection = canvas.getByRole('checkbox', {
      name: 'Select Morgan Lee',
    });
    await userEvent.click(morganSelection);
    await expect(morganSelection).toBeChecked();
    await expect(canvas.getByText('1 member selected')).toBeVisible();

    const role = canvas.getByRole('combobox', {
      name: 'Role for Morgan Lee',
    });
    await userEvent.selectOptions(role, 'editor');
    await expect(role).toHaveValue('editor');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Invite member' }),
    );
    await expect(
      await canvas.findByRole('dialog', { name: 'Invite a member' }),
    ).toBeInTheDocument();
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Email address' }),
      'storybook@example.com',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Send invitation' }),
    );
    await expect(canvas.getByText('storybook@example.com')).toBeVisible();
  },
};

export const InitialLoading: Story = {
  args: {
    ...idleProps,
    collection: { status: 'loading' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading data');
  },
};

export const Empty: Story = {
  args: {
    ...idleProps,
    collection: { status: 'empty' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'No data available',
    );
  },
};

export const RequestError: Story = {
  args: {
    ...idleProps,
    collection: {
      status: 'error',
      message: 'The member service is temporarily unavailable.',
      onRetry: () => undefined,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'The member service is temporarily unavailable.',
    );
    await expect(
      canvas.getByRole('button', { name: 'Try again' }),
    ).toBeEnabled();
  },
};

export const BackgroundRefresh: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: members, refreshing: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Refreshing data',
    );
    await expect(
      canvas.getByRole('table', { name: 'Workspace members' }),
    ).toBeVisible();
  },
};

export const RestrictedPermissions: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: members },
    permissions: {
      canInvite: false,
      canChangeRoles: false,
      canRemoveMembers: false,
      restrictionReason:
        'Only workspace owners and administrators can manage member access.',
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Invite member' }),
    ).toBeDisabled();
    await expect(canvas.getByRole('note')).toHaveTextContent(
      'Only workspace owners and administrators can manage member access.',
    );
  },
};

export const PendingRoleMutation: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: members },
    memberMutationState: {
      status: 'pending',
      memberId: 'member-2',
      action: 'change-role',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Updating member access',
    );
    await expect(
      canvas.getByRole('combobox', { name: 'Role for Morgan Lee' }),
    ).toBeDisabled();
  },
};

export const FailedMutation: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: members },
    memberMutationState: {
      status: 'error',
      memberId: 'member-2',
      message: 'The role update failed and was rolled back.',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'The role update failed and was rolled back.',
    );
  },
};

export const LongAndIncompleteContent: Story = {
  args: {
    ...idleProps,
    collection: { status: 'ready', items: edgeCaseMembers },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Dr. Aleksandra-Chiamaka Fernández-Wojciechowski'),
    ).toBeVisible();
    await expect(canvas.getByText('No email address')).toBeVisible();
    await expect(canvas.getByText('No recent activity')).toBeVisible();
  },
};
