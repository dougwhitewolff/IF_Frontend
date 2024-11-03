import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';


interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Alert variant="destructive" className="relative p-6 mt-4">
      <AlertTitle className="mb-2 text-lg font-semibold">
        Something went wrong
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <div className="text-sm opacity-90">
          {error.message || 'An unexpected error occurred'}
        </div>
        <Button
          onClick={resetErrorBoundary}
          className="mt-4"
          variant="outline"
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};


interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  onReset,
  onError,
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  );
};


export default ErrorBoundary;
