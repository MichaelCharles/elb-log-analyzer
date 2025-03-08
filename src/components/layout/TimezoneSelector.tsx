import React from 'react';
import { useTimezone } from '../../services/TimezoneContext';
import { TimezoneOption, timezoneDisplayNames } from '../../types/LogTypes';

const TimezoneSelector: React.FC = () => {
  const { timezone, setTimezone } = useTimezone();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimezone(e.target.value as TimezoneOption);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="timezone-select" className="text-sm font-medium text-gray-700">
        Timezone:
      </label>
      <select
        id="timezone-select"
        value={timezone}
        onChange={handleChange}
        className="p-1 text-sm border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {(Object.keys(timezoneDisplayNames) as TimezoneOption[]).map(option => (
          <option key={option} value={option}>
            {timezoneDisplayNames[option]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneSelector;
