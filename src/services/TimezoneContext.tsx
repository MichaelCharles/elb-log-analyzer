import React, { createContext, useState, ReactNode } from 'react';
import { TimezoneOption } from '../types/LogTypes';

interface TimezoneContextType {
  timezone: TimezoneOption;
  setTimezone: (timezone: TimezoneOption) => void;
  formatTimestamp: (timestamp: string) => string;
}

// Create context with default values
const TimezoneContext = createContext<TimezoneContextType>({
  timezone: 'jst',
  setTimezone: () => {},
  formatTimestamp: () => '',
});

// Export the context for the hook file to use
export { TimezoneContext };

interface TimezoneProviderProps {
  children: ReactNode;
}

export const TimezoneProvider: React.FC<TimezoneProviderProps> = ({ children }) => {
  // Initialize with UTC as default
  const [timezone, setTimezone] = useState<TimezoneOption>('utc');

  // Format timestamp based on selected timezone
  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) return '';

    try {
      // Parse the timestamp
      const date = new Date(timestamp);

      // Format based on selected timezone
      switch (timezone) {
        case 'utc':
          // Use UTC directly
          return date.toISOString().replace('T', ' ').substring(0, 23);

        case 'et': {
          // For production use, consider using a timezone library // Note: This is simplified and doesn't account for DST transitions // Convert to Eastern Time (UTC-5, -4 during DST)
          // Calculate if date is in DST (very simplified approach)
          // In the US, DST typically starts on the second Sunday in March and ends on the first Sunday in November
          const month = date.getUTCMonth() + 1; // 1-12

          // Simplified DST check - assumes DST from March through October
          const isDST = month > 3 && month < 11;

          // Apply ET offset: UTC-5 (standard) or UTC-4 (DST)
          const etOffset = isDST ? -4 : -5;
          const etDate = new Date(date.getTime() + etOffset * 60 * 60 * 1000);
          return etDate.toISOString().replace('T', ' ').substring(0, 23);
        }

        case 'cet': {
          // For production use, consider using a timezone library // Note: This is simplified and doesn't account for DST transitions // Convert to Central European Time (UTC+1, +2 during DST)
          // Calculate if date is in DST (very simplified approach)
          // In Europe, DST typically starts on the last Sunday in March and ends on the last Sunday in October
          const monthCET = date.getUTCMonth() + 1; // 1-12

          // Simplified DST check - assumes DST from April through October
          const isDSTinEurope = monthCET > 3 && monthCET < 11;

          // Apply CET offset: UTC+1 (standard) or UTC+2 (DST)
          const cetOffset = isDSTinEurope ? 2 : 1;
          const cetDate = new Date(date.getTime() + cetOffset * 60 * 60 * 1000);
          return cetDate.toISOString().replace('T', ' ').substring(0, 23);
        }

        case 'jst': {
          // Convert to JST (UTC+9)
          const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
          return jstDate.toISOString().replace('T', ' ').substring(0, 23);
        }

        case 'local': {
          // Format to include milliseconds (as there's no direct option for this in toLocaleString) // Use local browser timezone
          const localFormatted = date.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          // Add milliseconds manually
          const ms = date.getMilliseconds().toString().padStart(3, '0');
          return `${localFormatted}.${ms}`;
        }
      }
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      return timestamp;
    }
  };

  const contextValue: TimezoneContextType = {
    timezone,
    setTimezone,
    formatTimestamp,
  };

  return <TimezoneContext.Provider value={contextValue}>{children}</TimezoneContext.Provider>;
};
