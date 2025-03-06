import React, { useState, useRef } from 'react';
import { LogEntry } from '../../types/LogTypes';
import { processLogs } from '../../services/LogParserService';

interface FileUploadProps {
  onLogsUpdated: (newLogs: LogEntry[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onLogsUpdated,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setError(null);
  };

  const handleLoadFile = () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const parsedLogs = processLogs(content);
          onLogsUpdated(parsedLogs);
          setIsLoading(false);

          // Clear the file input
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (err) {
          console.error('Error processing file:', err);
          setError('Failed to process log file. Please check format.');
          setIsLoading(false);
        }
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
      setIsLoading(false);
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2 p-2 border rounded w-full"
          ref={fileInputRef}
        />
        <button
          onClick={handleLoadFile}
          disabled={isLoading || !selectedFile}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap mb-2"
        >
          Load File
        </button>
      </div>
      <div className="flex items-center">
        <p className="text-sm text-gray-600 mr-2">
          {selectedFile ? `Selected: ${selectedFile.name}` : 'Select a log file to analyze'}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
