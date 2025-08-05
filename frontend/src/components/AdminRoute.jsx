import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // If still loading, you could return a loading spinner here
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  // If authenticated and admin, render the protected component
  return children;
}

export default AdminRoute;