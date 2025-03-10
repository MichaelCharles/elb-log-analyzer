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
  accessColumnHelper.accessor(row => row.type, {
    id: 'type',
    header: () => 'Type',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.time, {
    id: 'time',
    // Dynamic header text with current timezone
    header: () => {
      const tzName =
        timezone in timezoneDisplayNames
          ? timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames]
          : 'UTC';
      return `Time (${tzName})`;
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
  accessColumnHelper.accessor(row => row.elb, {
    id: 'elb',
    header: () => 'ELB',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.client_port, {
    id: 'client_port',
    header: () => 'Client:Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_port, {
    id: 'target_port',
    header: () => 'Target:Port',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.request_processing_time, {
    id: 'request_processing_time',
    header: () => 'Request Processing Time',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_processing_time, {
    id: 'target_processing_time',
    header: () => 'Target Processing Time',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.response_processing_time, {
    id: 'response_processing_time',
    header: () => 'Response Processing Time',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.elb_status_code, {
    id: 'elb_status_code',
    header: () => 'ELB Status Code',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    aggregationFn: 'count',
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_status_code, {
    id: 'target_status_code',
    header: () => 'Target Status Code',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    aggregationFn: 'count',
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.received_bytes, {
    id: 'received_bytes',
    header: () => 'Received Bytes',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.sent_bytes, {
    id: 'sent_bytes',
    header: () => 'Sent Bytes',
    cell: info => info.getValue(),
    filterFn: 'numberRangeFilter' as any,
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.request, {
    id: 'request',
    header: () => 'Request',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.user_agent, {
    id: 'user_agent',
    header: () => 'User Agent',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.ssl_cipher, {
    id: 'ssl_cipher',
    header: () => 'SSL Cipher',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.ssl_protocol, {
    id: 'ssl_protocol',
    header: () => 'SSL Protocol',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_group_arn, {
    id: 'target_group_arn',
    header: () => 'Target Group ARN',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.trace_id, {
    id: 'trace_id',
    header: () => 'Trace ID',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.domain_name, {
    id: 'domain_name',
    header: () => 'Domain Name',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.chosen_cert_arn, {
    id: 'chosen_cert_arn',
    header: () => 'Chosen Cert ARN',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.matched_rule_priority, {
    id: 'matched_rule_priority',
    header: () => 'Matched Rule Priority',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.request_creation_time, {
    id: 'request_creation_time',
    header: () => {
      const tzName =
        timezone in timezoneDisplayNames
          ? timezoneDisplayNames[timezone as keyof typeof timezoneDisplayNames]
          : 'UTC';
      return `Request Creation Time (${tzName})`;
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
  accessColumnHelper.accessor(row => row.actions_executed, {
    id: 'actions_executed',
    header: () => 'Actions Executed',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.redirect_url, {
    id: 'redirect_url',
    header: () => 'Redirect URL',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.error_reason, {
    id: 'error_reason',
    header: () => 'Error Reason',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_port_list, {
    id: 'target_port_list',
    header: () => 'Target:Port List',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.target_status_code_list, {
    id: 'target_status_code_list',
    header: () => 'Target Status Code List',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.classification, {
    id: 'classification',
    header: () => 'Classification',
    cell: info => info.getValue(),
    filterFn: 'equals',
    enableGrouping: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.classification_reason, {
    id: 'classification_reason',
    header: () => 'Classification Reason',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
    enableHiding: true,
  }),
  accessColumnHelper.accessor(row => row.conn_trace_id, {
    id: 'conn_trace_id',
    header: () => 'Connection Trace ID',
    cell: info => info.getValue(),
    filterFn: 'includesString',
    enableColumnFilter: true,
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
