import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { isRouteAllowed } from '../../utils/roleUtils.js';

function ProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-primary)',
        fontSize: '1.25rem',
        fontWeight: '600'
      }}>
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Verify route permissions
  if (user && !isRouteAllowed(user.role, location.pathname)) {
    console.warn(`Unauthorized access attempt to ${location.pathname} by role ${user.role}. Redirecting to /dashboard.`);
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;


