import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarDays, Droplets, Plus, Trash2, Settings, Moon, Sun, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePeriodData, PeriodEntry } from "@/hooks/usePeriodData";
import ProgressRing from "./ProgressRing";

const phaseInfo = {
  menstrual: {
    label: "Menstrual Phase",
    arabicLabel: "فترة الحيض",
    icon: Droplets,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    description: "Rest and self-care period",
  },
  follicular: {
    label: "Follicular Phase",
    arabicLabel: "المرحلة الجرابية",
    icon: Sun,
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Energy levels rising",
  },
  ovulation: {
    label: "Ovulation Phase",
    arabicLabel: "مرحلة التبويض",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Peak fertility window",
  },
  luteal: {
    label: "Luteal Phase",
    arabicLabel: "المرحلة الأصفرية",
    icon: Moon,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    description: "Preparing for next cycle",
  },
};

const PeriodTracker = () => {
  const {
    entries,
    addPeriod,
    deletePeriod,
    getNextPeriodDate,
    getDaysUntilNextPeriod,
    getCurrentPhase,
    getAverageCycleLength,
    cycleLength,
    periodLength,
    updateCycleLength,
    updatePeriodLength,
  } = usePeriodData();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [localCycleLength, setLocalCycleLength] = useState(cycleLength);
  const [localPeriodLength, setLocalPeriodLength] = useState(periodLength);

  const daysUntilNext = getDaysUntilNextPeriod();
  const nextPeriodDate = getNextPeriodDate();
  const currentPhase = getCurrentPhase();
  const avgCycleLength = getAverageCycleLength();

  const handleAddPeriod = () => {
    if (!selectedDate) {
      toast.error("Please select a start date");
      return;
    }
    addPeriod(selectedDate);
    toast.success("Period logged successfully!");
    setAddDialogOpen(false);
    setSelectedDate(new Date());
  };

  const handleDeletePeriod = (id: string) => {
    deletePeriod(id);
    toast.info("Period entry deleted");
  };

  const handleSaveSettings = () => {
    updateCycleLength(localCycleLength);
    updatePeriodLength(localPeriodLength);
    setSettingsOpen(false);
    toast.success("Settings saved");
  };

  const progress = daysUntilNext !== null 
    ? Math.max(0, ((cycleLength - daysUntilNext) / cycleLength) * 100)
    : 0;

  const PhaseIcon = currentPhase ? phaseInfo[currentPhase].icon : Sparkles;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="relative overflow-hidden p-6 card-glow">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-destructive/20 to-transparent" />
        
        {/* Settings Button */}
        <Popover open={settingsOpen} onOpenChange={(open) => {
          setSettingsOpen(open);
          if (open) {
            setLocalCycleLength(cycleLength);
            setLocalPeriodLength(periodLength);
          }
        }}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cycle Length: {localCycleLength} days</Label>
                <Slider
                  value={[localCycleLength]}
                  onValueChange={([value]) => setLocalCycleLength(value)}
                  min={21}
                  max={45}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Period Length: {localPeriodLength} days</Label>
                <Slider
                  value={[localPeriodLength]}
                  onValueChange={([value]) => setLocalPeriodLength(value)}
                  min={2}
                  max={10}
                  step={1}
                />
              </div>
              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {currentPhase && (
            <p className="font-display text-lg text-muted-foreground">
              {phaseInfo[currentPhase].arabicLabel}
            </p>
          )}

          <ProgressRing progress={progress} size={160} strokeWidth={12}>
            <div className="flex flex-col items-center">
              <PhaseIcon className={cn(
                "mb-1 h-8 w-8",
                currentPhase ? phaseInfo[currentPhase].color : "text-primary"
              )} />
              {daysUntilNext !== null ? (
                <>
                  <span className={cn(
                    "text-3xl font-bold",
                    daysUntilNext <= 3 && "text-destructive"
                  )}>
                    {daysUntilNext <= 0 ? "Due" : daysUntilNext}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {daysUntilNext <= 0 ? "now" : "days left"}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No data</span>
              )}
            </div>
          </ProgressRing>

          {currentPhase && (
            <div className={cn(
              "rounded-full px-4 py-1",
              phaseInfo[currentPhase].bgColor
            )}>
              <span className={cn("text-sm font-medium", phaseInfo[currentPhase].color)}>
                {phaseInfo[currentPhase].label}
              </span>
            </div>
          )}

          {nextPeriodDate && (
            <p className="text-sm text-muted-foreground">
              Next period: {format(nextPeriodDate, "MMM d, yyyy")}
            </p>
          )}

          {/* Log Period Button */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2 gap-2">
                <Plus className="h-4 w-4" />
                Log Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Log Period Start</DialogTitle>
                <DialogDescription>
                  Select the first day of your period
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date()}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPeriod}>
                  Log Period
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <CalendarDays className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-2xl font-bold">{cycleLength}</p>
          <p className="text-xs text-muted-foreground">Cycle Length</p>
        </Card>
        <Card className="p-4 text-center">
          <Droplets className="mx-auto mb-2 h-6 w-6 text-destructive" />
          <p className="text-2xl font-bold">{periodLength}</p>
          <p className="text-xs text-muted-foreground">Period Length</p>
        </Card>
        <Card className="p-4 text-center">
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-accent" />
          <p className="text-2xl font-bold">{avgCycleLength || "—"}</p>
          <p className="text-xs text-muted-foreground">Avg Cycle</p>
        </Card>
      </div>

      {/* History */}
      {entries.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-4 font-display text-lg font-semibold">Period History</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="font-medium">
                        {format(entry.startDate, "MMM d, yyyy")}
                      </p>
                      {index === 0 && (
                        <span className="text-xs text-primary">Latest</span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove this period entry from your history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePeriod(entry.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default PeriodTracker;
