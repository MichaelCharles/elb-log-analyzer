import React from 'react';
import { Table } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';

interface GroupingSelectorProps {
  table: Table<LogEntry>;
}

const GroupingSelector: React.FC<GroupingSelectorProps> = ({ table }) => {
  const columns = table.getAllColumns()
    .filter(column => column.getCanGroup())
    .sort((a, b) => {
      const headerA = typeof a.columnDef.header === 'function' 
        ? a.columnDef.header() 
        : a.columnDef.header?.toString() || '';
      const headerB = typeof b.columnDef.header === 'function' 
        ? b.columnDef.header() 
        : b.columnDef.header?.toString() || '';
      return headerA.localeCompare(headerB);
    });

  return (
    <div className="flex mb-4 items-center">
      <label className="mr-2 text-sm font-medium text-gray-700">Group by:</label>
      <select
        className="border p-1 rounded text-sm"
        value={table.getState().grouping[0] || ''}
        onChange={e => {
          const columnId = e.target.value;
          table.setGrouping(columnId ? [columnId] : []);
        }}
      >
        <option value="">None</option>
        {columns.map(column => (
          <option key={column.id} value={column.id}>
            {typeof column.columnDef.header === 'function' 
              ? column.columnDef.header() 
              : column.columnDef.header}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GroupingSelector;