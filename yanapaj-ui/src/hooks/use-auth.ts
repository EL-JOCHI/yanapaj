import { useState, useEffect } from "react";
export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return { isLoggedIn, logout };
};
