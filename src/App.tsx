import React, { useState, useEffect } from 'react';
import { LogEntry, ConnectionLogEntry } from './types/LogTypes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ControlPanel from './components/log-input/ControlPanel';
import StatisticsPanel from './components/statistics/StatisticsPanel';
import LogViewerContainer from './components/log-table/LogViewerContainer';
import { TimezoneProvider } from './services/TimezoneContext';
import { LogTypeProvider } from './services/LogTypeContext';
import { useLogType } from './services/hooks/useLogType';
import TimezoneSelector from './components/layout/TimezoneSelector';
import LogTypeSelector from './components/layout/LogTypeSelector';

const sampleConnectionLogs: ConnectionLogEntry[] = [];

// Main app content extracted to its own component for access to LogTypeContext
const AppContent: React.FC = () => {
  const { logType } = useLogType();
  const [accessLogs, setAccessLogs] = useState<LogEntry[]>([]);
  const [connectionLogs, setConnectionLogs] = useState<LogEntry[]>(sampleConnectionLogs);

  // Get currently active logs based on selected logType
  const logs = logType === 'access' ? accessLogs : connectionLogs;
  const setLogs = logType === 'access' ? setAccessLogs : setConnectionLogs;

  // Generate localStorage key based on log type
  const storageKey = logType === 'access' ? 'elbAccessLogs' : 'elbConnectionLogs';

  // Load logs from localStorage on component mount or when logType changes
  useEffect(() => {
    const savedLogs = localStorage.getItem(storageKey);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error(`Failed to parse saved ${logType} logs:`, e);
      }
    }
  }, [logType, setLogs, storageKey]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (logs.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(logs));
      } catch (e) {
        console.error(`Failed to save ${logType} logs:`, e);
      }
    }
  }, [logs, logType, storageKey]);

  // Handler for adding new logs
  const handleLogsUpdated = (newLogs: LogEntry[]) => {
    setLogs(prevLogs => [...prevLogs, ...newLogs]);
  };

  // Handler for clearing data
  const handleClearData = () => {
    setLogs([]);
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <Header />

      <div className="flex justify-between mb-4">
        <LogTypeSelector />
        <TimezoneSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ControlPanel onLogsUpdated={handleLogsUpdated} logType={logType} />
        <StatisticsPanel logs={logs} onClearData={handleClearData} logType={logType} />
      </div>

      <LogViewerContainer logs={logs} logType={logType} />

      <Footer />
    </div>
  );
};

// Root App component that sets up providers
const App: React.FC = () => {
  return (
    <TimezoneProvider>
      <LogTypeProvider>
        <AppContent />
      </LogTypeProvider>
    </TimezoneProvider>
  );
};

export default App;
