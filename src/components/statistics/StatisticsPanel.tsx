import React, { useMemo } from 'react';
import { LogEntry } from '../../types/LogTypes';

interface StatisticsPanelProps {
  logs: LogEntry[];
  onClearData: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ logs, onClearData }) => {
  // Calculate top client IPs
  const topClientIps = useMemo(() => {
    if (logs.length === 0) return [];

    const ipCounts = logs.reduce<Record<string, number>>((acc, log) => {
      const ip = log.clientAddress ? log.clientAddress.split(':')[0] : 'unknown';
      acc[ip] = (acc[ip] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [logs]);
  
  // Calculate min and max timestamps
  const timestampStats = useMemo(() => {
    if (logs.length === 0) return { min: '', max: '' };
    
    let minTimestamp = logs[0].timestamp;
    let maxTimestamp = logs[0].timestamp;
    
    logs.forEach(log => {
      if (log.timestamp < minTimestamp) minTimestamp = log.timestamp;
      if (log.timestamp > maxTimestamp) maxTimestamp = log.timestamp;
    });
    
    // Format timestamps to JST
    const formatToJST = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        return jstDate.toISOString().replace('T', ' ').substring(0, 23);
      } catch (e) {
        console.error('Error formatting timestamp:', e);
        return timestamp;
      }
    };
    
    return {
      min: formatToJST(minTimestamp),
      max: formatToJST(maxTimestamp)
    };
  }, [logs]);
  
  // Calculate size statistics
  const sizeStats = useMemo(() => {
    if (logs.length === 0) return { 
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
    
    logs.forEach(log => {
      const reqSize = parseInt(log.requestSize) || 0;
      const respSize = parseInt(log.responseSize) || 0;
      
      totalReqSize += reqSize;
      totalRespSize += respSize;
      
      if (reqSize > maxReqSize) maxReqSize = reqSize;
      if (respSize > maxRespSize) maxRespSize = respSize;
    });
    
    return {
      totalReq: totalReqSize,
      totalResp: totalRespSize,
      avgReq: Math.round(totalReqSize / logs.length),
      avgResp: Math.round(totalRespSize / logs.length),
      maxReq: maxReqSize,
      maxResp: maxRespSize
    };
  }, [logs]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Statistics</h2>
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
        <div className="bg-green-100 p-3 rounded">
          <p className="text-sm text-gray-600">Success (2xx)</p>
          <p className="text-2xl font-bold">
            {logs.filter(log => log.statusCode >= '200' && log.statusCode < '300').length}
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded">
          <p className="text-sm text-gray-600">Redirection (3xx)</p>
          <p className="text-2xl font-bold">
            {logs.filter(log => log.statusCode >= '300' && log.statusCode < '400').length}
          </p>
        </div>
        <div className="bg-yellow-100 p-3 rounded">
          <p className="text-sm text-gray-600">Client Error (4xx)</p>
          <p className="text-2xl font-bold">
            {logs.filter(log => log.statusCode >= '400' && log.statusCode < '500').length}
          </p>
        </div>
        <div className="bg-red-100 p-3 rounded">
          <p className="text-sm text-gray-600">Server Error (5xx)</p>
          <p className="text-2xl font-bold">
            {logs.filter(log => log.statusCode >= '500' && log.statusCode < '600').length}
          </p>
        </div>
      </div>
      
      {logs.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-4 mb-2">Time Range (JST)</h3>
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
