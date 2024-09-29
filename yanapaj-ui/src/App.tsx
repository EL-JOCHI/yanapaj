import "./App.css";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/auth-context.tsx";
import AppContent from "@/components/core/app-content.tsx";
import NotificationProvider from "@/context/notification-context.tsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="yapanaj-theme">
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
          <Toaster />
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
