import { useId, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  DataTable,
  IconButton,
  Stack,
  type CollectionState,
  type DataTableColumn,
  type SortDescriptor,
} from '@relay/react';

import { InviteMemberDialog } from './InviteMemberDialog';
import styles from './AccessManagementPage.module.css';

export type AccessRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'pending';

export interface AccessMember {
  id: string;
  name: string;
  email?: string;
  role: AccessRole;
  status: MemberStatus;
  lastActiveLabel?: string;
}

export interface AccessPermissions {
  canInvite: boolean;
  canChangeRoles: boolean;
  canRemoveMembers: boolean;
  restrictionReason?: string;
}

export type InviteState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'error'; message: string };

export type MemberMutationState =
  | { status: 'idle' }
  | {
      status: 'pending';
      memberId: string;
      action: 'change-role' | 'remove';
    }
  | { status: 'error'; message: string; memberId?: string };

export interface InviteMemberInput {
  email: string;
  role: AccessRole;
}

export interface AccessManagementLabels {
  title: string;
  description: string;
  inviteMember: string;
  inviteTitle: string;
  inviteDescription: string;
  member: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  actions: string;
  cancel: string;
  sendInvitation: string;
  inviting: string;
  removeMember: (name: string) => string;
  roleForMember: (name: string) => string;
  selectedCount: (count: number) => string;
  clearSelection: string;
  missingEmail: string;
  missingActivity: string;
  permissionRestricted: string;
  updatingMember: string;
  ownerRoleLocked: string;
  memberTable: string;
  roleLabels: Record<AccessRole, string>;
  statusLabels: Record<MemberStatus, string>;
}

export interface AccessManagementPageProps {
  collection: CollectionState<AccessMember>;
  permissions: AccessPermissions;
  selection: ReadonlySet<string>;
  sort: SortDescriptor;
  inviteState: InviteState;
  memberMutationState: MemberMutationState;
  labels?: Partial<AccessManagementLabels>;
  onSelectionChange: (selection: ReadonlySet<string>) => void;
  onSortChange: (sort: SortDescriptor) => void;
  onInviteMember: (input: InviteMemberInput) => boolean | Promise<boolean>;
  onChangeRole: (memberId: string, role: AccessRole) => void | Promise<void>;
  onRemoveMember: (memberId: string) => void | Promise<void>;
}

const defaultLabels: AccessManagementLabels = {
  title: 'Access management',
  description: 'Invite members and manage workspace permissions.',
  inviteMember: 'Invite member',
  inviteTitle: 'Invite a member',
  inviteDescription: 'They will receive an email with an invitation link.',
  member: 'Member',
  email: 'Email address',
  role: 'Role',
  status: 'Status',
  lastActive: 'Last active',
  actions: 'Member actions',
  cancel: 'Cancel',
  sendInvitation: 'Send invitation',
  inviting: 'Sending invitation',
  removeMember: (name) => `Remove ${name}`,
  roleForMember: (name) => `Role for ${name}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'member' : 'members'} selected`,
  clearSelection: 'Clear selection',
  missingEmail: 'No email address',
  missingActivity: 'No recent activity',
  permissionRestricted: 'Your current role cannot perform this action.',
  updatingMember: 'Updating member access',
  ownerRoleLocked: 'The workspace owner role cannot be changed.',
  memberTable: 'Workspace members',
  roleLabels: {
    owner: 'Owner',
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  },
  statusLabels: {
    active: 'Active',
    pending: 'Pending',
  },
};

const editableRoles: ReadonlyArray<AccessRole> = ['admin', 'editor', 'viewer'];

function getMemberId(member: AccessMember) {
  return member.id;
}

function getMemberName(member: AccessMember) {
  return member.name;
}

export function AccessManagementPage({
  collection,
  permissions,
  selection,
  sort,
  inviteState,
  memberMutationState,
  labels: labelOverrides,
  onSelectionChange,
  onSortChange,
  onInviteMember,
  onChangeRole,
  onRemoveMember,
}: AccessManagementPageProps) {
  const titleId = useId();
  const restrictionId = useId();
  const [isInviteOpen, setInviteOpen] = useState(false);
  const labels = useMemo(
    () => ({ ...defaultLabels, ...labelOverrides }),
    [labelOverrides],
  );
  const restrictionReason =
    permissions.restrictionReason ?? labels.permissionRestricted;
  const hasRestrictions =
    !permissions.canInvite ||
    !permissions.canChangeRoles ||
    !permissions.canRemoveMembers;
  const columns = useMemo<Array<DataTableColumn<AccessMember>>>(
    () => [
      {
        id: 'name',
        header: labels.member,
        cell: (member) => (
          <span className={styles.memberIdentity}>
            <strong>{member.name}</strong>
            <span>{member.email ?? labels.missingEmail}</span>
          </span>
        ),
        sortable: true,
        isRowHeader: true,
      },
      {
        id: 'role',
        header: labels.role,
        cell: (member) => labels.roleLabels[member.role],
        sortable: true,
      },
      {
        id: 'status',
        header: labels.status,
        cell: (member) => (
          <Badge tone={member.status === 'active' ? 'success' : 'warning'}>
            {labels.statusLabels[member.status]}
          </Badge>
        ),
      },
      {
        id: 'lastActiveLabel',
        header: labels.lastActive,
        cell: (member) => member.lastActiveLabel ?? labels.missingActivity,
        sortable: true,
      },
    ],
    [labels],
  );
  const tableLabels = useMemo(
    () => ({ actions: labels.actions }),
    [labels.actions],
  );

  const isMemberPending = (memberId: string) =>
    memberMutationState.status === 'pending' &&
    memberMutationState.memberId === memberId;

  return (
    <section className={styles.root} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.headingGroup}>
          <h1 id={titleId} className={styles.title}>
            {labels.title}
          </h1>
          <p className={styles.description}>{labels.description}</p>
        </div>
        <Button
          disabled={!permissions.canInvite}
          aria-describedby={!permissions.canInvite ? restrictionId : undefined}
          title={!permissions.canInvite ? restrictionReason : undefined}
          onClick={() => setInviteOpen(true)}
        >
          {labels.inviteMember}
        </Button>
      </header>

      {hasRestrictions ? (
        <div id={restrictionId} className={styles.permissionNotice} role="note">
          <strong>{labels.permissionRestricted}</strong>
          <span>{restrictionReason}</span>
        </div>
      ) : null}

      {memberMutationState.status === 'error' ? (
        <div className={styles.mutationError} role="alert">
          {memberMutationState.message}
        </div>
      ) : null}

      {memberMutationState.status === 'pending' ? (
        <div className={styles.mutationPending} role="status">
          {labels.updatingMember}
        </div>
      ) : null}

      {selection.size > 0 ? (
        <div className={styles.selectionBar}>
          <span>{labels.selectedCount(selection.size)}</span>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => onSelectionChange(new Set())}
          >
            {labels.clearSelection}
          </Button>
        </div>
      ) : null}

      <DataTable
        ariaLabel={labels.memberTable}
        columns={columns}
        collection={collection}
        getRowId={getMemberId}
        sort={sort}
        onSortChange={onSortChange}
        selectionMode="multiple"
        selectedRowIds={selection}
        onSelectionChange={onSelectionChange}
        getRowLabel={getMemberName}
        labels={tableLabels}
        renderActions={(member) => (
          <Stack
            direction="row"
            gap="sm"
            align="center"
            justify="end"
            className={styles.memberActions ?? ''}
          >
            <select
              id={`${titleId}-role-${member.id}`}
              name={`role-${member.id}`}
              className={styles.roleSelect}
              aria-label={labels.roleForMember(member.name)}
              value={member.role}
              disabled={
                member.role === 'owner' ||
                !permissions.canChangeRoles ||
                isMemberPending(member.id)
              }
              aria-describedby={
                !permissions.canChangeRoles ? restrictionId : undefined
              }
              title={
                member.role === 'owner'
                  ? labels.ownerRoleLocked
                  : !permissions.canChangeRoles
                    ? restrictionReason
                    : undefined
              }
              onChange={(event) =>
                void onChangeRole(
                  member.id,
                  event.currentTarget.value as AccessRole,
                )
              }
            >
              {member.role === 'owner' ? (
                <option value="owner">{labels.roleLabels.owner}</option>
              ) : null}
              {editableRoles.map((role) => (
                <option key={role} value={role}>
                  {labels.roleLabels[role]}
                </option>
              ))}
            </select>
            {member.role !== 'owner' ? (
              <IconButton
                variant="quiet"
                size="sm"
                aria-label={labels.removeMember(member.name)}
                icon={<span aria-hidden="true">×</span>}
                disabled={
                  !permissions.canRemoveMembers || isMemberPending(member.id)
                }
                aria-describedby={
                  !permissions.canRemoveMembers ? restrictionId : undefined
                }
                title={
                  !permissions.canRemoveMembers ? restrictionReason : undefined
                }
                onClick={() => void onRemoveMember(member.id)}
              />
            ) : null}
          </Stack>
        )}
      />

      <InviteMemberDialog
        isOpen={isInviteOpen}
        inviteState={inviteState}
        labels={labels}
        onOpenChange={setInviteOpen}
        onInviteMember={onInviteMember}
      />
    </section>
  );
}

AccessManagementPage.displayName = 'AccessManagementPage';
