import { createContext, useContext, useState, useEffect } from "react";

const ADMIN_EMAIL = "admin@agrimart.com";
const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "agrimart_admin_logged_in";

const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore admin login state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored === "true") {
        setIsAdminLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to restore admin session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, "true");
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminContextProvider");
  return ctx;
};
