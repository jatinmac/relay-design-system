import { useState, type FormEvent } from 'react';
import {
  Button,
  Checkbox,
  DesignSystemProvider,
  Dialog,
  FormField,
  IconButton,
  Stack,
  TextField,
} from '@relay/react';

// Import @relay/theme-relay/theme.css and @relay/react/styles.css once in the
// application entry point before rendering this example.
export function ProviderAndFormExample() {
  const [accepted, setAccepted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <DesignSystemProvider
      theme="relay"
      colorMode="system"
      density="comfortable"
    >
      <form onSubmit={submit}>
        <Stack gap="md">
          <TextField
            label="Work email"
            name="email"
            type="email"
            hint="Use the address associated with your workspace."
            required
          />

          <FormField label="Role" required>
            {(controlProps) => (
              <select {...controlProps} name="role" required>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            )}
          </FormField>

          <Checkbox
            label="I understand the access policy"
            checked={accepted}
            onCheckedChange={setAccepted}
          />

          <Stack direction="row" gap="sm" wrap>
            <Button type="submit" disabled={!accepted}>
              Save access
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDialogOpen(true)}
            >
              Review policy
            </Button>
            <IconButton
              aria-label="Dismiss draft"
              icon={<span>×</span>}
              variant="quiet"
            />
          </Stack>
        </Stack>
      </form>

      <Dialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Access policy"
        description="Review the policy before granting workspace access."
        footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}
      >
        Grant only the permissions required for the person’s role.
      </Dialog>
    </DesignSystemProvider>
  );
}
