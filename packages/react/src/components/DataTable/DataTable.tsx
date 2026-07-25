import type { ReactNode } from 'react';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { StatePanel } from '../StatePanel/StatePanel';
import { classNames } from '../../utils/classNames';
import styles from './DataTable.module.css';

export type CollectionState<TItem> =
  | { status: 'loading' }
  | { status: 'error'; message: string; onRetry?: () => void }
  | { status: 'empty'; emptyState?: ReactNode }
  | { status: 'ready'; items: TItem[]; refreshing?: boolean };

export type SortDirection = 'ascending' | 'descending';

export interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export interface DataTableColumn<TItem> {
  id: string;
  header: ReactNode;
  cell: (item: TItem) => ReactNode;
  sortable?: boolean;
  isRowHeader?: boolean;
  align?: 'start' | 'center' | 'end';
}

export interface DataTableLabels {
  loadingTitle: string;
  emptyTitle: string;
  errorTitle: string;
  retry: string;
  refreshing: string;
  selectAll: string;
  selectRow: (rowLabel: string) => string;
  actions: string;
  scrollRegion: string;
}

interface DataTableCommonProps<TItem> {
  ariaLabel: string;
  columns: ReadonlyArray<DataTableColumn<TItem>>;
  collection: CollectionState<TItem>;
  getRowId: (item: TItem) => string;
  sort?: SortDescriptor;
  onSortChange?: (sort: SortDescriptor) => void;
  renderActions?: (item: TItem) => ReactNode;
  labels?: Partial<DataTableLabels>;
  className?: string;
}

interface DataTableWithoutSelection {
  selectionMode?: 'none';
  selectedRowIds?: never;
  onSelectionChange?: never;
  getRowLabel?: never;
}

interface DataTableWithSelection<TItem> {
  selectionMode: 'multiple';
  selectedRowIds: ReadonlySet<string>;
  onSelectionChange: (selectedRowIds: ReadonlySet<string>) => void;
  getRowLabel: (item: TItem) => string;
}

export type DataTableProps<TItem> = DataTableCommonProps<TItem> &
  (DataTableWithoutSelection | DataTableWithSelection<TItem>);

const defaultLabels: DataTableLabels = {
  loadingTitle: 'Loading data',
  emptyTitle: 'No data available',
  errorTitle: 'Unable to load data',
  retry: 'Try again',
  refreshing: 'Refreshing data',
  selectAll: 'Select all rows',
  selectRow: (rowLabel) => `Select ${rowLabel}`,
  actions: 'Actions',
  scrollRegion: 'Scrollable table',
};

export function DataTable<TItem>({
  ariaLabel,
  columns,
  collection,
  getRowId,
  sort,
  onSortChange,
  renderActions,
  labels: labelOverrides,
  className,
  ...selectionProps
}: DataTableProps<TItem>) {
  const labels = { ...defaultLabels, ...labelOverrides };

  if (collection.status === 'loading') {
    return <StatePanel status="loading" title={labels.loadingTitle} />;
  }

  if (collection.status === 'error') {
    return (
      <StatePanel
        status="error"
        title={labels.errorTitle}
        description={collection.message}
        action={
          collection.onRetry ? (
            <Button variant="secondary" onClick={collection.onRetry}>
              {labels.retry}
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (collection.status === 'empty') {
    return (
      collection.emptyState ?? (
        <StatePanel status="empty" title={labels.emptyTitle} />
      )
    );
  }

  const isSelectable = selectionProps.selectionMode === 'multiple';
  const rowIds = collection.items.map(getRowId);
  const selectedRowIds = isSelectable
    ? selectionProps.selectedRowIds
    : new Set<string>();
  const selectedVisibleCount = rowIds.filter((rowId) =>
    selectedRowIds.has(rowId),
  ).length;
  const allVisibleSelected =
    rowIds.length > 0 && selectedVisibleCount === rowIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  function updateAllRows(checked: boolean) {
    if (!isSelectable) {
      return;
    }

    const nextSelection = new Set(selectedRowIds);
    rowIds.forEach((rowId) => {
      if (checked) {
        nextSelection.add(rowId);
      } else {
        nextSelection.delete(rowId);
      }
    });
    selectionProps.onSelectionChange(nextSelection);
  }

  function updateRow(rowId: string, checked: boolean) {
    if (!isSelectable) {
      return;
    }

    const nextSelection = new Set(selectedRowIds);
    if (checked) {
      nextSelection.add(rowId);
    } else {
      nextSelection.delete(rowId);
    }
    selectionProps.onSelectionChange(nextSelection);
  }

  function updateSort(column: DataTableColumn<TItem>) {
    if (!column.sortable || !onSortChange) {
      return;
    }

    onSortChange({
      column: column.id,
      direction:
        sort?.column === column.id && sort.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  }

  return (
    <div className={classNames(styles.root, className)}>
      {collection.refreshing ? (
        <div className={styles.refreshing} role="status">
          <span className={styles.refreshingSpinner} aria-hidden="true" />
          {labels.refreshing}
        </div>
      ) : null}
      <div
        className={styles.scroller}
        role="region"
        aria-label={labels.scrollRegion}
        tabIndex={0}
      >
        <table className={styles.table} aria-label={ariaLabel}>
          <thead>
            <tr>
              {isSelectable ? (
                <th className={styles.selectionCell} scope="col">
                  <Checkbox
                    label={labels.selectAll}
                    visuallyHiddenLabel
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onCheckedChange={updateAllRows}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const isSorted = sort?.column === column.id;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? isSorted
                          ? sort.direction
                          : 'none'
                        : undefined
                    }
                    className={styles[`align-${column.align ?? 'start'}`]}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        disabled={!onSortChange}
                        onClick={() => updateSort(column)}
                      >
                        <span>{column.header}</span>
                        <span
                          className={styles.sortIndicator}
                          aria-hidden="true"
                        >
                          {isSorted
                            ? sort.direction === 'ascending'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {renderActions ? (
                <th className={styles.actionsCell} scope="col">
                  <span className={styles.visuallyHidden}>
                    {labels.actions}
                  </span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {collection.items.map((item) => {
              const rowId = getRowId(item);
              const isSelected = selectedRowIds.has(rowId);
              return (
                <tr key={rowId} data-selected={isSelected || undefined}>
                  {isSelectable ? (
                    <td className={styles.selectionCell}>
                      <Checkbox
                        label={labels.selectRow(
                          selectionProps.getRowLabel(item),
                        )}
                        visuallyHiddenLabel
                        checked={isSelected}
                        onCheckedChange={(checked) => updateRow(rowId, checked)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const CellElement = column.isRowHeader ? 'th' : 'td';
                    return (
                      <CellElement
                        key={column.id}
                        scope={column.isRowHeader ? 'row' : undefined}
                        className={styles[`align-${column.align ?? 'start'}`]}
                      >
                        {column.cell(item)}
                      </CellElement>
                    );
                  })}
                  {renderActions ? (
                    <td className={styles.actionsCell}>
                      {renderActions(item)}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.displayName = 'DataTable';
