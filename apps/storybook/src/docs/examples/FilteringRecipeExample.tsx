import { useMemo, useState } from 'react';

import {
  Badge,
  Checkbox,
  DataTable,
  Stack,
  TextField,
  type DataTableColumn,
} from '@relay/react';

interface FilterMember {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

const members: ReadonlyArray<FilterMember> = [
  { id: 'filter-1', name: 'Avery Stone', role: 'Owner', active: true },
  { id: 'filter-2', name: 'Morgan Lee', role: 'Viewer', active: true },
  {
    id: 'filter-3',
    name: 'Pending invitation',
    role: 'Editor',
    active: false,
  },
];

const columns: ReadonlyArray<DataTableColumn<FilterMember>> = [
  {
    id: 'name',
    header: 'Member',
    cell: (member) => member.name,
    isRowHeader: true,
  },
  {
    id: 'role',
    header: 'Role',
    cell: (member) => member.role,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (member) => (
      <Badge tone={member.active ? 'success' : 'warning'}>
        {member.active ? 'Active' : 'Pending'}
      </Badge>
    ),
  },
];

function getMemberId(member: FilterMember) {
  return member.id;
}

export function FilteringRecipeExample() {
  const [query, setQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return members.filter(
      (member) =>
        (!activeOnly || member.active) &&
        (!normalizedQuery ||
          member.name.toLocaleLowerCase().includes(normalizedQuery) ||
          member.role.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [activeOnly, query]);

  return (
    <Stack gap="lg">
      <Stack direction="row" gap="md" align="end" wrap>
        <TextField
          name="member-query"
          label="Search members"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Checkbox
          name="active-members"
          label="Active members only"
          checked={activeOnly}
          onCheckedChange={setActiveOnly}
        />
      </Stack>
      <DataTable
        ariaLabel="Filtered workspace members"
        columns={columns}
        collection={
          filteredMembers.length > 0
            ? { status: 'ready', items: filteredMembers }
            : {
                status: 'empty',
                emptyState: (
                  <p role="status">
                    No members match the current query and filters.
                  </p>
                ),
              }
        }
        getRowId={getMemberId}
      />
    </Stack>
  );
}

FilteringRecipeExample.displayName = 'FilteringRecipeExample';
