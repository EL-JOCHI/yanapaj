import './App.css'
import {ThemeProvider} from "@/components/theme/theme-provider.tsx";
import {ModeToggle} from "@/components/theme/mode-toggle.tsx";
import Login from "@/components/login/login.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "@/components/login/register.tsx";
import Dashboard from "@/components/tasks/dashboard.tsx";
import ProtectedRoute from "@/components/login/protected-route.tsx";


function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div className="flex flex-col items-center min-h-screen">
                    <div className="fixed top-4 right-4 z-50">
                        <ModeToggle/>
                    </div>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route element={<ProtectedRoute/>}>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                        </Route>
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App
