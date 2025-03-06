import React, { useState, useEffect, useRef } from 'react';
import { Column } from '@tanstack/react-table';
import { LogEntry } from '../../types/LogTypes';

interface TextFilterProps {
  column: Column<LogEntry, unknown>;
  placeholder?: string;
}

const TextFilter: React.FC<TextFilterProps> = ({ column, placeholder = 'Filter...' }) => {
  const [value, setValue] = useState<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize with any existing filter value
  useEffect(() => {
    if (!isInitializedRef.current) {
      const filterValue = column.getFilterValue() as string;
      if (filterValue) {
        setValue(filterValue);
      }
      isInitializedRef.current = true;
    }
  }, [column]);

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      column.setFilterValue(newValue || undefined);
    }, 300);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setValue('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex w-full items-center">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="p-1 border rounded text-xs w-full"
      />
      {value && (
        <button
          onClick={handleClear}
          className="ml-1 text-gray-500 hover:text-gray-700 text-xs"
          title="Clear filter"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default TextFilter;
