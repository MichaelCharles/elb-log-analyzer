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
        const parsedLogs = JSON.parse(savedLogs);
        setLogs(parsedLogs);
      } catch (e) {
        console.error(`Failed to parse saved ${logType} logs:`, e);
        // If parsing fails, remove the corrupted data
        localStorage.removeItem(storageKey);
      }
    } else {
      setLogs([]); // Reset logs when switching to a type with no saved data
    }
  }, [logType, setLogs, storageKey]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (logs.length > 0) {
      try {
        // For access logs, limit to last 500 entries to prevent quota issues
        const logsToSave = logType === 'access' ? logs.slice(-500) : logs;

        localStorage.setItem(storageKey, JSON.stringify(logsToSave));
      } catch (e) {
        console.error(`Failed to save ${logType} logs:`, e);

        // If quota exceeded, try with fewer logs
        if (e instanceof Error && e.name === 'QuotaExceededError' && logs.length > 100) {
          try {
            // Try with just last 100 logs
            const reducedLogs = logs.slice(-100);
            localStorage.setItem(storageKey, JSON.stringify(reducedLogs));
          } catch (innerError) {
            console.error('Still failed to save even with reduced logs:', innerError);
          }
        }
      }
    } else {
      // If we have no logs but had previously saved some, remove them from storage
      if (localStorage.getItem(storageKey)) {
        localStorage.removeItem(storageKey);
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
