import React from 'react';
import { Column } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';
import DateRangeFilter from './DateRangeFilter';
import TextFilter from './TextFilter';
import NumberRangeFilter from './NumberRangeFilter';

interface TableFilterProps {
  column: Column<LogEntry, unknown>;
  logs: LogEntry[];
}

const TableFilter: React.FC<TableFilterProps> = ({ column, logs }) => {
  // Only render filter for columns with filtering enabled
  if (!column.getCanFilter()) {
    return null;
  }

  // For timestamp column, use the DateRangeFilter
  if (column.id === 'timestamp') {
    return <DateRangeFilter column={column} />;
  }

  // For client, target, and url columns, use TextFilter for more flexibility
  if (column.id === 'clientAddress') {
    return <TextFilter column={column} placeholder="Filter client IP..." />;
  }

  if (column.id === 'targetAddress') {
    return <TextFilter column={column} placeholder="Filter target IP..." />;
  }

  if (column.id === 'url') {
    return <TextFilter column={column} placeholder="Filter URL..." />;
  }

  // For responseSize column, use NumberRangeFilter
  if (column.id === 'responseSize') {
    return <NumberRangeFilter column={column} placeholder={{ min: 'Min size', max: 'Max size' }} />;
  }

  // For all other columns, use select dropdown
  const columnFilterValue = column.getFilterValue();

  // Generate unique values for select filter
  const uniqueValues = (() => {
    const values = new Set<string>();
    logs.forEach(row => {
      const value = row[column.id as keyof LogEntry];
      if (value !== null && value !== undefined) {
        values.add(value);
      }
    });
    return [...values].sort();
  })();

  return (
    <select
      value={(columnFilterValue || '') as string}
      onChange={e => column.setFilterValue(e.target.value || undefined)}
      className="p-1 border rounded text-xs w-full"
    >
      <option value="">All</option>
      {uniqueValues.map((value, i) => (
        <option key={i} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default TableFilter;
