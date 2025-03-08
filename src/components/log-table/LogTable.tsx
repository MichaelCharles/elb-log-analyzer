import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';
import TableFilter from './TableFilter';

interface LogTableProps {
  // Use a type union since we need to handle both types of tables
  table: Table<any>;
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ table, logs }) => {
  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No log entries available. Upload a log file to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      <span>
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </span>
                    </div>
                    
                    {header.column.getCanGroup() && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          
                          // Toggle grouping for this column
                          const groupingSet = new Set(table.getState().grouping);
                          if (groupingSet.has(header.column.id)) {
                            groupingSet.delete(header.column.id);
                            table.setGrouping(Array.from(groupingSet));
                          } else {
                            table.setGrouping([header.column.id]);
                          }
                        }}
                        className={`ml-1 p-1 text-xs rounded hover:bg-gray-200 ${
                          table.getState().grouping.includes(header.column.id)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500'
                        }`}
                        title="Group by this column"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div>
                    {header.column.getCanFilter() ? (
                      <TableFilter column={header.column} logs={logs} />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={`hover:bg-gray-50 ${row.getIsGrouped() ? 'bg-gray-100 font-medium' : ''}`}>
              {row.getVisibleCells().map(cell => {
                if (cell.getIsGrouped()) {
                  // Group cell
                  return (
                    <td
                      key={cell.id}
                      className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap bg-gray-100 cursor-pointer"
                      onClick={() => row.toggleExpanded()}
                      colSpan={row.getVisibleCells().length}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{row.getIsExpanded() ? '▼' : '▶'}</span>
                        <span className="font-medium">
                          {cell.column.columnDef.header?.toString()}: {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                        <span className="ml-2 text-gray-500">
                          ({row.subRows.length} item{row.subRows.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </td>
                  );
                } else if (cell.getIsAggregated()) {
                  // Aggregated cell
                  return (
                    <td
                      key={cell.id}
                      className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                } else if (cell.getIsPlaceholder()) {
                  // Placeholder cell (for grouped rows)
                  return <td key={cell.id} className="px-3 py-2 text-sm text-gray-400 border-b"></td>;
                } else {
                  // Regular cell
                  return (
                    <td
                      key={cell.id}
                      className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
