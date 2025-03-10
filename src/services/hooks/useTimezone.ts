import { useContext } from 'react';
import { TimezoneContext } from '../TimezoneContext';

export const useTimezoneHook = () => useContext(TimezoneContext);

// Re-export with the same name for backward compatibility
export const useTimezone = useTimezoneHook;
