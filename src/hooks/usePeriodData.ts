import { useState, useEffect } from "react";

export interface PeriodEntry {
  id: string;
  startDate: Date;
  endDate: Date | null;
}

const STORAGE_KEY = "period-tracker-data";
const CYCLE_LENGTH_KEY = "period-cycle-length";
const PERIOD_LENGTH_KEY = "period-length";

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

export const usePeriodData = () => {
  const [entries, setEntries] = useState<PeriodEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        startDate: new Date(entry.startDate),
        endDate: entry.endDate ? new Date(entry.endDate) : null,
      }));
    }
    return [];
  });

  const [cycleLength, setCycleLength] = useState<number>(() => {
    const stored = localStorage.getItem(CYCLE_LENGTH_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_CYCLE_LENGTH;
  });

  const [periodLength, setPeriodLength] = useState<number>(() => {
    const stored = localStorage.getItem(PERIOD_LENGTH_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_PERIOD_LENGTH;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(CYCLE_LENGTH_KEY, cycleLength.toString());
  }, [cycleLength]);

  useEffect(() => {
    localStorage.setItem(PERIOD_LENGTH_KEY, periodLength.toString());
  }, [periodLength]);

  const addPeriod = (startDate: Date, endDate?: Date) => {
    const newEntry: PeriodEntry = {
      id: Date.now().toString(),
      startDate,
      endDate: endDate || null,
    };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()));
  };

  const updatePeriod = (id: string, startDate: Date, endDate: Date | null) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, startDate, endDate } : entry
      ).sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    );
  };

  const deletePeriod = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getNextPeriodDate = (): Date | null => {
    if (entries.length === 0) return null;
    const lastPeriod = entries[0];
    const nextDate = new Date(lastPeriod.startDate);
    nextDate.setDate(nextDate.getDate() + cycleLength);
    return nextDate;
  };

  const getDaysUntilNextPeriod = (): number | null => {
    const nextDate = getNextPeriodDate();
    if (!nextDate) return null;
    const now = new Date();
    const diffTime = nextDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCurrentPhase = (): "menstrual" | "follicular" | "ovulation" | "luteal" | null => {
    if (entries.length === 0) return null;
    const lastPeriod = entries[0];
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - lastPeriod.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceStart < 0) return null;
    if (daysSinceStart < periodLength) return "menstrual";
    if (daysSinceStart < cycleLength / 2 - 2) return "follicular";
    if (daysSinceStart < cycleLength / 2 + 2) return "ovulation";
    if (daysSinceStart < cycleLength) return "luteal";
    return null;
  };

  const getAverageCycleLength = (): number | null => {
    if (entries.length < 2) return null;
    let totalDays = 0;
    for (let i = 0; i < entries.length - 1; i++) {
      const diff = entries[i].startDate.getTime() - entries[i + 1].startDate.getTime();
      totalDays += Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    return Math.round(totalDays / (entries.length - 1));
  };

  const updateCycleLength = (days: number) => {
    setCycleLength(Math.max(21, Math.min(45, days)));
  };

  const updatePeriodLength = (days: number) => {
    setPeriodLength(Math.max(2, Math.min(10, days)));
  };

  const resetAll = () => {
    setEntries([]);
    setCycleLength(DEFAULT_CYCLE_LENGTH);
    setPeriodLength(DEFAULT_PERIOD_LENGTH);
  };

  return {
    entries,
    addPeriod,
    updatePeriod,
    deletePeriod,
    getNextPeriodDate,
    getDaysUntilNextPeriod,
    getCurrentPhase,
    getAverageCycleLength,
    cycleLength,
    periodLength,
    updateCycleLength,
    updatePeriodLength,
    resetAll,
  };
};
