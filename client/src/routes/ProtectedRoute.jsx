import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;  // You can replace this with a more fancy loading indicator
  }
  
  console.log(role);
  console.log(isAuthenticated);
  if (!isAuthenticated()) {
    console.log("not authenticated")
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    console.log("not fit for role")
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
