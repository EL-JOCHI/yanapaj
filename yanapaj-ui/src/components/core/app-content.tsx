import { useAuth } from "@/context/auth-context.tsx";
import Navbar from "@/components/core/navigation/navbar.tsx";
import { Route, Routes } from "react-router-dom";
import Login from "@/components/login/login.tsx";
import Register from "@/components/login/register.tsx";
import Dashboard from "@/components/tasks/dashboard.tsx";
import ProtectedRoute from "@/components/login/protected-route.tsx";

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppContent;
