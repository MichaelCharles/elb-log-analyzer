import React, { useState, useEffect } from 'react';
import { Column } from '@tanstack/react-table';

interface NumberRangeFilterProps {
  column: Column<any, unknown>;
  placeholder?: {
    min: string;
    max: string;
  };
}

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({
  column,
  placeholder = { min: 'Min', max: 'Max' },
}) => {
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  // Initialize with any existing filter values
  useEffect(() => {
    const filterValue = column.getFilterValue() as [string, string] | undefined;
    if (filterValue) {
      if (filterValue[0] !== undefined) setMin(filterValue[0]);
      if (filterValue[1] !== undefined) setMax(filterValue[1]);
    }
  }, [column]);

  // Handler for min value changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMin(newValue);
    column.setFilterValue([newValue, max]);
  };

  // Handler for max value changes
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMax(newValue);
    column.setFilterValue([min, newValue]);
  };

  // Clear both fields and remove filter
  const handleClear = () => {
    setMin('');
    setMax('');
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex space-x-1 items-center">
        <input
          type="number"
          value={min}
          onChange={handleMinChange}
          placeholder={placeholder.min}
          className="p-1 border rounded text-xs w-full"
          min="0"
        />
      </div>
      <div className="flex space-x-1 items-center">
        <input
          type="number"
          value={max}
          onChange={handleMaxChange}
          placeholder={placeholder.max}
          className="p-1 border rounded text-xs w-full"
          min="0"
        />
      </div>
      {(min || max) && (
        <button onClick={handleClear} className="text-xs text-blue-500 hover:text-blue-700">
          Clear
        </button>
      )}
    </div>
  );
};

export default NumberRangeFilter;
