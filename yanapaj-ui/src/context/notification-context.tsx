import { createContext, PropsWithChildren, ReactElement, useState, useEffect } from "react";
import { useNotification } from "@/hooks/use-notification";

interface CustomNotification {
  id: number;
  message: string;
  taskTitle: string;
}

interface NotificationContextType {
  notifications: CustomNotification[];
  notificationCount: number;
  addNotification: (message: string, taskTitle: string) => void;
  clearNotifications: () => void;
  isNotificationsEnabled: boolean;
  toggleNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notificationCount: 0,
  addNotification: () => {},
  clearNotifications: () => {},
  isNotificationsEnabled: false,
  toggleNotifications: () => {},
});

export default function NotificationProvider(props: Readonly<PropsWithChildren<{}>>): ReactElement {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const storedPreference = localStorage.getItem("notificationsEnabled");
    if (storedPreference !== null) {
      setIsNotificationsEnabled(storedPreference === "true");
    }
  }, []);

  // Save preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("notificationsEnabled", isNotificationsEnabled.toString());
  }, [isNotificationsEnabled]);

  const toggleNotifications = () => {
    setIsNotificationsEnabled((prevState) => !prevState);
  };

  // Call useNotification here, before using notificationState
  const notificationState = useNotification();

  const value: NotificationContextType = {
    isNotificationsEnabled,
    toggleNotifications,
    // These values come from useNotification
    notifications: notificationState.notifications,
    notificationCount: notificationState.notificationCount,
    addNotification: notificationState.addNotification,
    clearNotifications: notificationState.clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {props.children}
    </NotificationContext.Provider>
  );
}
