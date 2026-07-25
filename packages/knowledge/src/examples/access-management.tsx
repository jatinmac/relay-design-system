import { useState } from 'react';
import {
  AccessManagementPage,
  type AccessMember,
  type InviteState,
  type MemberMutationState,
} from '@relay/product-access';
import type { CollectionState, SortDescriptor } from '@relay/react';

const initialMembers: ReadonlyArray<AccessMember> = [
  {
    id: 'member-1',
    name: 'Morgan Lee',
    email: 'morgan@example.com',
    role: 'viewer',
    status: 'active',
    lastActiveLabel: 'Today',
  },
];

export function AccessManagementExample() {
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [inviteState, setInviteState] = useState<InviteState>({
    status: 'idle',
  });
  const [memberMutationState, setMemberMutationState] =
    useState<MemberMutationState>({ status: 'idle' });
  const collection: CollectionState<AccessMember> = {
    status: 'ready',
    items: [...initialMembers],
  };

  return (
    <AccessManagementPage
      collection={collection}
      permissions={{
        canInvite: true,
        canChangeRoles: true,
        canRemoveMembers: true,
      }}
      selection={selection}
      sort={sort}
      inviteState={inviteState}
      memberMutationState={memberMutationState}
      onSelectionChange={setSelection}
      onSortChange={setSort}
      onInviteMember={async () => {
        setInviteState({ status: 'pending' });
        // The application owns the HTTP request and cache update.
        setInviteState({ status: 'idle' });
        return true;
      }}
      onChangeRole={async (memberId) => {
        setMemberMutationState({
          status: 'pending',
          memberId,
          action: 'change-role',
        });
        // Update the cache optimistically and roll it back if the request fails.
        setMemberMutationState({ status: 'idle' });
      }}
      onRemoveMember={async (memberId) => {
        setMemberMutationState({
          status: 'pending',
          memberId,
          action: 'remove',
        });
        // Confirm and execute the application-owned mutation.
        setMemberMutationState({ status: 'idle' });
      }}
    />
  );
}
