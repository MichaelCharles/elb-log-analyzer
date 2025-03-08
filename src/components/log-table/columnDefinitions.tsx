import { createColumnHelper } from '@tanstack/react-table';
import { timezoneDisplayNames, AccessLogEntry, ConnectionLogEntry } from '../../types/LogTypes';
import { useTimezone } from '../../services/TimezoneContext';
import { useLogType } from '../../services/LogTypeContext';

// Create column helpers
const accessColumnHelper = createColumnHelper<AccessLogEntry>();
const connectionColumnHelper = createColumnHelper<ConnectionLogEntry>();

// Define access log table columns
const getAccessColumnDefinitions = (formatTimestamp: (timestamp: string) => string, timezone: string) => [
  accessColumnHelper.accessor(row => row.protocol, {
    id: 'protocol',
    header: () => 'Protocol',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
  }),
  accessColumnHelper.accessor(row => row.timestamp, {
    id: 'timestamp',
    // Dynamic header text with current timezone
    header: () => {
      const tzName = (timezone in timezoneDisplayNames) ? 
        timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames] : 
        'UTC';
      return `Timestamp (${tzName})`;
    },
    cell: info => {
      const timestamp = info.getValue();
      if (!timestamp) return '';
      
      // Use the timezone context formatter
      return formatTimestamp(timestamp);
    },
    filterFn: 'timestampRangeFilter' as any,
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.clientAddress, {
    id: 'clientAddress',
    header: () => 'Client',
    cell: info => {
      const value = info.getValue();
      const ipWithoutPort = value ? value.split(':')[0] : '';
      return <span>{ipWithoutPort}</span>;
    },
    filterFn: 'includesString',
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.targetAddress, {
    id: 'targetAddress',
    header: () => 'Target',
    cell: info => {
      const value = info.getValue();
      const ipWithoutPort = value ? value.split(':')[0] : '';
      return <span>{ipWithoutPort}</span>;
    },
    filterFn: 'includesString',
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.method, {
    id: 'method',
    header: () => 'Method',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
  }),
  accessColumnHelper.accessor(row => row.url, {
    id: 'url',
    header: () => 'URL',
    cell: info => (
      <div className="truncate max-w-xs" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    filterFn: 'includesString',
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.statusCode, {
    id: 'statusCode',
    header: () => 'Status',
    cell: info => {
      const value = info.getValue();
      let bgColor = 'bg-gray-100';
      if (value >= '200' && value < '300') bgColor = 'bg-green-100';
      if (value >= '300' && value < '400') bgColor = 'bg-blue-100';
      if (value >= '400' && value < '500') bgColor = 'bg-yellow-100';
      if (value >= '500') bgColor = 'bg-red-100';

      return <span className={`px-2 py-1 rounded ${bgColor}`}>{value}</span>;
    },
    filterFn: 'equals',
    enableGrouping: true,
    aggregationFn: 'count',
  }),
  accessColumnHelper.accessor(row => row.requestSize, {
    id: 'requestSize',
    header: () => 'Req Size (B)',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.responseSize, {
    id: 'responseSize',
    header: () => 'Resp Size (B)',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
  }),
  accessColumnHelper.accessor(row => row.tlsProtocol, {
    id: 'tlsProtocol',
    header: () => 'TLS Protocol',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
  }),
];

// Define connection log table columns
const getConnectionColumnDefinitions = (formatTimestamp: (timestamp: string) => string, timezone: string) => [
  connectionColumnHelper.accessor(row => row.timestamp, {
    id: 'timestamp',
    header: () => {
      const tzName = (timezone in timezoneDisplayNames) ? 
        timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames] : 
        'UTC';
      return `Timestamp (${tzName})`;
    },
    cell: info => {
      const timestamp = info.getValue();
      if (!timestamp) return '';
      return formatTimestamp(timestamp);
    },
    filterFn: 'timestampRangeFilter' as any,
    enableColumnFilter: true,
  }),
  connectionColumnHelper.accessor(row => row.clientIp, {
    id: 'clientIp',
    header: () => 'Client IP',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableGrouping: true,
  }),
  connectionColumnHelper.accessor(row => row.clientPort, {
    id: 'clientPort',
    header: () => 'Client Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
  }),
  connectionColumnHelper.accessor(row => row.listenerPort, {
    id: 'listenerPort',
    header: () => 'Listener Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableGrouping: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsProtocol, {
    id: 'tlsProtocol',
    header: () => 'TLS Protocol',
    cell: info => info.getValue() || '-',
    filterFn: 'equals',
    enableGrouping: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsCipher, {
    id: 'tlsCipher',
    header: () => 'TLS Cipher',
    cell: info => info.getValue() || '-',
    filterFn: 'equals',
    enableGrouping: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsHandshakeLatency, {
    id: 'tlsHandshakeLatency',
    header: () => 'Handshake Time (s)',
    cell: info => info.getValue() || '-',
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsVerifyStatus, {
    id: 'tlsVerifyStatus',
    header: () => 'Verify Status',
    cell: info => {
      const value = info.getValue();
      let bgColor = 'bg-gray-100';
      
      if (value) {
        if (value === 'Success') bgColor = 'bg-green-100';
        if (value.startsWith('Failed')) bgColor = 'bg-red-100';
        return <span className={`px-2 py-1 rounded ${bgColor}`}>{value}</span>;
      }
      
      return <span className={`px-2 py-1 rounded ${bgColor}`}>-</span>;
    },
    filterFn: 'equals',
    enableColumnFilter: true,
    enableGrouping: true,
    aggregationFn: 'count',
  }),
];

// Define table columns based on log type
export const getColumnDefinitions = () => {
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
