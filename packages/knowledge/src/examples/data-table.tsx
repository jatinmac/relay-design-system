import { useMemo, useState } from 'react';
import {
  Badge,
  DataTable,
  StatePanel,
  type CollectionState,
  type DataTableColumn,
  type SortDescriptor,
} from '@relay/react';

interface Member {
  id: string;
  name: string;
  status: 'active' | 'pending';
}

const members: ReadonlyArray<Member> = [
  { id: 'member-1', name: 'Morgan Lee', status: 'active' },
  { id: 'member-2', name: 'Samira Okafor', status: 'pending' },
];

export function DataTableExample() {
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());
  const columns = useMemo<ReadonlyArray<DataTableColumn<Member>>>(
    () => [
      {
        id: 'name',
        header: 'Member',
        cell: (member) => member.name,
        sortable: true,
        isRowHeader: true,
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
    ],
    [],
  );
  const collection: CollectionState<Member> = {
    status: 'ready',
    items: [...members],
  };

  return (
    <>
      <DataTable
        ariaLabel="Workspace members"
        columns={columns}
        collection={collection}
        getRowId={(member) => member.id}
        getRowLabel={(member) => member.name}
        sort={sort}
        onSortChange={setSort}
        selectionMode="multiple"
        selectedRowIds={selection}
        onSelectionChange={setSelection}
      />

      {members.length === 0 ? (
        <StatePanel
          status="no-results"
          title="No matching members"
          description="Clear the current filters and try again."
        />
      ) : null}
    </>
  );
}
