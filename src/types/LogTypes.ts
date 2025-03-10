import { ColumnFiltersState } from '@tanstack/react-table';

// Log type options
export type LogTypeOption = 'access' | 'connection';

// Log type display names
export const logTypeDisplayNames: Record<LogTypeOption, string> = {
  access: 'Access Logs',
  connection: 'Connection Logs',
};

// Base log entry interface with common fields
export interface BaseLogEntry {
  timestamp: string;
  elb: string;
  rawLog: string;
}

// Access log entry interface
export interface AccessLogEntry extends BaseLogEntry {
  type: string;
  time: string;
  client_port: string;
  target_port: string;
  request_processing_time: string;
  target_processing_time: string;
  response_processing_time: string;
  elb_status_code: string;
  target_status_code: string;
  received_bytes: string;
  sent_bytes: string;
  request: string;
  user_agent: string;
  ssl_cipher: string;
  ssl_protocol: string;
  target_group_arn: string;
  trace_id: string;
  domain_name: string;
  chosen_cert_arn: string;
  matched_rule_priority: string;
  request_creation_time: string;
  actions_executed: string;
  redirect_url: string;
  error_reason: string;
  target_port_list: string;
  target_status_code_list: string;
  classification: string;
  classification_reason: string;
  conn_trace_id: string;
}

// Connection log entry interface
export interface ConnectionLogEntry extends BaseLogEntry {
  clientIp: string;
  clientPort: string;
  listenerPort: string;
  tlsProtocol: string;
  tlsCipher: string;
  tlsHandshakeLatency: string;
  leafClientCertSubject: string;
  leafClientCertValidity: string;
  leafClientCertSerialNumber: string;
  tlsVerifyStatus: string;
}

// Union type for all log entry types
export type LogEntry = AccessLogEntry | ConnectionLogEntry;

// Table filtering state types
export interface LogFilterState {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}

// Timezone options
export type TimezoneOption = 'utc' | 'et' | 'cet' | 'jst' | 'local';

// Timezone display names
export const timezoneDisplayNames: Record<TimezoneOption, string> = {
  utc: 'UTC',
  et: 'ET (UTC-5/-4)',
  cet: 'CET (UTC+1/+2)',
  jst: 'JST (UTC+9)',
  local: 'Local Browser Time',
};
