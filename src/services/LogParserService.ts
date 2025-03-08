import { LogEntry, LogTypeOption, AccessLogEntry, ConnectionLogEntry } from '../types/LogTypes';

/**
 * Parse a single access log line from ELB/ALB format into structured AccessLogEntry
 */
export const parseAccessLogLine = (line: string): AccessLogEntry | null => {
  // Skip empty lines
  if (!line.trim()) return null;

  const parts = line.split(' ');

  // Basic validation - check if we have at least the important parts of a log entry
  if (parts.length < 15) return null;

  try {
    // Extract the key elements from the parts
    // Format varies but typical ELB log has these main components
    const protocol = parts[0];
    const timestamp = parts[1];
    const elb = parts[2];
    const clientAddress = parts[3];
    const targetAddress = parts[4];

    // Extract request method and URL, accounting for quotes
    let requestInfo = '';
    let startIndex = 11;
    while (startIndex < parts.length && !parts[startIndex].startsWith('"')) {
      startIndex++;
    }

    if (startIndex < parts.length) {
      // Find the closing quote
      let endIndex = startIndex + 1;
      while (endIndex < parts.length && !parts[endIndex].endsWith('"')) {
        endIndex++;
      }

      if (endIndex < parts.length) {
        requestInfo = parts.slice(startIndex, endIndex + 1).join(' ');
        // Remove quotes
        requestInfo = requestInfo.substring(1, requestInfo.length - 1);
      }
    }

    // Parse out method, URL and protocol from request info
    let method = '';
    let url = '';
    let httpVersion = '';

    if (requestInfo) {
      const requestParts = requestInfo.split(' ');
      if (requestParts.length >= 3) {
        method = requestParts[0];
        url = requestParts[1];
        httpVersion = requestParts[2];
      }
    }

    // Find status code - typically at position 8 in ELB logs
    let statusCode = '';
    if (parts.length > 8) {
      statusCode = parts[8];
    }

    // Extract request size - typically at position 10
    let requestSize = '';
    if (parts.length > 10) {
      requestSize = parts[10];
    }

    // Extract response size - typically at position 11
    let responseSize = '';
    if (parts.length > 11) {
      responseSize = parts[11];
    }

    // Find the TLS information
    let tlsProtocol = '';
    let tlsCipher = '';

    // Look for TLS protocol in the log line
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith('TLSv') || parts[i].startsWith('SSLv')) {
        tlsProtocol = parts[i];
        // Cipher is typically before the protocol
        if (i > 0) {
          tlsCipher = parts[i - 1];
        }
        break;
      }
    }

    return {
      protocol,
      timestamp,
      elb,
      clientAddress,
      targetAddress,
      method,
      url,
      httpVersion,
      statusCode,
      requestSize,
      responseSize,
      tlsCipher,
      tlsProtocol,
      rawLog: line,
    };
  } catch (e) {
    console.error('Error parsing access log line:', e, line);
    return null;
  }
};

/**
 * Parse a single connection log line from ELB/ALB connection log format
 * Format: timestamp client_ip client_port listener_port tls_protocol tls_cipher tls_handshake_latency leaf_client_cert_subject leaf_client_cert_validity leaf_client_cert_serial_number tls_verify_status
 */
export const parseConnectionLogLine = (line: string): ConnectionLogEntry | null => {
  // Skip empty lines
  if (!line.trim()) return null;

  const parts = line.split(' ');

  // Basic validation - check if we have at least the important parts of a connection log entry
  if (parts.length < 10) return null;

  try {
    // Extract fields from the connection log format based on official headers
    const timestamp = parts[0];
    const clientIp = parts[1];
    const clientPort = parts[2];
    const listenerPort = parts[3];
    const tlsProtocol = parts[4] !== '-' ? parts[4] : '';
    const tlsCipher = parts[5] !== '-' ? parts[5] : '';
    const tlsHandshakeLatency = parts[6] !== '-' ? parts[6] : '';
    const leafClientCertSubject = parts[7] !== '-' ? parts[7] : '';
    const leafClientCertValidity = parts[8] !== '-' ? parts[8] : '';
    const leafClientCertSerialNumber = parts[9] !== '-' ? parts[9] : '';

    // Get TLS verification status, which should be at parts[10]
    const tlsVerifyStatus = parts.length > 10 ? (parts[10] !== '-' ? parts[10] : '') : '';

    // Get the load balancer name - use consistent field extraction for base fields
    // In connection logs, the ELB name isn't directly included
    const elb = ''; // Not available in connection logs

    return {
      timestamp,
      elb,
      clientIp,
      clientPort,
      listenerPort,
      tlsProtocol,
      tlsCipher,
      tlsHandshakeLatency,
      leafClientCertSubject,
      leafClientCertValidity,
      leafClientCertSerialNumber,
      tlsVerifyStatus,
      rawLog: line,
    };
  } catch (e) {
    console.error('Error parsing connection log line:', e, line);
    return null;
  }
};

/**
 * Parse a single log line based on log type
 */
export const parseLogLine = (line: string, logType: LogTypeOption): LogEntry | null => {
  if (logType === 'access') {
    return parseAccessLogLine(line);
  } else if (logType === 'connection') {
    return parseConnectionLogLine(line);
  }
  return null;
};

/**
 * Process multiple log lines into an array of LogEntry objects
 */
export const processLogs = (content: string, logType: LogTypeOption = 'access'): LogEntry[] => {
  const lines = content.split('\n');
  const parsedLogs: LogEntry[] = [];

  for (const line of lines) {
    const parsedLine = parseLogLine(line, logType);
    if (parsedLine) {
      parsedLogs.push(parsedLine);
    }
  }

  return parsedLogs;
};
