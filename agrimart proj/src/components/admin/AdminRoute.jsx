import { Navigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";

const AdminRoute = ({ children }) => {
  const { isAdminLoggedIn, isLoading } = useAdmin();

  // Wait for session to be restored from localStorage
  if (isLoading) {
    return null;
  }

  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
