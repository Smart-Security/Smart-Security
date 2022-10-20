import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.hook";

/**
 * Component that assures the is logged in, else the user is redirected to the login page.
 * @param {*} children componet to show if the user is logged in
 * @returns 
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;