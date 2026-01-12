import { useState, useEffect } from "react";

export interface GroomingItem {
  id: string;
  title: string;
  arabicTitle: string;
  lastCompleted: Date | null;
}

const STORAGE_KEY = "grooming-reminder-data";

const defaultItems: GroomingItem[] = [
  { id: "nails", title: "Trim Nails", arabicTitle: "تقليم الأظافر", lastCompleted: null },
  { id: "armpit", title: "Armpit Hair", arabicTitle: "نتف الإبط", lastCompleted: null },
  { id: "pubic", title: "Pubic Hair", arabicTitle: "حلق العانة", lastCompleted: null },
  { id: "mustache", title: "Trim Mustache", arabicTitle: "قص الشارب", lastCompleted: null },
];

export const useGroomingData = () => {
  const [items, setItems] = useState<GroomingItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        lastCompleted: item.lastCompleted ? new Date(item.lastCompleted) : null,
      }));
    }
    return defaultItems;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const markComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lastCompleted: new Date() } : item
      )
    );
  };

  const getDaysRemaining = (lastCompleted: Date | null): number => {
    if (!lastCompleted) return 0; // Overdue if never completed
    const now = new Date();
    const diffTime = lastCompleted.getTime() + 40 * 24 * 60 * 60 * 1000 - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const resetAll = () => {
    setItems(defaultItems);
  };

  return { items, markComplete, getDaysRemaining, resetAll };
};
