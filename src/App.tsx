import React, { useState, useEffect } from 'react';
import { LogEntry } from './types/LogTypes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ControlPanel from './components/log-input/ControlPanel';
import StatisticsPanel from './components/statistics/StatisticsPanel';
import LogViewerContainer from './components/log-table/LogViewerContainer';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Load logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('elbLogs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse saved logs:', e);
      }
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (logs.length > 0) {
      try {
        localStorage.setItem('elbLogs', JSON.stringify(logs));
      } catch (e) {
        console.error('Failed to save logs:', e);
      }
    }
  }, [logs]);

  // Handler for adding new logs
  const handleLogsUpdated = (newLogs: LogEntry[]) => {
    setLogs(prevLogs => [...prevLogs, ...newLogs]);
  };

  // Handler for clearing data
  const handleClearData = () => {
    setLogs([]);
    localStorage.removeItem('elbLogs');
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ControlPanel onLogsUpdated={handleLogsUpdated} />
        <StatisticsPanel logs={logs} onClearData={handleClearData} />
      </div>

      <LogViewerContainer logs={logs} />

      <Footer />
    </div>
  );
};

export default App;
