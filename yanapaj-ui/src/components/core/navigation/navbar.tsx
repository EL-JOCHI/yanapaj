import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useAuth } from "@/context/auth-context.tsx";
import { NotificationContext } from "@/context/notification-context.tsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    notificationCount,
    notifications,
    clearNotifications,
    toggleNotifications, // <-- Added destructuring
    isNotificationsEnabled, // <-- Added destructuring
  } = useContext(NotificationContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  const handleSettings = () => {
    console.log("Clicked on Settings.")
  };

  return (
    <div className="w-full flex flex-row justify-between items-center p-4 font-insideout">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="p-4">
            <NavigationMenuLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-4">
            <NavigationMenuLink asChild>
              <Link to="/tasks">Tasks</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2 rounded-full relative">
              <BellIcon className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          {notificationCount > 0 && (
            <DropdownMenuContent className="w-72" onClick={clearNotifications} key={notificationCount}>
              <ul className="grid gap-2">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{notification.taskTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {notification.message}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </DropdownMenuItem>
                ))}
              </ul>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={toggleNotifications}> {/* <-- Add toggle button */}
              {isNotificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
            </DropdownMenuItem>
            <DropdownMenuSeparator /> {/* <-- Add a separator */}
            <DropdownMenuItem onClick={handleSettings}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator /> {/* <-- Add a separator */}
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
