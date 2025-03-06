import { LogEntry } from '../types/LogTypes';

/**
 * Parse a single log line from ELB/ALB format into structured LogEntry
 */
export const parseLogLine = (line: string): LogEntry | null => {
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

    // Extract response size - typically at position 10
    let responseSize = '';
    if (parts.length > 10) {
      responseSize = parts[10];
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
      responseSize,
      tlsCipher,
      tlsProtocol,
      rawLog: line,
    };
  } catch (e) {
    console.error('Error parsing log line:', e, line);
    return null;
  }
};

/**
 * Process multiple log lines into an array of LogEntry objects
 */
export const processLogs = (content: string): LogEntry[] => {
  const lines = content.split('\n');
  const parsedLogs: LogEntry[] = [];

  for (const line of lines) {
    const parsedLine = parseLogLine(line);
    if (parsedLine) {
      parsedLogs.push(parsedLine);
    }
  }

  return parsedLogs;
};
