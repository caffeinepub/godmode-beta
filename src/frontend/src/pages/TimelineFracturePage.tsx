import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, TrendingUp, Zap } from 'lucide-react';

export default function TimelineFracturePage() {
  // Mock data for Timeline Fracture - in a real implementation, this would come from backend aggregates
  const cityData = [
    {
      city: 'San Francisco',
      region: 'CA',
      activeUsers: 127,
      uncertaintyLevel: 68,
      effects: ['Stock volatility spike detected', 'Unusual traffic patterns', 'Social event clustering'],
    },
    {
      city: 'New York',
      region: 'NY',
      activeUsers: 203,
      uncertaintyLevel: 82,
      effects: ['High social collision probability', 'Viral moment potential', 'Market anomalies'],
    },
    {
      city: 'London',
      region: 'UK',
      activeUsers: 89,
      uncertaintyLevel: 45,
      effects: ['Moderate traffic anomalies', 'Unplanned gathering potential'],
    },
    {
      city: 'Tokyo',
      region: 'JP',
      activeUsers: 156,
      uncertaintyLevel: 71,
      effects: ['High crowd density shifts', 'Social collision events', 'Transit disruptions'],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Timeline Fracture</h1>
        <p className="text-muted-foreground">Collective probability distortion effects by region</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Collective Reality Pressure</AlertTitle>
        <AlertDescription>
          When multiple users inject uncertainty in the same region, collective effects emerge: traffic anomalies, stock
          volatility, social collisions, and viral moments become more probable.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {cityData.map((data) => (
          <Card key={`${data.city}-${data.region}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {data.city}, {data.region}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Zap className="w-4 h-4" />
                    {data.activeUsers} active uncertainty injections
                  </CardDescription>
                </div>
                <Badge
                  variant={data.uncertaintyLevel > 70 ? 'destructive' : data.uncertaintyLevel > 50 ? 'default' : 'outline'}
                  className="text-lg px-4 py-1"
                >
                  {data.uncertaintyLevel}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Collective Effects
                </h4>
                <div className="space-y-2">
                  {data.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert variant="destructive">
        <AlertTitle>High Uncertainty Regions</AlertTitle>
        <AlertDescription>
          Regions with uncertainty levels above 70% are experiencing significant probability distortion. Expect increased
          unpredictability and emergent events.
        </AlertDescription>
      </Alert>
    </div>
  );
}
