import React, { useMemo } from 'react';
import { LogEntry, LogTypeOption, timezoneDisplayNames, logTypeDisplayNames } from '../../types/LogTypes';
import { useTimezone } from '../../services/TimezoneContext';

interface StatisticsPanelProps {
  logs: LogEntry[];
  onClearData: () => void;
  logType: LogTypeOption;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ logs, onClearData, logType }) => {
  // Get timezone context
  const { timezone, formatTimestamp } = useTimezone();

  // Calculate top client IPs
  const topClientIps = useMemo(() => {
    if (logs.length === 0) return [];

    const ipCounts = logs.reduce<Record<string, number>>((acc, log) => {
      let ip;
      if (logType === 'access') {
        // For access logs, get IP from clientAddress
        ip = 'clientAddress' in log ? log.clientAddress.split(':')[0] : 'unknown';
      } else {
        // For connection logs, get IP from clientIp
        ip = 'clientIp' in log ? log.clientIp : 'unknown';
      }
      acc[ip] = (acc[ip] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [logs, logType]);
  
  // Calculate min and max timestamps
  const timestampStats = useMemo(() => {
    if (logs.length === 0) return { min: '', max: '' };
    
    let minTimestamp = logs[0].timestamp;
    let maxTimestamp = logs[0].timestamp;
    
    logs.forEach(log => {
      if (log.timestamp < minTimestamp) minTimestamp = log.timestamp;
      if (log.timestamp > maxTimestamp) maxTimestamp = log.timestamp;
    });
    
    return {
      min: formatTimestamp(minTimestamp),
      max: formatTimestamp(maxTimestamp)
    };
  }, [logs, formatTimestamp]);
  
  // Calculate size statistics for access logs
  const sizeStats = useMemo(() => {
    if (logs.length === 0 || logType !== 'access') return { 
      totalReq: 0, 
      totalResp: 0,
      avgReq: 0,
      avgResp: 0,
      maxReq: 0,
      maxResp: 0
    };
    
    let totalReqSize = 0;
    let totalRespSize = 0;
    let maxReqSize = 0;
    let maxRespSize = 0;
    let count = 0;
    
    logs.forEach(log => {
      if ('requestSize' in log && 'responseSize' in log) {
        const reqSize = parseInt(log.requestSize) || 0;
        const respSize = parseInt(log.responseSize) || 0;
        
        totalReqSize += reqSize;
        totalRespSize += respSize;
        
        if (reqSize > maxReqSize) maxReqSize = reqSize;
        if (respSize > maxRespSize) maxRespSize = respSize;
        
        count++;
      }
    });
    
    return {
      totalReq: totalReqSize,
      totalResp: totalRespSize,
      avgReq: count > 0 ? Math.round(totalReqSize / count) : 0,
      avgResp: count > 0 ? Math.round(totalRespSize / count) : 0,
      maxReq: maxReqSize,
      maxResp: maxRespSize
    };
  }, [logs, logType]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">{logTypeDisplayNames[logType]} Statistics</h2>
        {logs.length > 0 && (
          <button
            onClick={onClearData}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
          >
            Clear All Data
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Total Logs</p>
          <p className="text-2xl font-bold">{logs.length}</p>
        </div>
        
        {/* HTTP status codes stats only for access logs */}
        {logType === 'access' && (
          <>
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm text-gray-600">Success (2xx)</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'statusCode' in log && log.statusCode >= '200' && log.statusCode < '300').length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-sm text-gray-600">Redirection (3xx)</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'statusCode' in log && log.statusCode >= '300' && log.statusCode < '400').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <p className="text-sm text-gray-600">Client Error (4xx)</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'statusCode' in log && log.statusCode >= '400' && log.statusCode < '500').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <p className="text-sm text-gray-600">Server Error (5xx)</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'statusCode' in log && log.statusCode >= '500' && log.statusCode < '600').length}
              </p>
            </div>
          </>
        )}
        
        {/* Connection status stats for connection logs */}
        {logType === 'connection' && (
          <>
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm text-gray-600">Successful Connections</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'tlsVerifyStatus' in log && log.tlsVerifyStatus === 'Success').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <p className="text-sm text-gray-600">Failed Connections</p>
              <p className="text-2xl font-bold">
                {logs.filter(log => 'tlsVerifyStatus' in log && log.tlsVerifyStatus.startsWith('Failed')).length}
              </p>
            </div>
          </>
        )}
      </div>
      
      {logs.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-4 mb-2">
            Time Range ({timezoneDisplayNames[timezone]})
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-100 p-3 rounded">
              <p className="text-sm text-gray-600">Earliest Timestamp</p>
              <p className="text-base font-bold">{timestampStats.min}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded">
              <p className="text-sm text-gray-600">Latest Timestamp</p>
              <p className="text-base font-bold">{timestampStats.max}</p>
            </div>
          </div>
          
          {/* Show size statistics only for access logs */}
          {logType === 'access' && (
            <>
              <h3 className="text-lg font-medium mt-4 mb-2">Size Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Request Size</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-sm font-medium">{sizeStats.maxReq.toLocaleString()} B</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg</p>
                      <p className="text-sm font-medium">{sizeStats.avgReq.toLocaleString()} B</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Response Size</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-sm font-medium">{sizeStats.maxResp.toLocaleString()} B</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg</p>
                      <p className="text-sm font-medium">{sizeStats.avgResp.toLocaleString()} B</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Show connection time statistics for connection logs */}
          {logType === 'connection' && (
            <>
              <h3 className="text-lg font-medium mt-4 mb-2">Connection Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Connection Status</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Success</p>
                      <p className="text-sm font-medium">
                        {logs.filter(log => 'tlsVerifyStatus' in log && log.tlsVerifyStatus === 'Success').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Failed</p>
                      <p className="text-sm font-medium">
                        {logs.filter(log => 'tlsVerifyStatus' in log && log.tlsVerifyStatus.startsWith('Failed')).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Handshake Time</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-sm font-medium">
                        {Math.max(...logs
                          .filter(log => 'tlsHandshakeLatency' in log && log.tlsHandshakeLatency)
                          .map(log => 'tlsHandshakeLatency' in log ? parseFloat(log.tlsHandshakeLatency) || 0 : 0)
                        ).toFixed(3)} s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg</p>
                      <p className="text-sm font-medium">
                        {(() => {
                          const times = logs
                            .filter(log => 'tlsHandshakeLatency' in log && log.tlsHandshakeLatency)
                            .map(log => 'tlsHandshakeLatency' in log ? parseFloat(log.tlsHandshakeLatency) || 0 : 0);
                          return times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(3) : '0.000';
                        })()} s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <h3 className="text-lg font-medium mt-4 mb-2">Top Client IPs</h3>
      <div className="bg-gray-50 p-3 rounded">
        <ul>
          {logs.length > 0 ? (
            topClientIps.map(([ip, count], index) => (
              <li key={index} className="flex justify-between mb-1">
                <span>{ip}</span>
                <span className="font-medium">{count} requests</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No data available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsPanel;
