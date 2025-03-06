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
