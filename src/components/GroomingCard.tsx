import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressRing from "./ProgressRing";
import { cn } from "@/lib/utils";

interface GroomingCardProps {
  title: string;
  arabicTitle: string;
  icon: React.ReactNode;
  daysRemaining: number;
  lastCompleted: Date | null;
  onComplete: () => void;
  reminderPeriod?: number;
}

const GroomingCard = ({
  title,
  arabicTitle,
  icon,
  daysRemaining,
  lastCompleted,
  onComplete,
  reminderPeriod = 40,
}: GroomingCardProps) => {
  const progress = Math.max(0, ((reminderPeriod - daysRemaining) / reminderPeriod) * 100);
  const isUrgent = daysRemaining <= 5;
  const isOverdue = daysRemaining <= 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-6 transition-all duration-300 hover:shadow-lg card-glow",
        "animate-fade-in",
        isOverdue && "ring-2 ring-destructive/50"
      )}
    >
      {/* Decorative corner */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-gold/20 to-transparent" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Arabic title */}
        <p className="font-display text-lg text-muted-foreground">{arabicTitle}</p>
        
        {/* Progress ring with icon */}
        <ProgressRing progress={progress} size={140} strokeWidth={10}>
          <div className="flex flex-col items-center">
            <div className={cn(
              "mb-1 text-primary transition-colors",
              isUrgent && "text-accent",
              isOverdue && "text-destructive"
            )}>
              {icon}
            </div>
            <span className={cn(
              "text-2xl font-bold",
              isUrgent && "text-accent",
              isOverdue && "text-destructive"
            )}>
              {isOverdue ? "Due!" : daysRemaining}
            </span>
            <span className="text-xs text-muted-foreground">
              {isOverdue ? "" : "days left"}
            </span>
          </div>
        </ProgressRing>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>

        {/* Last completed */}
        <p className="text-sm text-muted-foreground">
          {lastCompleted
            ? `Last: ${lastCompleted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : "Not yet recorded"}
        </p>

        {/* Complete button */}
        <Button
          onClick={onComplete}
          variant="default"
          className="mt-2 w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Check className="h-4 w-4" />
          Mark Complete
        </Button>
      </div>
    </Card>
  );
};

export default GroomingCard;
