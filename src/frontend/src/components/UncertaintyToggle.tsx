import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface UncertaintyToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function UncertaintyToggle({ value, onChange, disabled }: UncertaintyToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <div>
          <Label htmlFor="inject-uncertainty" className="text-base font-medium cursor-pointer">
            Inject Uncertainty
          </Label>
          <p className="text-sm text-muted-foreground">Increase exposure to randomness and risk</p>
        </div>
      </div>
      <Switch id="inject-uncertainty" checked={value} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
