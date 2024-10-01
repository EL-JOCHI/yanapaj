import { useState, useEffect, useCallback, useContext } from "react";
import { NotificationContext } from "@/context/notification-context.tsx";

interface CustomNotification {
  id: number;
  message: string;
  taskTitle: string;
}

export const useNotification = () => {
  const { isNotificationsEnabled } = useContext(NotificationContext);
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const addNotification = useCallback(
    (message: string, taskTitle: string) => {
      const newNotification: CustomNotification = {
        id: Date.now(),
        message,
        taskTitle,
      };

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
      setNotificationCount((prevCount) => prevCount + 1);

      // Browser notification
      if (isNotificationsEnabled && Notification.permission === "granted") {
        new Notification(taskTitle, { body: message });
      }
    },
    [isNotificationsEnabled],
  );

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  // Request permission for browser notifications on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    if (
      isNotificationsEnabled &&
      notifications.length > 0 &&
      Notification.permission === "granted"
    ) {
      const latestNotification = notifications[notifications.length - 1];
      new Notification(latestNotification.taskTitle, {
        body: latestNotification.message,
      });
    }
  }, [notifications, isNotificationsEnabled]);

  return {
    notifications,
    notificationCount,
    addNotification,
    clearNotifications,
  };
};