import React from 'react';
import { useLogType } from '../../services/LogTypeContext';
import { LogTypeOption, logTypeDisplayNames } from '../../types/LogTypes';

const LogTypeSelector: React.FC = () => {
  const { logType, setLogType } = useLogType();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogType(e.target.value as LogTypeOption);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="log-type-select" className="text-sm font-medium text-gray-700">
        Log Type:
      </label>
      <select
        id="log-type-select"
        value={logType}
        onChange={handleChange}
        className="p-1 text-sm border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {(Object.keys(logTypeDisplayNames) as LogTypeOption[]).map(option => (
          <option key={option} value={option}>
            {logTypeDisplayNames[option]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LogTypeSelector;
