import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetSession, useAddContextScan } from '../hooks/useQueries';
import AuthGate from '../components/AuthGate';
import LoadingState from '../components/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { ContextScanSnapshot } from '../backend';

export default function ContextScanPage() {
  const { sessionId } = useParams({ from: '/session/$sessionId/context' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetSession(BigInt(sessionId));
  const addContext = useAddContextScan();

  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState(5);
  const [socialEnergy, setSocialEnergy] = useState(5);
  const [weather, setWeather] = useState('Clear');
  const [crowdDensity, setCrowdDensity] = useState('Moderate');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (session?.contextScan) {
      setStressLevel(Number(session.contextScan.stressLevel));
      setMood(Number(session.contextScan.mood));
      setSocialEnergy(Number(session.contextScan.socialEnergy));
      setWeather(session.contextScan.weather);
      setCrowdDensity(session.contextScan.crowdDensity);
      setNotes(session.contextScan.notes);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const snapshot: ContextScanSnapshot = {
      stressLevel: BigInt(stressLevel),
      mood: BigInt(mood),
      socialEnergy: BigInt(socialEnergy),
      weather,
      crowdDensity,
      notes,
    };

    try {
      await addContext.mutateAsync({
        sessionId: BigInt(sessionId),
        snapshot,
      });

      toast.success('Context scan saved');
      navigate({ to: '/session/$sessionId', params: { sessionId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save context scan');
    }
  };

  if (isLoading) return <LoadingState />;

  return (
    <AuthGate>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/session/$sessionId', params: { sessionId } })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Context Scan</h1>
            <p className="text-muted-foreground">Update environmental and biometric proxy data</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
            <CardDescription>Provide proxy signals for probability calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Stress Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stress">Stress Level</Label>
                  <span className="text-sm font-medium">{stressLevel}/10</span>
                </div>
                <Slider
                  id="stress"
                  min={1}
                  max={10}
                  step={1}
                  value={[stressLevel]}
                  onValueChange={(val) => setStressLevel(val[0])}
                />
              </div>

              {/* Mood */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mood">Mood</Label>
                  <span className="text-sm font-medium">{mood}/10</span>
                </div>
                <Slider
                  id="mood"
                  min={1}
                  max={10}
                  step={1}
                  value={[mood]}
                  onValueChange={(val) => setMood(val[0])}
                />
              </div>

              {/* Social Energy */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="social">Social Energy</Label>
                  <span className="text-sm font-medium">{socialEnergy}/10</span>
                </div>
                <Slider
                  id="social"
                  min={1}
                  max={10}
                  step={1}
                  value={[socialEnergy]}
                  onValueChange={(val) => setSocialEnergy(val[0])}
                />
              </div>

              {/* Weather */}
              <div className="space-y-2">
                <Label htmlFor="weather">Weather</Label>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger id="weather">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Cloudy">Cloudy</SelectItem>
                    <SelectItem value="Rainy">Rainy</SelectItem>
                    <SelectItem value="Stormy">Stormy</SelectItem>
                    <SelectItem value="Snowy">Snowy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Crowd Density */}
              <div className="space-y-2">
                <Label htmlFor="crowd">Crowd Density</Label>
                <Select value={crowdDensity} onValueChange={setCrowdDensity}>
                  <SelectTrigger id="crowd">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Empty">Empty</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Dense">Dense</SelectItem>
                    <SelectItem value="Packed">Packed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other relevant context..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={addContext.isPending}>
                {addContext.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Context Scan'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
