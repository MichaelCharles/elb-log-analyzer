import { LogEntry, LogTypeOption, AccessLogEntry, ConnectionLogEntry } from '../types/LogTypes';

/**
 * Parse a single access log line from ELB/ALB format into structured AccessLogEntry
 *
 * Format: type time elb client:port target:port request_processing_time target_processing_time
 * response_processing_time elb_status_code target_status_code received_bytes sent_bytes
 * request user_agent ssl_cipher ssl_protocol target_group_arn trace_id domain_name
 * chosen_cert_arn matched_rule_priority request_creation_time actions_executed redirect_url
 * error_reason target:port_list target_status_code_list classification classification_reason conn_trace_id
 */
export const parseAccessLogLine = (line: string): AccessLogEntry | null => {
  // Skip empty lines
  if (!line.trim()) return null;

  const parts = line.split(' ');

  // Basic validation - check if we have at least the important parts of a log entry
  if (parts.length < 15) return null;

  try {
    // Extract the key elements from the parts according to ELB log format
    const type = parts[0];
    const time = parts[1];
    const elb = parts[2];

    // Extract client:port and target:port
    const clientWithPort = parts[3];
    const targetWithPort = parts[4];

    // Split client and port
    const clientParts = clientWithPort.split(':');
    const client_port = clientParts.join(':'); // Keep original format "client:port"

    // Split target and port
    const targetParts = targetWithPort.split(':');
    const target_port = targetParts.join(':'); // Keep original format "target:port"

    const request_processing_time = parts[5];
    const target_processing_time = parts[6];
    const response_processing_time = parts[7];
    const elb_status_code = parts[8];
    const target_status_code = parts[9];
    const received_bytes = parts[10];
    const sent_bytes = parts[11];

    // Extract request in quotes
    let request = '';
    let userAgentStart = 0;

    // Find request string (it's in quotes)
    for (let i = 12; i < parts.length; i++) {
      if (parts[i].startsWith('"')) {
        // Found the start of request
        let endIndex = i;

        // Find the end of the request (closing quote)
        while (endIndex < parts.length && !parts[endIndex].endsWith('"')) {
          endIndex++;
        }

        if (endIndex < parts.length) {
          request = parts.slice(i, endIndex + 1).join(' ');
          // Remove surrounding quotes
          request = request.substring(1, request.length - 1);
          userAgentStart = endIndex + 1;
          break;
        }
      }
    }

    // Extract user agent (also in quotes)
    let user_agent = '';
    let sslCipherIndex = 0;

    if (userAgentStart > 0 && userAgentStart < parts.length) {
      for (let i = userAgentStart; i < parts.length; i++) {
        if (parts[i].startsWith('"')) {
          // Found the start of user agent
          let endIndex = i;

          // Find the end of the user agent (closing quote)
          while (endIndex < parts.length && !parts[endIndex].endsWith('"')) {
            endIndex++;
          }

          if (endIndex < parts.length) {
            user_agent = parts.slice(i, endIndex + 1).join(' ');
            // Remove surrounding quotes
            user_agent = user_agent.substring(1, user_agent.length - 1);
            sslCipherIndex = endIndex + 1;
            break;
          }
        }
      }
    }

    // Get remaining fields - some may be missing depending on log format
    const ssl_cipher =
      sslCipherIndex > 0 && sslCipherIndex < parts.length ? parts[sslCipherIndex] : '';
    const ssl_protocol = sslCipherIndex + 1 < parts.length ? parts[sslCipherIndex + 1] : '';
    const target_group_arn = sslCipherIndex + 2 < parts.length ? parts[sslCipherIndex + 2] : '';
    const trace_id = sslCipherIndex + 3 < parts.length ? parts[sslCipherIndex + 3] : '';
    const domain_name = sslCipherIndex + 4 < parts.length ? parts[sslCipherIndex + 4] : '';
    const chosen_cert_arn = sslCipherIndex + 5 < parts.length ? parts[sslCipherIndex + 5] : '';
    const matched_rule_priority =
      sslCipherIndex + 6 < parts.length ? parts[sslCipherIndex + 6] : '';
    const request_creation_time =
      sslCipherIndex + 7 < parts.length ? parts[sslCipherIndex + 7] : '';
    const actions_executed = sslCipherIndex + 8 < parts.length ? parts[sslCipherIndex + 8] : '';
    const redirect_url = sslCipherIndex + 9 < parts.length ? parts[sslCipherIndex + 9] : '';
    const error_reason = sslCipherIndex + 10 < parts.length ? parts[sslCipherIndex + 10] : '';
    const target_port_list = sslCipherIndex + 11 < parts.length ? parts[sslCipherIndex + 11] : '';
    const target_status_code_list =
      sslCipherIndex + 12 < parts.length ? parts[sslCipherIndex + 12] : '';
    const classification = sslCipherIndex + 13 < parts.length ? parts[sslCipherIndex + 13] : '';
    const classification_reason =
      sslCipherIndex + 14 < parts.length ? parts[sslCipherIndex + 14] : '';
    const conn_trace_id = sslCipherIndex + 15 < parts.length ? parts[sslCipherIndex + 15] : '';

    return {
      type,
      time,
      timestamp: time, // For compatibility with existing code
      elb,
      client_port,
      target_port,
      request_processing_time,
      target_processing_time,
      response_processing_time,
      elb_status_code,
      target_status_code,
      received_bytes,
      sent_bytes,
      request,
      user_agent,
      ssl_cipher,
      ssl_protocol,
      target_group_arn,
      trace_id,
      domain_name,
      chosen_cert_arn,
      matched_rule_priority,
      request_creation_time,
      actions_executed,
      redirect_url,
      error_reason,
      target_port_list,
      target_status_code_list,
      classification,
      classification_reason,
      conn_trace_id,
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
