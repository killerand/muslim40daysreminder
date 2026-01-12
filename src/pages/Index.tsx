import { Scissors, Hand, CircleDot, Sparkle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import GroomingCard from "@/components/GroomingCard";
import { Button } from "@/components/ui/button";
import { useGroomingData } from "@/hooks/useGroomingData";

const iconMap: Record<string, React.ReactNode> = {
  nails: <Hand className="h-8 w-8" />,
  armpit: <Sparkle className="h-8 w-8" />,
  pubic: <CircleDot className="h-8 w-8" />,
  mustache: <Scissors className="h-8 w-8" />,
};

const Index = () => {
  const { items, markComplete, getDaysRemaining, resetAll } = useGroomingData();

  const handleComplete = (id: string, title: string) => {
    markComplete(id);
    toast.success(`${title} marked as complete!`, {
      description: "May Allah accept your adherence to the Sunnah.",
    });
  };

  const handleReset = () => {
    resetAll();
    toast.info("All records have been reset.");
  };

  // Calculate overall status
  const overdueTasks = items.filter((item) => getDaysRemaining(item.lastCompleted) === 0);
  const urgentTasks = items.filter((item) => {
    const days = getDaysRemaining(item.lastCompleted);
    return days > 0 && days <= 5;
  });

  return (
    <div className="min-h-screen bg-background bg-pattern">
      <div className="container mx-auto max-w-5xl px-4 pb-12">
        <Header />

        {/* Status banner */}
        {(overdueTasks.length > 0 || urgentTasks.length > 0) && (
          <div className="mb-8 animate-fade-in rounded-lg border border-accent/30 bg-accent/10 p-4 text-center">
            {overdueTasks.length > 0 && (
              <p className="font-medium text-foreground">
                <span className="text-destructive">{overdueTasks.length} task(s)</span> are overdue!
              </p>
            )}
            {urgentTasks.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {urgentTasks.length} task(s) due within 5 days
              </p>
            )}
          </div>
        )}

        {/* Grooming cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GroomingCard
                title={item.title}
                arabicTitle={item.arabicTitle}
                icon={iconMap[item.id]}
                daysRemaining={getDaysRemaining(item.lastCompleted)}
                lastCompleted={item.lastCompleted}
                onComplete={() => handleComplete(item.id, item.title)}
              />
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-12 rounded-xl border border-border/50 bg-card p-6 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">
            The 40-Day Sunnah
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            The Prophet Muhammad ﷺ set a time limit for Muslims to trim their nails, 
            shave their pubic hair, pluck their armpit hair, and trim their mustaches. 
            Anas ibn Malik reported that the time limit was forty days.
          </p>
          <p className="mt-2 text-xs font-medium text-primary">
            — Sahih Muslim 258
          </p>
        </div>

        {/* Reset button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Records
          </Button>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="font-display text-lg text-muted-foreground">
            جَزَاكَ اللَّهُ خَيْرًا
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            May Allah reward you with goodness
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
