import React, { useState } from 'react';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import { LogEntry } from '../../types/LogTypes';

interface ControlPanelProps {
  onLogsUpdated: (newLogs: LogEntry[]) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onLogsUpdated }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Upload Logs</h2>

      <FileUpload
        onLogsUpdated={onLogsUpdated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      <TextInput
        fileContent={fileContent}
        setFileContent={setFileContent}
        onLogsUpdated={onLogsUpdated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setError={setError}
      />

      {isLoading && <p className="mt-2 text-blue-600">Processing...</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default ControlPanel;
