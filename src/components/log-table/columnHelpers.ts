import { createColumnHelper } from '@tanstack/react-table';
import { timezoneDisplayNames, AccessLogEntry, ConnectionLogEntry } from '../../types/LogTypes';

// Create column helpers
const accessColumnHelper = createColumnHelper<AccessLogEntry>();
const connectionColumnHelper = createColumnHelper<ConnectionLogEntry>();

// Define access log table columns
export const getAccessColumnDefinitions = (
  formatTimestamp: (timestamp: string) => string,
  timezone: string
) => [
  accessColumnHelper.accessor(row => row.protocol, {
    id: 'protocol',
    header: () => 'Protocol',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.timestamp, {
    id: 'timestamp',
    // Dynamic header text with current timezone
    header: () => {
      const tzName =
        timezone in timezoneDisplayNames
          ? timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames]
          : 'UTC';
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
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.clientAddress, {
    id: 'clientAddress',
    header: () => 'Client',
    cell: info => {
      const value = info.getValue();
      const ipWithoutPort = value ? value.split(':')[0] : '';
      return ipWithoutPort;
    },
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.targetAddress, {
    id: 'targetAddress',
    header: () => 'Target',
    cell: info => {
      const value = info.getValue();
      const ipWithoutPort = value ? value.split(':')[0] : '';
      return ipWithoutPort;
    },
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.method, {
    id: 'method',
    header: () => 'Method',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.url, {
    id: 'url',
    header: () => 'URL',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.statusCode, {
    id: 'statusCode',
    header: () => 'Status',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    aggregationFn: 'count',
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.requestSize, {
    id: 'requestSize',
    header: () => 'Req Size (B)',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.responseSize, {
    id: 'responseSize',
    header: () => 'Resp Size (B)',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.tlsProtocol, {
    id: 'tlsProtocol',
    header: () => 'TLS Protocol',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
];

// Define connection log table columns
export const getConnectionColumnDefinitions = (
  formatTimestamp: (timestamp: string) => string,
  timezone: string
) => [
  connectionColumnHelper.accessor(row => row.timestamp, {
    id: 'timestamp',
    header: () => {
      const tzName =
        timezone in timezoneDisplayNames
          ? timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames]
          : 'UTC';
      return `Timestamp (${tzName})`;
    },
    cell: info => {
      const timestamp = info.getValue();
      if (!timestamp) return '';
      return formatTimestamp(timestamp);
    },
    filterFn: 'timestampRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.clientIp, {
    id: 'clientIp',
    header: () => 'Client IP',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableGrouping: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.clientPort, {
    id: 'clientPort',
    header: () => 'Client Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.listenerPort, {
    id: 'listenerPort',
    header: () => 'Listener Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableGrouping: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsProtocol, {
    id: 'tlsProtocol',
    header: () => 'TLS Protocol',
    cell: info => info.getValue() || '-',
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsCipher, {
    id: 'tlsCipher',
    header: () => 'TLS Cipher',
    cell: info => info.getValue() || '-',
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsHandshakeLatency, {
    id: 'tlsHandshakeLatency',
    header: () => 'Handshake Time (s)',
    cell: info => info.getValue() || '-',
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.leafClientCertSubject, {
    id: 'leafClientCertSubject',
    header: () => 'Cert Subject',
    cell: info => info.getValue() || '-',
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.leafClientCertValidity, {
    id: 'leafClientCertValidity',
    header: () => 'Cert Validity',
    cell: info => info.getValue() || '-',
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.leafClientCertSerialNumber, {
    id: 'leafClientCertSerialNumber',
    header: () => 'Cert Serial Number',
    cell: info => info.getValue() || '-',
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  connectionColumnHelper.accessor(row => row.tlsVerifyStatus, {
    id: 'tlsVerifyStatus',
    header: () => 'Verify Status',
    cell: info => info.getValue() || '-',
    filterFn: 'equals',
    enableColumnFilter: true,
    enableGrouping: true,
    aggregationFn: 'count',
    enableHiding: true,
  }),
];