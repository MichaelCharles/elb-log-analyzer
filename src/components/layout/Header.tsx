import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 p-4 mb-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <circle stroke="#4299E1" strokeWidth="3" cx="13" cy="13" r="8"></circle>
              <line
                x1="19"
                y1="19"
                x2="27"
                y2="27"
                stroke="#4299E1"
                strokeWidth="4"
                strokeLinecap="round"
              ></line>
            </g>
          </svg>
        </div>
        <h1 className="text-3xl font-bold">ELB Log Analyzer</h1>
      </div>
      <h2 className="text-lg font-bold opacity-50">Elastic Load Balancer Log Analysis Tool</h2>
      <p className="mt-2">
        Upload, analyze, and search AWS Elastic Load Balancer logs. Uploaded logs are stored in your
        browser's local storage, and aggregated statistics are displayed below.
      </p>
    </div>
  );
};

export default Header;
