import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import type {
  AccessMember,
  AccessPermissions,
  AccessRole,
  InviteMemberInput,
  InviteState,
  MemberMutationState,
} from '@relay/product-access';
import type { CollectionState, SortDescriptor } from '@relay/react';

import { requestJson } from '../api/client';
import type { AccessSnapshot } from '../api/mockApi';
import type { DemoScenario } from '../api/scenarios';

const loadingPermissions: AccessPermissions = {
  canInvite: false,
  canChangeRoles: false,
  canRemoveMembers: false,
  restrictionReason: 'Permissions are being checked.',
};

function updateMember(
  snapshot: AccessSnapshot | undefined,
  memberId: string,
  update: (member: AccessMember) => AccessMember,
) {
  if (!snapshot) {
    return snapshot;
  }

  return {
    ...snapshot,
    members: snapshot.members.map((member) =>
      member.id === memberId ? update(member) : member,
    ),
  };
}

function removeMember(snapshot: AccessSnapshot | undefined, memberId: string) {
  if (!snapshot) {
    return snapshot;
  }

  return {
    ...snapshot,
    members: snapshot.members.filter((member) => member.id !== memberId),
  };
}

export interface AccessManagementModel {
  collection: CollectionState<AccessMember>;
  permissions: AccessPermissions;
  selection: ReadonlySet<string>;
  sort: SortDescriptor;
  inviteState: InviteState;
  memberMutationState: MemberMutationState;
  onSelectionChange: (selection: ReadonlySet<string>) => void;
  onSortChange: (sort: SortDescriptor) => void;
  onInviteMember: (input: InviteMemberInput) => Promise<boolean>;
  onChangeRole: (memberId: string, role: AccessRole) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function useAccessManagement(
  scenario: DemoScenario,
): AccessManagementModel {
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());
  const [inviteState, setInviteState] = useState<InviteState>({
    status: 'idle',
  });
  const [memberMutationState, setMemberMutationState] =
    useState<MemberMutationState>({ status: 'idle' });
  const inviteLock = useRef(false);
  const requestPath = `/api/access?scenario=${scenario}&sortColumn=${sort.column}&sortDirection=${sort.direction}`;
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    AccessSnapshot,
    Error
  >(requestPath, requestJson, {
    keepPreviousData: true,
    refreshInterval: scenario === 'refreshing' ? 3500 : 0,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    setSelection(new Set());
    setInviteState({ status: 'idle' });
    setMemberMutationState({ status: 'idle' });
    inviteLock.current = false;
  }, [scenario]);

  const collection = useMemo<CollectionState<AccessMember>>(() => {
    if (error) {
      return {
        status: 'error',
        message: error.message,
        onRetry: () => {
          void mutate();
        },
      };
    }
    if (!data || isLoading) {
      return { status: 'loading' };
    }
    if (data.members.length === 0) {
      return { status: 'empty' };
    }
    return {
      status: 'ready',
      items: data.members,
      refreshing: isValidating,
    };
  }, [data, error, isLoading, isValidating, mutate]);

  async function inviteMember(input: InviteMemberInput) {
    if (inviteLock.current) {
      return false;
    }

    inviteLock.current = true;
    setInviteState({ status: 'pending' });
    try {
      const createdMember = await requestJson<AccessMember>(
        `/api/members?scenario=${scenario}`,
        {
          method: 'POST',
          body: JSON.stringify(input),
        },
      );
      await mutate(
        (current) =>
          current
            ? { ...current, members: [...current.members, createdMember] }
            : current,
        { revalidate: false },
      );
      setInviteState({ status: 'idle' });
      return true;
    } catch (mutationError) {
      setInviteState({
        status: 'error',
        message:
          mutationError instanceof Error
            ? mutationError.message
            : 'The invitation failed.',
      });
      return false;
    } finally {
      inviteLock.current = false;
    }
  }

  async function changeRole(memberId: string, role: AccessRole) {
    setMemberMutationState({
      status: 'pending',
      memberId,
      action: 'change-role',
    });
    try {
      await mutate(
        async (current) => {
          const updatedMember = await requestJson<AccessMember>(
            `/api/members/${memberId}?scenario=${scenario}`,
            {
              method: 'PATCH',
              body: JSON.stringify({ role }),
            },
          );
          return updateMember(current, memberId, () => updatedMember);
        },
        {
          optimisticData: (current) =>
            updateMember(current, memberId, (member) => ({
              ...member,
              role,
            })) ?? {
              members: [],
              permissions: loadingPermissions,
            },
          rollbackOnError: true,
          revalidate: false,
        },
      );
      setMemberMutationState({ status: 'idle' });
    } catch (mutationError) {
      setMemberMutationState({
        status: 'error',
        memberId,
        message:
          mutationError instanceof Error
            ? mutationError.message
            : 'The role update failed.',
      });
    }
  }

  async function removeSelectedMember(memberId: string) {
    setMemberMutationState({
      status: 'pending',
      memberId,
      action: 'remove',
    });
    try {
      await mutate(
        async (current) => {
          await requestJson<void>(
            `/api/members/${memberId}?scenario=${scenario}`,
            { method: 'DELETE' },
          );
          return removeMember(current, memberId);
        },
        {
          optimisticData: (current) =>
            removeMember(current, memberId) ?? {
              members: [],
              permissions: loadingPermissions,
            },
          rollbackOnError: true,
          revalidate: false,
        },
      );
      setSelection((current) => {
        const nextSelection = new Set(current);
        nextSelection.delete(memberId);
        return nextSelection;
      });
      setMemberMutationState({ status: 'idle' });
    } catch (mutationError) {
      setMemberMutationState({
        status: 'error',
        memberId,
        message:
          mutationError instanceof Error
            ? mutationError.message
            : 'The removal failed.',
      });
    }
  }

  return {
    collection,
    permissions: data?.permissions ?? loadingPermissions,
    selection,
    sort,
    inviteState,
    memberMutationState,
    onSelectionChange: setSelection,
    onSortChange: setSort,
    onInviteMember: inviteMember,
    onChangeRole: changeRole,
    onRemoveMember: removeSelectedMember,
    onRefresh: async () => {
      await mutate();
    },
  };
}
