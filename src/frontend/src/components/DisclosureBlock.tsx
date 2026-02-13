import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function DisclosureBlock() {
  return (
    <Alert className="border-muted-foreground/20">
      <Info className="h-4 w-4" />
      <AlertTitle>Important Disclosure</AlertTitle>
      <AlertDescription className="mt-2 space-y-2 text-sm">
        <p>
          GODMODE is a <strong>speculative prototype experience</strong> that provides behavioral prompts and
          probabilistic framing.
        </p>
        <p>
          <strong>No guarantees:</strong> Recommendations are suggestions based on statistical patterns, not certainties.
        </p>
        <p>
          <strong>Context inputs:</strong> All context data (stress, mood, weather, etc.) is user-provided. This build
          does not access real biometric sensors, cameras, or social media APIs.
        </p>
        <p className="text-muted-foreground">
          The app explores how micro-adjustments to behavior might influence outcomes through timing, positioning, and
          decision-making.
        </p>
      </AlertDescription>
    </Alert>
  );
}
