import { useEffect, useCallback, useRef } from "react";
import { GroomingItem } from "./useGroomingData";

const NOTIFICATION_KEY = "grooming-notifications-enabled";
const LAST_CHECK_KEY = "grooming-last-notification-check";
const URGENT_THRESHOLD = 5; // days

export const useNotifications = (
  items: GroomingItem[],
  getDaysRemaining: (lastCompleted: Date | null) => number,
  enabled: boolean
) => {
  const hasCheckedToday = useRef(false);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag: "grooming-reminder",
      });
    }
  }, []);

  const checkAndNotify = useCallback(() => {
    if (!enabled || hasCheckedToday.current) return;

    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    const today = new Date().toDateString();

    if (lastCheck === today) {
      hasCheckedToday.current = true;
      return;
    }

    const overdueItems = items.filter(
      (item) => getDaysRemaining(item.lastCompleted) === 0
    );
    const urgentItems = items.filter((item) => {
      const days = getDaysRemaining(item.lastCompleted);
      return days > 0 && days <= URGENT_THRESHOLD;
    });

    if (overdueItems.length > 0) {
      sendNotification(
        "Grooming Tasks Overdue! ⚠️",
        `${overdueItems.map((i) => i.title).join(", ")} ${overdueItems.length === 1 ? "is" : "are"} past the deadline.`
      );
    } else if (urgentItems.length > 0) {
      sendNotification(
        "Grooming Reminder 🕌",
        `${urgentItems.map((i) => i.title).join(", ")} due within ${URGENT_THRESHOLD} days.`
      );
    }

    localStorage.setItem(LAST_CHECK_KEY, today);
    hasCheckedToday.current = true;
  }, [enabled, items, getDaysRemaining, sendNotification]);

  useEffect(() => {
    if (enabled) {
      checkPermission().then((granted) => {
        if (granted) {
          checkAndNotify();
        }
      });
    }
  }, [enabled, checkPermission, checkAndNotify]);

  return { checkPermission, sendNotification };
};

export const getNotificationsEnabled = (): boolean => {
  return localStorage.getItem(NOTIFICATION_KEY) === "true";
};

export const setNotificationsEnabled = (enabled: boolean): void => {
  localStorage.setItem(NOTIFICATION_KEY, enabled.toString());
};
