import { useState, useEffect, useCallback } from 'react';

interface CustomNotification { // Renamed to avoid conflict with browser's Notification
  id: number;
  message: string;
  taskTitle: string;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false); // Default to false

  const addNotification = useCallback((message: string, taskTitle: string) => {
    const newNotification: CustomNotification = {
      id: Date.now(), // Simple unique ID generation
      message,
      taskTitle,
    };

    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    setNotificationCount((prevCount) => prevCount + 1);

    // Browser notification
    if (isNotificationsEnabled && Notification.permission === 'granted') {
      new Notification(taskTitle, { body: message });
    }
  }, [isNotificationsEnabled]);

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  const toggleNotifications = () => {
    setIsNotificationsEnabled((prevState) => !prevState);
  };

  // Request permission for browser notifications on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    notificationCount,
    addNotification,
    clearNotifications,
    isNotificationsEnabled,
    toggleNotifications,
  };
};