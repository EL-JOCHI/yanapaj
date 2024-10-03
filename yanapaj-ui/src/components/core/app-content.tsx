import { useAuth } from "@/context/auth-context.tsx";
import Navbar from "@/components/core/navigation/navbar.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/components/login/login.tsx";
import Register from "@/components/login/register.tsx";
import Dashboard from "@/components/dashboard/dashboard.tsx";
import ProtectedRoute from "@/components/login/protected-route.tsx";
import TaskView from "@/components/tasks/task-view.tsx";

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/tasks" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/tasks" /> : <Register />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskView />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppContent;
