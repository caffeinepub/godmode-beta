import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateOutcomeSession } from '../hooks/useQueries';
import AuthGate from '../components/AuthGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function NewSessionPage() {
  const navigate = useNavigate();
  const createSession = useCreateOutcomeSession();

  const [outcome, setOutcome] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('24 hours');
  const [riskTolerance, setRiskTolerance] = useState('Moderate');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!outcome.trim()) {
      toast.error('Please enter a desired outcome');
      return;
    }

    try {
      const sessionId = await createSession.mutateAsync({
        outcome: outcome.trim(),
        timeHorizon,
        riskTolerance,
      });

      toast.success('Session created successfully');
      navigate({ to: '/session/$sessionId', params: { sessionId: sessionId.toString() } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create session');
    }
  };

  return (
    <AuthGate>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">New Session</h1>
          <p className="text-muted-foreground">Define your desired outcome and parameters</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Configuration</CardTitle>
            <CardDescription>What probability do you want to shift in your favor?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="outcome">Desired Outcome *</Label>
                <Textarea
                  id="outcome"
                  placeholder="e.g., I want to run into an investor, I want this negotiation to go my way, I want a lucky break..."
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">Be specific about what you want to happen</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeHorizon">Time Horizon</Label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger id="timeHorizon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Next hour">Next hour</SelectItem>
                      <SelectItem value="24 hours">24 hours</SelectItem>
                      <SelectItem value="This week">This week</SelectItem>
                      <SelectItem value="This month">This month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                    <SelectTrigger id="riskTolerance">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createSession.isPending}>
                {createSession.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  'Start Session'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
