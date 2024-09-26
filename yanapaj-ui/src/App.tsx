import "./App.css";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/auth-context.tsx";
import AppContent from "@/components/core/app-content.tsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="yapanaj-theme">
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
