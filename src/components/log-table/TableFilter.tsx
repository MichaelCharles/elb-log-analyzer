import React from 'react';
import { Column } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';
import DateRangeFilter from './DateRangeFilter';
import TextFilter from './TextFilter';
import NumberRangeFilter from './NumberRangeFilter';
import { useLogType } from '../../services/hooks/useLogType';

interface TableFilterProps {
  column: Column<any, unknown>;
  logs: LogEntry[];
}

const TableFilter: React.FC<TableFilterProps> = ({ column, logs }) => {
  const { logType } = useLogType();
  // Only render filter for columns with filtering enabled
  if (!column.getCanFilter()) {
    return null;
  }

  // For timestamp column, use the DateRangeFilter
  if (column.id === 'timestamp') {
    return <DateRangeFilter column={column} />;
  }

  // Access log columns
  if (logType === 'access') {
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
    if (column.id === 'responseSize' || column.id === 'requestSize') {
      return (
        <NumberRangeFilter column={column} placeholder={{ min: 'Min size', max: 'Max size' }} />
      );
    }
  }

  // Connection log columns
  if (logType === 'connection') {
    if (column.id === 'clientIp') {
      return <TextFilter column={column} placeholder="Filter client IP..." />;
    }

    if (column.id === 'tlsHandshakeLatency') {
      return (
        <NumberRangeFilter column={column} placeholder={{ min: 'Min time', max: 'Max time' }} />
      );
    }

    if (column.id === 'tlsVerifyStatus') {
      return <TextFilter column={column} placeholder="Filter status..." />;
    }

    if (column.id === 'clientPort') {
      return <TextFilter column={column} placeholder="Filter client port..." />;
    }

    if (column.id === 'listenerPort') {
      return <TextFilter column={column} placeholder="Filter listener port..." />;
    }
  }

  // For all other columns, use select dropdown
  const columnFilterValue = column.getFilterValue();

  // Generate unique values for select filter
  const uniqueValues = (() => {
    const values = new Set<string>();
    logs.forEach(row => {
      // Use type guards to check if the property exists in this log type
      if (column.id in row) {
        const value = (row as any)[column.id];
        if (value !== null && value !== undefined) {
          values.add(String(value));
        }
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
