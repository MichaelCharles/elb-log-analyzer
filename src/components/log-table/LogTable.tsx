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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
