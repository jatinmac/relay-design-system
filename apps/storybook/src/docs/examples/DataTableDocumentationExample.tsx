import { useState } from 'react';

import {
  Badge,
  DataTable,
  type DataTableColumn,
  type SortDescriptor,
} from '@relay/react';

interface ExampleMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'pending';
}

const members: ReadonlyArray<ExampleMember> = [
  {
    id: 'member-1',
    name: 'Avery Stone',
    role: 'Administrator',
    status: 'active',
  },
  {
    id: 'member-2',
    name: 'Morgan Lee',
    role: 'Viewer',
    status: 'pending',
  },
];

const columns: ReadonlyArray<DataTableColumn<ExampleMember>> = [
  {
    id: 'name',
    header: 'Member',
    cell: (member) => member.name,
    isRowHeader: true,
    sortable: true,
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
        {member.status === 'active' ? 'Active' : 'Pending'}
      </Badge>
    ),
  },
];

function getMemberId(member: ExampleMember) {
  return member.id;
}

function getMemberName(member: ExampleMember) {
  return member.name;
}

export function DataTableDocumentationExample() {
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());

  return (
    <DataTable
      ariaLabel="Documentation example members"
      columns={columns}
      collection={{ status: 'ready', items: [...members] }}
      getRowId={getMemberId}
      sort={sort}
      onSortChange={setSort}
      selectionMode="multiple"
      selectedRowIds={selection}
      onSelectionChange={setSelection}
      getRowLabel={getMemberName}
    />
  );
}

DataTableDocumentationExample.displayName = 'DataTableDocumentationExample';
