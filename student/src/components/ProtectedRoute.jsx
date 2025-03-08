import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner or placeholder while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-svh">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if the user isn't authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
