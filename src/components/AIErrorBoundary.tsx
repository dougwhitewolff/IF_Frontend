// src/components/AIErrorBoundary.tsx

'use client';

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ErrorFallback from '@/app/error';
import { toast } from 'react-hot-toast';

interface AIErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

const AIErrorBoundary: React.FC<AIErrorBoundaryProps> = ({
  children,
  onReset,
}) => {
  const handleError = (error: Error) => {
    console.error('AI Error:', error);
    // Optionally, add error reporting service here
    toast.error('An unexpected error occurred in the AI component.');
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AIErrorBoundary;
