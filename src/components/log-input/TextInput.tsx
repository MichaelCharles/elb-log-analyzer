import React from 'react';
import { LogEntry, LogTypeOption } from '../../types/LogTypes';
import { processLogs } from '../../services/LogParserService';

interface TextInputProps {
  fileContent: string;
  setFileContent: (content: string) => void;
  onLogsUpdated: (newLogs: LogEntry[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logType: LogTypeOption;
}

const TextInput: React.FC<TextInputProps> = ({
  fileContent,
  setFileContent,
  onLogsUpdated,
  isLoading,
  setIsLoading,
  setError,
  logType,
}) => {
  const handleTextProcess = () => {
    if (!fileContent.trim()) {
      setError('No content to process.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Process logs based on logType
      const parsedLogs = processLogs(fileContent, logType);

      // Check if we can actually stringify these logs (validate they're serializable)
      try {
        JSON.stringify(parsedLogs); // Test serialization before proceeding
      } catch (jsonErr) {
        console.error(`Error serializing ${logType} logs:`, jsonErr);
        setError(`Failed to process ${logType} logs - serialization error.`);
        setIsLoading(false);
        return;
      }

      onLogsUpdated(parsedLogs);
      setIsLoading(false);
      setFileContent(''); // Clear the input after processing
    } catch (err) {
      console.error(`Error processing ${logType} content:`, err);
      setError(`Failed to process ${logType} log content. Please check format.`);
      setIsLoading(false);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData('text');
    setFileContent(pastedText);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Or Paste Log Content</h3>
      <textarea
        value={fileContent}
        onChange={e => setFileContent(e.target.value)}
        onPaste={handlePaste}
        rows={10}
        className="w-full p-2 border rounded"
        placeholder="Paste log content here..."
      />
      <div className="mt-3 flex space-x-2">
        <button
          onClick={handleTextProcess}
          disabled={isLoading || !fileContent.trim()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Load Text
        </button>
        {fileContent.trim() && (
          <button
            onClick={() => setFileContent('')}
            disabled={isLoading}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-400"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
