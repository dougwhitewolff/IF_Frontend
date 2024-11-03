// src/app/error.tsx

'use client';

import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  // Render only the error message without any side-effects
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-500">Something went wrong:</h2>
      <pre className="mt-2 text-red-700">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
