import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="mt-6 text-center text-gray-600 text-sm">
      <p>
        ELB Log Analyzer |{' '}
        <a className="underline" href="https://michaelcharl.es">
          michaelcharl.es
        </a>{' '}
        |{' '}
        <a className="underline" href="https://github.com/MichaelCharles/elb-log-analyzer">
          GitHub
        </a>
      </p>
    </div>
  );
};

export default Footer;
