import { useState, useEffect } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import AuthGate from '../components/AuthGate';
import LoadingState from '../components/LoadingState';
import DisclosureBlock from '../components/DisclosureBlock';
import ProbabilityDebtPanel from '../components/ProbabilityDebtPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function SettingsAboutPage() {
  const { userProfile, profileLoading } = useCurrentUser();
  const saveProfile = useSaveCallerUserProfile();

  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    if (userProfile) {
      setCity(userProfile.city);
      setRegion(userProfile.region);
      setPreferences(userProfile.preferences);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveProfile.mutateAsync({ city, region, preferences });
      toast.success('Profile saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  if (profileLoading) return <LoadingState />;

  return (
    <AuthGate>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Settings & About</h1>
          <p className="text-muted-foreground">Manage your profile and learn about GODMODE</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Your location helps calculate collective Timeline Fracture effects</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region/State</Label>
                  <Input id="region" placeholder="CA" value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Any preferences for recommendations..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={saveProfile.isPending}>
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Probability Debt */}
        {userProfile && (
          <>
            <Separator />
            <ProbabilityDebtPanel probabilityDebt={Number(userProfile.probabilityDebt)} />
          </>
        )}

        {/* About & Disclosure */}
        <Separator />

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">About GODMODE</h2>
            <p className="text-muted-foreground">
              GODMODE is a speculative prototype exploring how micro-adjustments to behavior might influence outcomes
              through timing, positioning, and decision-making.
            </p>
          </div>

          <DisclosureBlock />

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Define Your Outcome</h4>
                <p className="text-muted-foreground">
                  Specify what you want to happen. The system analyzes the probability field around your goal.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Context Scanning</h4>
                <p className="text-muted-foreground">
                  Provide proxy signals (stress, mood, environment) that influence decision-making and timing.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Micro-Adjustments</h4>
                <p className="text-muted-foreground">
                  Receive recommendations for small behavioral changes that statistically increase favorable outcomes.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">4. Event Drift Tracking</h4>
                <p className="text-muted-foreground">
                  Monitor probability distributions and trajectory as you make adjustments and inject uncertainty.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">5. Reality Pressure</h4>
                <p className="text-muted-foreground">
                  Track probability debt and trade-offs as you push toward improbable outcomes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGate>
  );
}
