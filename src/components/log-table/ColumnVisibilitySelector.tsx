import React, { useState, useRef, useEffect } from 'react';
import { Table } from '@tanstack/react-table';

interface ColumnVisibilitySelectorProps {
  table: Table<any>;
}

const ColumnVisibilitySelector: React.FC<ColumnVisibilitySelectorProps> = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get all toggleable columns
  const allColumns = table.getAllColumns().filter(column => column.getCanHide());

  return (
    <div className="relative inline-block text-left mb-4" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z"
            clipRule="evenodd"
          />
        </svg>
        Columns
      </button>

      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
          <div className="p-2">
            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium text-gray-900">Toggle Columns</span>
              <button
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => {
                  table.toggleAllColumnsVisible(true);
                }}
              >
                Show All
              </button>
            </div>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {allColumns.map(column => {
                const columnHeader = 
                  typeof column.columnDef.header === 'function'
                    ? column.columnDef.header({} as any)
                    : column.columnDef.header || column.id;
                    
                return (
                  <div key={column.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`toggle-${column.id}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />
                    <label
                      htmlFor={`toggle-${column.id}`}
                      className="ml-2 block text-sm text-gray-900 cursor-pointer"
                    >
                      {columnHeader}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilitySelector;