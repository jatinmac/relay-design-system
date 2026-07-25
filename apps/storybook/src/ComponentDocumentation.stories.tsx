import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Badge,
  Button,
  Checkbox,
  IconButton,
  Stack,
  StatePanel,
  TextField,
} from '@relay/react';

import { componentDocumentation } from './docs/componentDocumentation';
import { DocumentationPage } from './docs/DocumentationPage';
import { AccessManagementDocumentationExample } from './docs/examples/AccessManagementDocumentationExample';
import { DataTableDocumentationExample } from './docs/examples/DataTableDocumentationExample';
import { DialogDocumentationExample } from './docs/examples/DialogDocumentationExample';

const meta = {
  title: 'Documentation/Components',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StackDocumentation: Story = {
  name: '01 Stack',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.stack}
      example={
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button>Save changes</Button>
          <Button variant="secondary">Cancel</Button>
        </Stack>
      }
    />
  ),
};

export const ButtonDocumentation: Story = {
  name: '02 Button and IconButton',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.buttons}
      example={
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button>Invite member</Button>
          <Button variant="secondary">Review</Button>
          <Button variant="critical">Remove access</Button>
          <IconButton aria-label="More actions" icon={<span>…</span>} />
        </Stack>
      }
    />
  ),
};

export const FormDocumentation: Story = {
  name: '03 FormField and TextField',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.forms}
      example={
        <Stack gap="md">
          <TextField
            name="documentation-work-email"
            label="Email address"
            type="email"
            hint="Use your work email address."
            required
          />
          <TextField
            name="documentation-display-name"
            label="Display name"
            error="This display name is already in use."
          />
        </Stack>
      }
    />
  ),
};

export const CheckboxDocumentation: Story = {
  name: '04 Checkbox',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.checkbox}
      example={
        <Stack gap="sm">
          <Checkbox name="updates" label="Product updates" defaultChecked />
          <Checkbox
            name="visible-members"
            label="Select all visible members"
            indeterminate
          />
          <Checkbox
            name="managed-setting"
            label="Managed by your organization"
            checked
            readOnly
          />
        </Stack>
      }
    />
  ),
};

export const BadgeDocumentation: Story = {
  name: '05 Badge',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.badge}
      example={
        <Stack direction="row" gap="sm" wrap>
          <Badge>Draft</Badge>
          <Badge tone="info">In review</Badge>
          <Badge tone="success">Active</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="critical">Blocked</Badge>
        </Stack>
      }
    />
  ),
};

export const StatePanelDocumentation: Story = {
  name: '06 StatePanel',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.statePanel}
      example={
        <StatePanel
          status="error"
          title="Unable to load members"
          description="The service did not respond. Existing access was not changed."
          action={<Button variant="secondary">Try again</Button>}
        />
      }
    />
  ),
};

export const DialogDocumentation: Story = {
  name: '07 Dialog',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.dialog}
      example={<DialogDocumentationExample />}
    />
  ),
};

export const DataTableDocumentation: Story = {
  name: '08 DataTable',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.dataTable}
      example={<DataTableDocumentationExample />}
    />
  ),
};

export const AccessManagementDocumentation: Story = {
  name: '09 AccessManagementPage',
  render: () => (
    <DocumentationPage
      content={componentDocumentation.accessManagement}
      example={<AccessManagementDocumentationExample />}
    />
  ),
};
