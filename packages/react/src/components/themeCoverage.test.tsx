import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  DesignSystemProvider,
  Dialog,
  FormField,
  IconButton,
  Stack,
  StatePanel,
  TextField,
  type DataTableColumn,
} from '../index';

interface ExampleRow {
  id: string;
  name: string;
}

const columns: Array<DataTableColumn<ExampleRow>> = [
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
    isRowHeader: true,
  },
];

describe.each(['relay', 'northstar'])('%s theme coverage', (theme) => {
  it('renders every universal family without brand-specific component props', () => {
    const { container } = render(
      <DesignSystemProvider theme={theme} colorMode="dark" density="compact">
        <Stack>
          <Button>Action</Button>
          <IconButton aria-label="Add" icon={<span>+</span>} />
          <TextField label="Name" />
          <FormField label="Notes">
            {(controlProps) => <textarea {...controlProps} />}
          </FormField>
          <Checkbox label="Selected" />
          <Badge tone="success">Active</Badge>
          <StatePanel status="empty" title="No content" />
          <Dialog isOpen={false} onOpenChange={() => undefined} title="Details">
            Content
          </Dialog>
          <DataTable
            ariaLabel="Examples"
            columns={columns}
            collection={{
              status: 'ready',
              items: [{ id: 'one', name: 'Example' }],
            }}
            getRowId={(row) => row.id}
          />
        </Stack>
      </DesignSystemProvider>,
    );

    const boundary = container.querySelector('[data-ds-theme]');
    expect(boundary).toHaveAttribute('data-ds-theme', theme);
    expect(boundary).toHaveAttribute('data-ds-color-mode', 'dark');
    expect(boundary).toHaveAttribute('data-ds-density', 'compact');
    expect(boundary).toHaveTextContent('Action');
    expect(boundary).toHaveTextContent('Example');
  });
});
