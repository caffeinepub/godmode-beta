import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        {error?.message || 'An unexpected error occurred'}
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
