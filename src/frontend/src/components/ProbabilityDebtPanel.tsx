import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProbabilityDebtPanelProps {
  probabilityDebt: number;
}

export default function ProbabilityDebtPanel({ probabilityDebt }: ProbabilityDebtPanelProps) {
  const getThreshold = () => {
    if (probabilityDebt < 30) return { level: 'Normal', variant: 'default' as const, color: 'text-green-500' };
    if (probabilityDebt < 70) return { level: 'Elevated', variant: 'default' as const, color: 'text-yellow-500' };
    return { level: 'Critical', variant: 'destructive' as const, color: 'text-red-500' };
  };

  const threshold = getThreshold();

  const tradeoffs = [
    { label: 'Career Success', value: Math.min(100, probabilityDebt * 1.2), icon: TrendingUp },
    { label: 'Burnout Risk', value: Math.min(100, probabilityDebt * 0.8), icon: AlertTriangle },
    { label: 'Relationship Strain', value: Math.min(100, probabilityDebt * 0.6), icon: TrendingDown },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Probability Debt</CardTitle>
        <CardDescription>Reality pressure from forcing improbable outcomes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current Level</span>
            <span className={`text-sm font-bold ${threshold.color}`}>
              {probabilityDebt} - {threshold.level}
            </span>
          </div>
          <Progress value={probabilityDebt} className="h-3" />
        </div>

        {probabilityDebt >= 30 && (
          <Alert variant={threshold.variant}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {threshold.level === 'Elevated' &&
                'Moderate reality pressure detected. Consider balancing your outcome goals.'}
              {threshold.level === 'Critical' &&
                'High reality pressure! Forcing too many improbable outcomes may increase instability.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium">Trade-off Indicators</h4>
          {tradeoffs.map((tradeoff) => {
            const Icon = tradeoff.icon;
            return (
              <div key={tradeoff.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{tradeoff.label}</span>
                  </div>
                  <span className="text-muted-foreground">{Math.round(tradeoff.value)}%</span>
                </div>
                <Progress value={tradeoff.value} className="h-1.5" />
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          The more you push reality in one direction, the more instability you create elsewhere.
        </p>
      </CardContent>
    </Card>
  );
}
