import { Link } from '@tanstack/react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetUserSessions } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowRight, Clock } from 'lucide-react';
import DisclosureBlock from '../components/DisclosureBlock';
import LoadingState from '../components/LoadingState';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { isAuthenticated } = useCurrentUser();
  const { data: sessions, isLoading } = useGetUserSessions();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section
        className="relative rounded-2xl overflow-hidden bg-cover bg-center min-h-[400px] flex items-center"
        style={{ backgroundImage: 'url(/assets/generated/godmode-hero-bg.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60" />
        <div className="relative z-10 max-w-2xl px-8 py-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Edit the probability of reality.</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Statistical reality biasing through micro-adjustments. Not manifestation. Not affirmations. Engineered
            serendipity.
          </p>
          {isAuthenticated ? (
            <Link to="/new-session">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Start New Session
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">Sign in to begin your first session</p>
          )}
        </div>
      </section>

      {/* Disclosure */}
      <DisclosureBlock />

      {/* Sessions List */}
      {isAuthenticated && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Your Sessions</h2>
              <p className="text-muted-foreground">Active probability manipulation sessions</p>
            </div>
            <Link to="/new-session">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                New Session
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : sessions && sessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <Link
                  key={session.id.toString()}
                  to="/session/$sessionId"
                  params={{ sessionId: session.id.toString() }}
                >
                  <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">{session.outcome}</CardTitle>
                        <Badge variant="outline" className="shrink-0">
                          {session.recommendations.length} tips
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(Number(session.created) / 1000000).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {session.timeHorizon} • {session.riskTolerance}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">No sessions yet. Start your first probability manipulation.</p>
                <Link to="/new-session">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Features Overview */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Event Drift</CardTitle>
            <CardDescription>Live probability trajectories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track the likelihood of average, unusual, high-impact, and life-altering events in real-time.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reality Pressure</CardTitle>
            <CardDescription>Probability debt tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor trade-offs as you push reality toward improbable outcomes. Balance is key.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Timeline Fracture</CardTitle>
            <CardDescription>Collective effects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See how uncertainty injection by multiple users creates ripple effects across cities.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
