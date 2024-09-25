import './App.css'
import {ThemeProvider} from "@/components/theme/theme-provider.tsx";
import {ModeToggle} from "@/components/theme/mode-toggle.tsx";

function App() {

  return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="flex flex-col items-center min-h-screen">
              <div className="fixed top-4 right-4 z-50">
                  <ModeToggle/>
              </div>
          </div>
      </ThemeProvider>
)
}

export default App
