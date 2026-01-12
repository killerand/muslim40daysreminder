import { useState, useEffect } from "react";

export interface GroomingItem {
  id: string;
  title: string;
  arabicTitle: string;
  lastCompleted: Date | null;
  history: Date[];
}

const STORAGE_KEY = "grooming-reminder-data";
const PERIOD_KEY = "grooming-reminder-period";
const DEFAULT_PERIOD = 40;

const defaultItems: GroomingItem[] = [
  { id: "nails", title: "Trim Nails", arabicTitle: "تقليم الأظافر", lastCompleted: null, history: [] },
  { id: "armpit", title: "Armpit Hair", arabicTitle: "نتف الإبط", lastCompleted: null, history: [] },
  { id: "pubic", title: "Pubic Hair", arabicTitle: "حلق العانة", lastCompleted: null, history: [] },
  { id: "mustache", title: "Trim Mustache", arabicTitle: "قص الشارب", lastCompleted: null, history: [] },
];

export const useGroomingData = () => {
  const [items, setItems] = useState<GroomingItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        lastCompleted: item.lastCompleted ? new Date(item.lastCompleted) : null,
        history: (item.history || []).map((d: string) => new Date(d)),
      }));
    }
    return defaultItems;
  });

  const [reminderPeriod, setReminderPeriod] = useState<number>(() => {
    const stored = localStorage.getItem(PERIOD_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_PERIOD;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(PERIOD_KEY, reminderPeriod.toString());
  }, [reminderPeriod]);

  const markComplete = (id: string) => {
    const now = new Date();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, lastCompleted: now, history: [now, ...item.history] }
          : item
      )
    );
  };

  const getDaysRemaining = (lastCompleted: Date | null): number => {
    if (!lastCompleted) return 0;
    const now = new Date();
    const diffTime = lastCompleted.getTime() + reminderPeriod * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const resetAll = () => {
    setItems(defaultItems);
  };

  const updateReminderPeriod = (days: number) => {
    const validDays = Math.max(1, Math.min(365, days));
    setReminderPeriod(validDays);
  };

  const clearHistory = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, history: [], lastCompleted: null } : item
      )
    );
  };

  return { items, markComplete, getDaysRemaining, resetAll, reminderPeriod, updateReminderPeriod, clearHistory };
};
