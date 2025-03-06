import React, { useState, useEffect } from 'react';
import { Column } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';

interface DateRangeFilterProps {
  column: Column<LogEntry, unknown>;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ column }) => {
  const [startTimestamp, setStartTimestamp] = useState<string>('');
  const [endTimestamp, setEndTimestamp] = useState<string>('');

  // Initialize with any existing filter values
  useEffect(() => {
    const filterValue = column.getFilterValue() as [string, string] | undefined;
    if (filterValue) {
      if (filterValue[0]) setStartTimestamp(filterValue[0]);
      if (filterValue[1]) setEndTimestamp(filterValue[1]);
    }
  }, [column]);

  // Handler for start date changes
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setStartTimestamp(newValue);
    column.setFilterValue([newValue, endTimestamp]);
  };

  // Handler for end date changes
  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEndTimestamp(newValue);
    column.setFilterValue([startTimestamp, newValue]);
  };

  // Clear both fields and remove filter
  const handleClear = () => {
    setStartTimestamp('');
    setEndTimestamp('');
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex space-x-1 items-center">
        <span className="text-xs">From:</span>
        <input
          type="datetime-local"
          value={startTimestamp}
          onChange={handleStartChange}
          className="p-1 border rounded text-xs w-full"
        />
      </div>
      <div className="flex space-x-1 items-center">
        <span className="text-xs">To:</span>
        <input
          type="datetime-local"
          value={endTimestamp}
          onChange={handleEndChange}
          className="p-1 border rounded text-xs w-full"
        />
      </div>
      {(startTimestamp || endTimestamp) && (
        <button onClick={handleClear} className="text-xs text-blue-500 hover:text-blue-700">
          Clear
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;
