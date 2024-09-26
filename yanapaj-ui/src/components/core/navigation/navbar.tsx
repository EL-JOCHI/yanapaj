import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useAuth } from "@/context/auth-context.tsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Alert Dialog",
      href: "/docs/primitives/alert-dialog",
      description: "A modal dialog that interrupts the user.",
    },
    {
      title: "Hover Card",
      href: "/docs/primitives/hover-card",
      description:
        "For sighted users to preview content available behind a link.",
    },
  ];

  const handleSettings = () => {
    setNotificationCount(notificationCount + 1);

    //here may be recieved the notification and be pushed here, or i dont know how we would handle this logic.
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
            <DropdownMenuContent className="w-72">
              <ul className="grid">
                {components.map((component) => (
                  <DropdownMenuItem key={component.title}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{component.title} </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {component.description}
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
            <DropdownMenuItem onClick={handleSettings}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
