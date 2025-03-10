import { useTimezone } from '../../services/hooks/useTimezone';
import { useLogType } from '../../services/hooks/useLogType';
import { getAccessColumnDefinitions, getConnectionColumnDefinitions } from './columnHelpers';

// Define table columns based on log type
export const ColumnDefinitions = () => {
  // Get context
  const { timezone, formatTimestamp } = useTimezone();
  const { logType } = useLogType();

  // Return columns based on log type
  if (logType === 'access') {
    return getAccessColumnDefinitions(formatTimestamp, timezone);
  } else {
    return getConnectionColumnDefinitions(formatTimestamp, timezone);
  }
};
