import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import {
  Badge,
  DataTable,
  IconButton,
  type DataTableColumn,
  type SortDescriptor,
} from '@relay/react';

interface Member {
  id: string;
  name: string;
  email?: string;
  role: string;
  status: 'active' | 'pending';
}

const members: Member[] = [
  {
    id: 'member-1',
    name: 'Avery Stone',
    email: 'avery@example.com',
    role: 'Administrator',
    status: 'active',
  },
  {
    id: 'member-2',
    name: 'Morgan Lee with a long localized display name',
    role: 'Viewer',
    status: 'pending',
  },
];

const columns: Array<DataTableColumn<Member>> = [
  {
    id: 'name',
    header: 'Member',
    cell: (member) => (
      <>
        <strong>{member.name}</strong>
        <div>{member.email ?? 'No email address'}</div>
      </>
    ),
    sortable: true,
    isRowHeader: true,
  },
  {
    id: 'role',
    header: 'Role',
    cell: (member) => member.role,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (member) => (
      <Badge tone={member.status === 'active' ? 'success' : 'warning'}>
        {member.status}
      </Badge>
    ),
  },
];

const meta = {
  title: 'Universal/DataTable',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ReadyTable() {
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());

  return (
    <DataTable
      ariaLabel="Workspace members"
      columns={columns}
      collection={{ status: 'ready', items: members, refreshing: true }}
      getRowId={(member) => member.id}
      sort={sort}
      onSortChange={setSort}
      selectionMode="multiple"
      selectedRowIds={selection}
      onSelectionChange={setSelection}
      getRowLabel={(member) => member.name}
      renderActions={(member) => (
        <IconButton
          variant="quiet"
          size="sm"
          aria-label={`Actions for ${member.name}`}
          icon={<span>⋯</span>}
        />
      )}
    />
  );
}

export const ReadyAndRefreshing: Story = {
  render: () => <ReadyTable />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Refreshing data',
    );

    const memberHeader = canvas.getByRole('columnheader', {
      name: /Member/,
    });
    await expect(memberHeader).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Member',
      }),
    );
    await expect(memberHeader).toHaveAttribute('aria-sort', 'descending');

    const memberSelection = canvas.getByRole('checkbox', {
      name: /Select Avery Stone/,
    });
    await userEvent.click(memberSelection);
    await expect(memberSelection).toBeChecked();
  },
};

export const Loading: Story = {
  render: () => (
    <DataTable
      ariaLabel="Workspace members"
      columns={columns}
      collection={{ status: 'loading' }}
      getRowId={(member) => member.id}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      ariaLabel="Workspace members"
      columns={columns}
      collection={{ status: 'empty' }}
      getRowId={(member) => member.id}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <DataTable
      ariaLabel="Workspace members"
      columns={columns}
      collection={{
        status: 'error',
        message: 'The member service did not respond.',
        onRetry: () => undefined,
      }}
      getRowId={(member) => member.id}
    />
  ),
};
