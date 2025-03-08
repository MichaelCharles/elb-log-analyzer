import { createColumnHelper, FilterFnOption } from '@tanstack/react-table';
import { LogEntry, timezoneDisplayNames } from '../../types/LogTypes';
import { useTimezone } from '../../services/TimezoneContext';

// Create column helper
const columnHelper = createColumnHelper<LogEntry>();

// Define table columns
export const getColumnDefinitions = () => {
  // Get timezone context
  const { timezone, formatTimestamp } = useTimezone();
  
  return [
    columnHelper.accessor(row => row.protocol, {
      id: 'protocol',
      header: () => 'Protocol',
      cell: info => info.getValue(),
      filterFn: 'equals',
    }),
    columnHelper.accessor(row => row.timestamp, {
      id: 'timestamp',
      // Dynamic header text with current timezone
      header: () => `Timestamp (${timezoneDisplayNames[timezone]})`,
      cell: info => {
        const timestamp = info.getValue();
        if (!timestamp) return '';
        
        // Use the timezone context formatter
        return formatTimestamp(timestamp);
      },
      filterFn: 'timestampRangeFilter' as FilterFnOption<LogEntry>,
      enableColumnFilter: true,
    }),
    columnHelper.accessor(row => row.clientAddress, {
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
    columnHelper.accessor(row => row.targetAddress, {
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
    columnHelper.accessor(row => row.method, {
      id: 'method',
      header: () => 'Method',
      cell: info => info.getValue(),
      filterFn: 'equals',
    }),
    columnHelper.accessor(row => row.url, {
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
    columnHelper.accessor(row => row.statusCode, {
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
    }),
    columnHelper.accessor(row => row.requestSize, {
      id: 'requestSize',
      header: () => 'Req Size (B)',
      cell: info => info.getValue(),
      filterFn: 'numberRangeFilter' as FilterFnOption<LogEntry>,
      enableColumnFilter: true,
    }),
    columnHelper.accessor(row => row.responseSize, {
      id: 'responseSize',
      header: () => 'Resp Size (B)',
      cell: info => info.getValue(),
      filterFn: 'numberRangeFilter' as FilterFnOption<LogEntry>,
      enableColumnFilter: true,
    }),
    columnHelper.accessor(row => row.tlsProtocol, {
      id: 'tlsProtocol',
      header: () => 'TLS Protocol',
      cell: info => info.getValue(),
      filterFn: 'equals',
    }),
  ];
};
