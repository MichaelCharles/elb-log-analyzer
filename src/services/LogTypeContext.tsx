import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export const useLogType = () => useContext(LogTypeContext);

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
