import React, { createContext, useState, ReactNode } from 'react';
import { LogTypeOption } from '../types/LogTypes';

interface LogTypeContextType {
  logType: LogTypeOption;
  setLogType: (logType: LogTypeOption) => void;
}

// Create context with default values
const LogTypeContext = createContext<LogTypeContextType>({
  logType: 'access',
  setLogType: () => {},
});

interface LogTypeProviderProps {
  children: ReactNode;
}

export const LogTypeProvider: React.FC<LogTypeProviderProps> = ({ children }) => {
  // Initialize with access logs as default
  const [logType, setLogType] = useState<LogTypeOption>('access');

  const contextValue: LogTypeContextType = {
    logType,
    setLogType,
  };

  return <LogTypeContext.Provider value={contextValue}>{children}</LogTypeContext.Provider>;
};

// Export the context for the hook file to use
export { LogTypeContext };