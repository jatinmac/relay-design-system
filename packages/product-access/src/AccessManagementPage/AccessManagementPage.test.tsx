import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DesignSystemProvider, type CollectionState } from '@relay/react';

import {
  AccessManagementPage,
  type AccessManagementPageProps,
  type AccessMember,
} from './AccessManagementPage';

const members: AccessMember[] = [
  {
    id: 'owner',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'owner',
    status: 'active',
    lastActiveLabel: 'Today',
  },
  {
    id: 'member',
    name: 'Morgan Lee',
    role: 'viewer',
    status: 'pending',
  },
];

const readyCollection: CollectionState<AccessMember> = {
  status: 'ready',
  items: members,
};

function createProps(
  overrides: Partial<AccessManagementPageProps> = {},
): AccessManagementPageProps {
  return {
    collection: readyCollection,
    permissions: {
      canInvite: true,
      canChangeRoles: true,
      canRemoveMembers: true,
    },
    selection: new Set(),
    sort: { column: 'name', direction: 'ascending' },
    inviteState: { status: 'idle' },
    memberMutationState: { status: 'idle' },
    onSelectionChange: vi.fn(),
    onSortChange: vi.fn(),
    onInviteMember: vi.fn(() => true),
    onChangeRole: vi.fn(),
    onRemoveMember: vi.fn(),
    ...overrides,
  };
}

function renderPage(props: AccessManagementPageProps) {
  return render(
    <DesignSystemProvider theme="relay">
      <AccessManagementPage {...props} />
    </DesignSystemProvider>,
  );
}

describe('AccessManagementPage', () => {
  it('composes sorting, selection, role changes, and removal callbacks', async () => {
    const user = userEvent.setup();
    const props = createProps();
    renderPage(props);

    await user.click(screen.getByRole('button', { name: /Member/ }));
    expect(props.onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'descending',
    });

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Morgan Lee' }),
    );
    expect(props.onSelectionChange).toHaveBeenCalledWith(new Set(['member']));

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Role for Morgan Lee' }),
      'editor',
    );
    expect(props.onChangeRole).toHaveBeenCalledWith('member', 'editor');

    await user.click(screen.getByRole('button', { name: 'Remove Morgan Lee' }));
    expect(props.onRemoveMember).toHaveBeenCalledWith('member');
  });

  it('enforces restricted permissions with an explanation', () => {
    renderPage(
      createProps({
        permissions: {
          canInvite: false,
          canChangeRoles: false,
          canRemoveMembers: false,
          restrictionReason: 'Only workspace owners can manage access.',
        },
      }),
    );

    expect(screen.getByRole('note')).toHaveTextContent(
      'Only workspace owners can manage access.',
    );
    expect(
      screen.getByRole('button', { name: 'Invite member' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('combobox', { name: 'Role for Morgan Lee' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Remove Morgan Lee' }),
    ).toBeDisabled();
  });

  it('submits an invitation and closes only after application success', async () => {
    const user = userEvent.setup();
    const onInviteMember = vi.fn(() => true);
    renderPage(createProps({ onInviteMember }));

    const trigger = screen.getByRole('button', { name: 'Invite member' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', {
      name: 'Invite a member',
    });
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Email address' }),
      'new@example.com',
    );
    await user.selectOptions(
      within(dialog).getByRole('combobox', { name: 'Role' }),
      'editor',
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Send invitation' }),
    );

    expect(onInviteMember).toHaveBeenCalledWith({
      email: 'new@example.com',
      role: 'editor',
    });
    expect(
      screen.queryByRole('dialog', { name: 'Invite a member' }),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('shows application mutation errors', async () => {
    const user = userEvent.setup();
    const onInviteMember = vi.fn(() => false);
    renderPage(
      createProps({
        inviteState: {
          status: 'error',
          message: 'That email already belongs to a member.',
        },
        memberMutationState: {
          status: 'error',
          message: 'The role update was rolled back.',
          memberId: 'member',
        },
        onInviteMember,
      }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The role update was rolled back.',
    );
    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Invite a member',
    });
    expect(within(dialog).getByRole('alert')).toHaveTextContent(
      'That email already belongs to a member.',
    );
  });

  it('locks dismissal and duplicate submission while an invite is pending', async () => {
    const user = userEvent.setup();
    renderPage(
      createProps({
        inviteState: { status: 'pending' },
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Invite a member',
    });
    expect(
      within(dialog).getByRole('button', { name: 'Sending invitation' }),
    ).toBeDisabled();
    expect(
      within(dialog).getByRole('button', { name: 'Cancel' }),
    ).toBeDisabled();

    await user.keyboard('{Escape}');
    expect(dialog).toBeInTheDocument();
  });
});
