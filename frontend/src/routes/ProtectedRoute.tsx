import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { loading, token } = useAuth();

  if (loading) {
    return <Spinner label="Restoring session" />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
