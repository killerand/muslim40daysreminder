import { useState, useEffect } from "react";
import { Settings, Bell, BellOff } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "@/hooks/useNotifications";

interface SettingsDialogProps {
  reminderPeriod: number;
  onUpdatePeriod: (days: number) => void;
  onNotificationsChange?: (enabled: boolean) => void;
}

const SettingsDialog = ({
  reminderPeriod,
  onUpdatePeriod,
  onNotificationsChange,
}: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState(reminderPeriod.toString());
  const [notificationsEnabled, setNotificationsEnabledState] = useState(
    getNotificationsEnabled
  );
  const [notificationsSupported, setNotificationsSupported] = useState(true);

  useEffect(() => {
    setNotificationsSupported("Notification" in window);
  }, []);

  const handleSave = async () => {
    const days = parseInt(period, 10);
    if (isNaN(days) || days < 1 || days > 365) {
      toast.error("Please enter a valid number between 1 and 365");
      return;
    }

    // Handle notifications permission
    if (notificationsEnabled && "Notification" in window) {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          toast.error("Notification permission denied");
          setNotificationsEnabledState(false);
          setNotificationsEnabled(false);
          onNotificationsChange?.(false);
        }
      }
    }

    setNotificationsEnabled(notificationsEnabled);
    onNotificationsChange?.(notificationsEnabled);

    onUpdatePeriod(days);
    setOpen(false);
    toast.success("Settings saved successfully");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setPeriod(reminderPeriod.toString());
      setNotificationsEnabledState(getNotificationsEnabled());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
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
        <div className="space-y-6 py-4">
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
              Sets the default period for all tasks. You can also customize each
              task individually using the settings icon on each card.
            </p>
          </div>

          {notificationsSupported && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notificationsEnabled ? (
                    <Bell className="h-4 w-4 text-primary" />
                  ) : (
                    <BellOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="notifications">Push Notifications</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabledState}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Receive browser notifications when tasks are approaching their
                deadline or overdue.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
