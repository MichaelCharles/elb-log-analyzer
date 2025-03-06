import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 p-4 mb-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">ELB Log Analyzer</h1>
      <h2 className="text-lg font-bold opacity-50">Elastic Load Balancer Log Analysis Tool</h2>
      <p className="mt-2">
        Upload, analyze, and search AWS Elastic Load Balancer logs. Uploaded logs are stored in your
        browser's local storage, and aggregated statistics are displayed below.
      </p>
    </div>
  );
};

export default Header;
