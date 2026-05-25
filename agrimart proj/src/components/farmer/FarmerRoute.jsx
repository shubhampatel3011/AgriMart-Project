import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";

export const FarmerRoute = ({ children }) => {
  const { farmer, loading } = useContext(FarmerContext);

  // Wait for session to be restored from localStorage
  if (loading) {
    return null;
  }

  if (!farmer) {
    return <Navigate to="/farmer/login" replace />;
  }

  return children;
};

export default FarmerRoute;
