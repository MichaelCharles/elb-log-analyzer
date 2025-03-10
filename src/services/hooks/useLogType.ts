import { useContext } from 'react';
import { LogTypeContext } from '../LogTypeContext';

export const useLogTypeHook = () => useContext(LogTypeContext);

// Re-export with the same name for backward compatibility
export const useLogType = useLogTypeHook;
