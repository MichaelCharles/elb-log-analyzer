import React, { useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnFiltersState,
  OnChangeFn,
} from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';
import { getColumnDefinitions } from './columnDefinitions';
import GlobalSearch from './GlobalSearch';
import LogTable from './LogTable';
import TablePagination from './TablePagination';

interface LogViewerContainerProps {
  logs: LogEntry[];
}

const LogViewerContainer: React.FC<LogViewerContainerProps> = ({ logs }) => {
  // Table state - properly type the columnFilters state
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  // Filter function for global filtering
  const globalFilterFn: FilterFn<LogEntry> = (row, columnId, filterValue) => {
    const searchValue = filterValue.toLowerCase();
    const value = row.getValue(columnId);
    return (
      value !== undefined && value !== null && String(value).toLowerCase().includes(searchValue)
    );
  };

  // Custom filter functions - properly typed with FilterFn<LogEntry>
  const customFilterFns = {
    equals: ((row, columnId, filterValue) => {
      return filterValue === '' || String(row.getValue(columnId)) === filterValue;
    }) as FilterFn<LogEntry>,

    includesString: ((row, columnId, filterValue) => {
      if (filterValue === '') return true;
      const value = row.getValue(columnId);
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    }) as FilterFn<LogEntry>,

    // Properly typed timestamp range filter
    timestampRangeFilter: ((row, columnId, filterValue: [string, string]) => {
      const [start, end] = filterValue;
      const timestamp = row.getValue(columnId) as string;

      if (!start && !end) return true;

      try {
        const rowDateTime = new Date(timestamp);

        if (start && end) {
          return rowDateTime >= new Date(start) && rowDateTime <= new Date(end);
        } else if (start) {
          return rowDateTime >= new Date(start);
        } else if (end) {
          return rowDateTime <= new Date(end);
        }

        return true;
      } catch (e) {
        console.error('Error parsing timestamp:', e);
        return true;
      }
    }) as FilterFn<LogEntry>,

    // Properly typed number range filter
    numberRangeFilter: ((row, columnId, filterValue: [string, string]) => {
      const [min, max] = filterValue;
      const value = row.getValue(columnId) as string;

      if (!min && !max) return true;

      try {
        const numericValue = parseInt(value, 10);

        if (min && max) {
          return numericValue >= parseInt(min, 10) && numericValue <= parseInt(max, 10);
        } else if (min) {
          return numericValue >= parseInt(min, 10);
        } else if (max) {
          return numericValue <= parseInt(max, 10);
        }

        return true;
      } catch (e) {
        console.error('Error parsing numeric value:', e);
        return true;
      }
    }) as FilterFn<LogEntry>,
  };

  // Create properly typed column filter change handler
  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    updaterOrValue => {
      if (typeof updaterOrValue === 'function') {
        setColumnFilters(updaterOrValue(columnFilters));
      } else {
        console.log('Filters changed:', updaterOrValue);
        setColumnFilters(updaterOrValue);
      }
    },
    [columnFilters]
  );

  // Setup React Table instance
  const table = useReactTable({
    data: logs,
    columns: getColumnDefinitions(),
    filterFns: customFilterFns,
    state: {
      pagination,
      globalFilter,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: handleColumnFiltersChange,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Enable debugging
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    debugRows: true,
    debugAll: true,
  });

  // Calculate the total filtered entries count
  const filteredRowsCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Log Entries</h2>
        <div className="text-sm text-gray-600">
          {filteredRowsCount} of {logs.length} entries shown
        </div>
      </div>

      {/* Global search component */}
      <GlobalSearch globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      {/* Table component */}
      <LogTable table={table} logs={logs} />

      {/* Pagination controls */}
      {logs.length > 0 && <TablePagination table={table} />}
    </div>
  );
};

export default LogViewerContainer;
