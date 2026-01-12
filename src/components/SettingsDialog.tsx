import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SettingsDialogProps {
  reminderPeriod: number;
  onUpdatePeriod: (days: number) => void;
}

const SettingsDialog = ({ reminderPeriod, onUpdatePeriod }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState(reminderPeriod.toString());

  const handleSave = () => {
    const days = parseInt(period, 10);
    if (isNaN(days) || days < 1 || days > 365) {
      toast.error("Please enter a valid number between 1 and 365");
      return;
    }
    onUpdatePeriod(days);
    setOpen(false);
    toast.success(`Reminder period updated to ${days} days`);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setPeriod(reminderPeriod.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Settings</DialogTitle>
          <DialogDescription>
            Customize your grooming reminder preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="period">Reminder Period (days)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="period"
                type="number"
                min={1}
                max={365}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="max-w-[120px]"
              />
              <span className="text-sm text-muted-foreground">
                Default is 40 days (Sunnah)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              The traditional time limit set by the Prophet ﷺ is 40 days, but you can adjust this based on your personal needs.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
