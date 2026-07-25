import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DataTable,
  type CollectionState,
  type DataTableColumn,
} from './DataTable';

interface Member {
  id: string;
  name: string;
  role: string;
}

const members: Member[] = [
  { id: 'one', name: 'Avery Stone', role: 'Admin' },
  { id: 'two', name: 'Morgan Lee', role: 'Viewer' },
];

const columns: Array<DataTableColumn<Member>> = [
  {
    id: 'name',
    header: 'Name',
    cell: (member) => member.name,
    isRowHeader: true,
    sortable: true,
  },
  {
    id: 'role',
    header: 'Role',
    cell: (member) => member.role,
  },
];

function renderTable(
  collection: CollectionState<Member>,
  overrides: Partial<React.ComponentProps<typeof DataTable<Member>>> = {},
) {
  return render(
    <DataTable
      ariaLabel="Members"
      columns={columns}
      collection={collection}
      getRowId={(member) => member.id}
      {...overrides}
    />,
  );
}

describe('DataTable', () => {
  it('renders loading, empty, and recoverable error states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const view = renderTable({ status: 'loading' });

    expect(screen.getByRole('status')).toHaveTextContent('Loading data');

    view.rerender(
      <DataTable
        ariaLabel="Members"
        columns={columns}
        collection={{ status: 'empty' }}
        getRowId={(member) => member.id}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('No data available');

    view.rerender(
      <DataTable
        ariaLabel="Members"
        columns={columns}
        collection={{
          status: 'error',
          message: 'The server did not respond.',
          onRetry,
        }}
        getRowId={(member) => member.id}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'The server did not respond.',
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('keeps ready data visible while announcing refresh', () => {
    renderTable({ status: 'ready', items: members, refreshing: true });

    expect(screen.getByRole('table', { name: 'Members' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing data');
    expect(
      screen.getByRole('rowheader', { name: 'Avery Stone' }),
    ).toBeVisible();
  });

  it('requests sorting in ascending then descending order', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const view = renderTable(
      { status: 'ready', items: members },
      { onSortChange },
    );

    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSortChange).toHaveBeenLastCalledWith({
      column: 'name',
      direction: 'ascending',
    });

    view.rerender(
      <DataTable
        ariaLabel="Members"
        columns={columns}
        collection={{ status: 'ready', items: members }}
        getRowId={(member) => member.id}
        sort={{ column: 'name', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSortChange).toHaveBeenLastCalledWith({
      column: 'name',
      direction: 'descending',
    });
  });

  it('supports row and indeterminate select-all behavior', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const view = render(
      <DataTable
        ariaLabel="Members"
        columns={columns}
        collection={{ status: 'ready', items: members }}
        getRowId={(member) => member.id}
        selectionMode="multiple"
        selectedRowIds={new Set(['one'])}
        onSelectionChange={onSelectionChange}
        getRowLabel={(member) => member.name}
      />,
    );

    const selectAll = screen.getByRole('checkbox', {
      name: 'Select all rows',
    });
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Morgan Lee' }),
    );
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['one', 'two']));

    view.rerender(
      <DataTable
        ariaLabel="Members"
        columns={columns}
        collection={{ status: 'ready', items: members }}
        getRowId={(member) => member.id}
        selectionMode="multiple"
        selectedRowIds={new Set(['one', 'two'])}
        onSelectionChange={onSelectionChange}
        getRowLabel={(member) => member.name}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set());
  });
});
