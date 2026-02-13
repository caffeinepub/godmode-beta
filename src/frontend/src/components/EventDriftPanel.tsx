import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { EventDrift } from '../backend';

interface EventDriftPanelProps {
  eventDrift: EventDrift;
}

export default function EventDriftPanel({ eventDrift }: EventDriftPanelProps) {
  const categories = [
    { label: 'Average Week', value: Number(eventDrift.averageWeek), color: 'bg-chart-1' },
    { label: 'Unusual Event', value: Number(eventDrift.unusual), color: 'bg-chart-2' },
    { label: 'High Impact', value: Number(eventDrift.highImpact), color: 'bg-chart-3' },
    { label: 'Life Altering', value: Number(eventDrift.lifeAltering), color: 'bg-chart-4' },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.value, 0);
  const trajectory = Number(eventDrift.currentTrajectory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Drift</CardTitle>
        <CardDescription>Probability distribution of near-term outcomes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{cat.label}</span>
                <span className="text-muted-foreground">{cat.value}%</span>
              </div>
              <Progress value={cat.value} className="h-2" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Current Trajectory</span>
            <span className="text-muted-foreground">{trajectory}/100</span>
          </div>
          <Progress value={trajectory} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {trajectory < 30 && 'Low uncertainty - stable path'}
            {trajectory >= 30 && trajectory < 60 && 'Moderate uncertainty - balanced'}
            {trajectory >= 60 && 'High uncertainty - volatile path'}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">Total probability: {total}%</p>
      </CardContent>
    </Card>
  );
}
