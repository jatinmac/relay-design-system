import { useMemo, useState } from 'react';

import {
  AccessManagementPage,
  type AccessMember,
  type AccessRole,
} from '@relay/product-access';
import type { SortDescriptor } from '@relay/react';

const initialMembers: ReadonlyArray<AccessMember> = [
  {
    id: 'member-1',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'owner',
    status: 'active',
    lastActiveLabel: 'Today',
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

export function AccessManagementDocumentationExample() {
  const [members, setMembers] = useState<Array<AccessMember>>([
    ...initialMembers,
  ]);
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const sortedMembers = useMemo(() => {
    const multiplier = sort.direction === 'ascending' ? 1 : -1;
    return [...members].sort((left, right) => {
      const leftValue = String(left[sort.column as keyof AccessMember] ?? '');
      const rightValue = String(right[sort.column as keyof AccessMember] ?? '');
      return leftValue.localeCompare(rightValue) * multiplier;
    });
  }, [members, sort]);

  function changeRole(memberId: string, role: AccessRole) {
    setMembers((current) =>
      current.map((member) =>
        member.id === memberId ? { ...member, role } : member,
      ),
    );
  }

  function removeMember(memberId: string) {
    setMembers((current) => current.filter((member) => member.id !== memberId));
    setSelection((current) => {
      const next = new Set(current);
      next.delete(memberId);
      return next;
    });
  }

  return (
    <AccessManagementPage
      collection={{ status: 'ready', items: sortedMembers }}
      permissions={{
        canInvite: true,
        canChangeRoles: true,
        canRemoveMembers: true,
      }}
      selection={selection}
      sort={sort}
      inviteState={{ status: 'idle' }}
      memberMutationState={{ status: 'idle' }}
      onSelectionChange={setSelection}
      onSortChange={setSort}
      onInviteMember={({ email, role }) => {
        setMembers((current) => [
          ...current,
          {
            id: `invitation-${email}`,
            name: 'Pending invitation',
            email,
            role,
            status: 'pending',
          },
        ]);
        return true;
      }}
      onChangeRole={changeRole}
      onRemoveMember={removeMember}
    />
  );
}

AccessManagementDocumentationExample.displayName =
  'AccessManagementDocumentationExample';
