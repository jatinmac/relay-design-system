import { useId, useState, type FormEvent } from 'react';
import { Button, Dialog, Stack, TextField } from '@relay/react';

import type {
  AccessManagementLabels,
  AccessRole,
  InviteMemberInput,
  InviteState,
} from './AccessManagementPage';
import styles from './AccessManagementPage.module.css';

export interface InviteMemberDialogProps {
  isOpen: boolean;
  inviteState: InviteState;
  labels: AccessManagementLabels;
  onOpenChange: (isOpen: boolean) => void;
  onInviteMember: (input: InviteMemberInput) => boolean | Promise<boolean>;
}

const inviteRoleOptions: ReadonlyArray<AccessRole> = [
  'admin',
  'editor',
  'viewer',
];

export function InviteMemberDialog({
  isOpen,
  inviteState,
  labels,
  onOpenChange,
  onInviteMember,
}: InviteMemberDialogProps) {
  const formId = useId();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AccessRole>('viewer');
  const isPending = inviteState.status === 'pending';

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !isPending) {
      setEmail('');
      setRole('viewer');
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }

    try {
      const invited = await onInviteMember({ email, role });
      if (invited) {
        handleOpenChange(false);
      }
    } catch {
      // The application reports rejection details through inviteState.
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={labels.inviteTitle}
      description={labels.inviteDescription}
      dismissible={!isPending}
      footer={
        <Stack direction="row" gap="sm" justify="end" wrap>
          <Button
            variant="quiet"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {labels.cancel}
          </Button>
          <Button type="submit" form={formId} loading={isPending}>
            {isPending ? labels.inviting : labels.sendInvitation}
          </Button>
        </Stack>
      }
    >
      <form id={formId} className={styles.inviteForm} onSubmit={handleSubmit}>
        <TextField
          name="email"
          label={labels.email}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          autoComplete="email"
          required
          disabled={isPending}
        />
        <label className={styles.fieldLabel}>
          {labels.role}
          <select
            id={`${formId}-role`}
            name="role"
            className={styles.roleSelect}
            value={role}
            disabled={isPending}
            onChange={(event) =>
              setRole(event.currentTarget.value as AccessRole)
            }
          >
            {inviteRoleOptions.map((option) => (
              <option key={option} value={option}>
                {labels.roleLabels[option]}
              </option>
            ))}
          </select>
        </label>
        {inviteState.status === 'error' ? (
          <div className={styles.mutationError} role="alert">
            {inviteState.message}
          </div>
        ) : null}
      </form>
    </Dialog>
  );
}

InviteMemberDialog.displayName = 'InviteMemberDialog';
