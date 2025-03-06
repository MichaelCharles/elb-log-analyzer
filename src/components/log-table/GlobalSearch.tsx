import React from 'react';

interface GlobalSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className="flex items-center mb-4">
      <span className="mr-2 text-sm">Search:</span>
      <input
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search all columns..."
        className="p-2 border rounded text-sm w-full max-w-xs"
      />
    </div>
  );
};

export default GlobalSearch;
