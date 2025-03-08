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
  protocol: string;
  clientAddress: string;
  targetAddress: string;
  method: string;
  url: string;
  httpVersion: string;
  statusCode: string;
  requestSize: string;
  responseSize: string;
  tlsCipher: string;
  tlsProtocol: string;
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
