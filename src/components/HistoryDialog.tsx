import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroomingItem } from "@/hooks/useGroomingData";
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
import { toast } from "sonner";

interface HistoryDialogProps {
  items: GroomingItem[];
  onClearHistory: (id: string) => void;
}

const HistoryDialog = ({ items, onClearHistory }: HistoryDialogProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClearHistory = (id: string, title: string) => {
    onClearHistory(id);
    toast.success(`History cleared for ${title}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Completion History</DialogTitle>
          <DialogDescription>
            View past completion dates for each grooming practice
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {items.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="font-display text-sm text-muted-foreground">
                      {item.arabicTitle}
                    </p>
                  </div>
                  {item.history.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear History</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to clear all history for {item.title}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleClearHistory(item.id, item.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Clear
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                {item.history.length > 0 ? (
                  <ul className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                    {item.history.slice(0, 10).map((date, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {formatDate(date)}
                        {index === 0 && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Latest
                          </span>
                        )}
                      </li>
                    ))}
                    {item.history.length > 10 && (
                      <li className="text-xs text-muted-foreground pt-1">
                        ... and {item.history.length - 10} more entries
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground">
                    No history recorded yet
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryDialog;
