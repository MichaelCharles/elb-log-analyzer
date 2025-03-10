import React from 'react';
import { Table } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';

interface GroupingSelectorProps {
  table: Table<LogEntry>;
}

const GroupingSelector: React.FC<GroupingSelectorProps> = ({ table }) => {
  const columns = table
    .getAllColumns()
    .filter(column => column.getCanGroup())
    .sort((a, b) => {
      // Simpler approach to get header text
      const headerA = String(a.columnDef.header || a.id);
      const headerB = String(b.columnDef.header || b.id);
      return headerA.localeCompare(headerB);
    });

  const currentGrouping = table.getState().grouping;

  // Function to add or remove a column from grouping
  const toggleColumnGrouping = (columnId: string) => {
    const groupingSet = new Set(currentGrouping);
    if (groupingSet.has(columnId)) {
      groupingSet.delete(columnId);
    } else {
      groupingSet.add(columnId);
    }
    table.setGrouping(Array.from(groupingSet));
  };

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm font-medium text-gray-700">Group by:</div>
      <div className="flex flex-wrap gap-2">
        {columns.map(column => (
          <div
            key={column.id}
            onClick={() => toggleColumnGrouping(column.id)}
            className={`px-3 py-1 rounded text-sm cursor-pointer border ${
              currentGrouping.includes(column.id)
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              {currentGrouping.includes(column.id) && (
                <span className="mr-1 text-xs">({currentGrouping.indexOf(column.id) + 1})</span>
              )}
              {String(column.columnDef.header || column.id)}
            </div>
          </div>
        ))}
        {currentGrouping.length > 0 && (
          <div
            onClick={() => table.setGrouping([])}
            className="px-3 py-1 rounded text-sm cursor-pointer border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
          >
            Clear All
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupingSelector;
