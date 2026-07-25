import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormField, Stack, TextField } from '@relay/react';

const meta = {
  title: 'Universal/Form fields',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StateMatrix: Story = {
  render: () => (
    <Stack gap="lg">
      <TextField
        label="Email address"
        type="email"
        hint="Use your work email address."
        placeholder="name@example.com"
        required
      />
      <TextField
        label="Display name"
        defaultValue="A very long localized display name that can wrap safely"
        error="This name is already in use."
      />
      <TextField label="Account ID" value="member-1042" readOnly />
      <TextField label="Managed field" value="Managed externally" disabled />
      <FormField label="Notes" hint="Optional context for reviewers.">
        {(controlProps) => <textarea {...controlProps} rows={4} />}
      </FormField>
    </Stack>
  ),
};
