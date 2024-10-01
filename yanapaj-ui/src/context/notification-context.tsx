import { createContext, PropsWithChildren, ReactElement } from "react";
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
  const notificationState = useNotification();

  return (
    <NotificationContext.Provider value={notificationState}>
      {props.children}
    </NotificationContext.Provider>
  );
}
