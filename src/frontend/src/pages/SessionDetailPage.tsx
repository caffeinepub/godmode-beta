import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetSession, useGenerateRecommendations } from '../hooks/useQueries';
import { useCurrentUser } from '../hooks/useCurrentUser';
import AuthGate from '../components/AuthGate';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EventDriftPanel from '../components/EventDriftPanel';
import ProbabilityDebtPanel from '../components/ProbabilityDebtPanel';
import UncertaintyToggle from '../components/UncertaintyToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Edit, Clock, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function SessionDetailPage() {
  const { sessionId } = useParams({ from: '/session/$sessionId' });
  const { data: session, isLoading, error, refetch } = useGetSession(BigInt(sessionId));
  const { userProfile } = useCurrentUser();
  const generateRecs = useGenerateRecommendations();

  const [injectUncertainty, setInjectUncertainty] = useState(false);

  const handleRegenerate = async () => {
    if (!session) return;

    try {
      await generateRecs.mutateAsync({
        sessionId: session.id,
        injectUncertainty,
      });
      toast.success('Recommendations regenerated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to regenerate recommendations');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  if (!session) return <ErrorState error={new Error('Session not found')} />;

  return (
    <AuthGate>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h1 className="text-4xl font-bold tracking-tight">{session.outcome}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(Number(session.created) / 1000000).toLocaleString()}
                </div>
                <Badge variant="outline">{session.timeHorizon}</Badge>
                <Badge variant="outline">{session.riskTolerance}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Context Scan Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Context Scan</CardTitle>
                <CardDescription>Environmental and biometric proxy data</CardDescription>
              </div>
              <Link to="/session/$sessionId/context" params={{ sessionId }}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  {session.contextScan ? 'Update' : 'Add'} Context
                </Button>
              </Link>
            </div>
          </CardHeader>
          {session.contextScan && (
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Stress Level</p>
                <p className="text-2xl font-bold">{Number(session.contextScan.stressLevel)}/10</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mood</p>
                <p className="text-2xl font-bold">{Number(session.contextScan.mood)}/10</p>
              </div>
              <div>
                <p className="text-sm font-medium">Social Energy</p>
                <p className="text-2xl font-bold">{Number(session.contextScan.socialEnergy)}/10</p>
              </div>
              <div>
                <p className="text-sm font-medium">Weather</p>
                <p className="text-lg">{session.contextScan.weather}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Crowd Density</p>
                <p className="text-lg">{session.contextScan.crowdDensity}</p>
              </div>
              {session.contextScan.notes && (
                <div className="md:col-span-3">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">{session.contextScan.notes}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Uncertainty Control */}
        <UncertaintyToggle
          value={injectUncertainty}
          onChange={setInjectUncertainty}
          disabled={generateRecs.isPending}
        />

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Micro-Adjustments</CardTitle>
                <CardDescription>Recommended actions to shift probability in your favor</CardDescription>
              </div>
              <Button onClick={handleRegenerate} disabled={generateRecs.isPending} size="sm" variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${generateRecs.isPending ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {session.recommendations.length > 0 ? (
              <div className="space-y-4">
                {session.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{rec.adjustment}</p>
                        <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recommendations yet. Click "Regenerate" to generate micro-adjustments.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Drift & Probability Debt */}
        <div className="grid gap-6 md:grid-cols-2">
          <EventDriftPanel eventDrift={session.eventDrift} />
          {userProfile && <ProbabilityDebtPanel probabilityDebt={Number(userProfile.probabilityDebt)} />}
        </div>
      </div>
    </AuthGate>
  );
}
