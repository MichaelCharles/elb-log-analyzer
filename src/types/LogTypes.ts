import { ColumnFiltersState } from '@tanstack/react-table';

// Define the log entry interface
export interface LogEntry {
  protocol: string;
  timestamp: string;
  elb: string;
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
  rawLog: string;
}

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
  local: 'Local Browser Time'
};
