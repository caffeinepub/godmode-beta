import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoadingState from './LoadingState';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useCurrentUser();
  const { login } = useInternetIdentity();

  if (isInitializing) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access this feature</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
