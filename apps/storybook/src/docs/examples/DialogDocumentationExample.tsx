import { useState } from 'react';

import { Button, Dialog, Stack, TextField } from '@relay/react';

export function DialogDocumentationExample() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Invite a member"
        description="They will receive an email with an invitation link."
        footer={
          <Stack direction="row" gap="sm" justify="end" wrap>
            <Button variant="quiet" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invitation</Button>
          </Stack>
        }
      >
        <TextField
          name="documentation-email"
          label="Email address"
          type="email"
          required
        />
      </Dialog>
    </>
  );
}

DialogDocumentationExample.displayName = 'DialogDocumentationExample';
