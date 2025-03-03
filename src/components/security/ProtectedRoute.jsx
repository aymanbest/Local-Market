import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector} from 'react-redux';

export const ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer',
  CUSTOMER: 'customer',
  GUEST: null
};

// Helper function to get default route based on user role
export const getDefaultRoute = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.PRODUCER:
      return '/producer/products';
    case ROLES.CUSTOMER:
    default:
      return '/';
  }
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, status, isAuthenticated } = useSelector(state => state.auth);
  
  // Show nothing while checking authentication
  if (status === 'loading') {
    return null;
  }

  // If authentication is required but user is not logged in
  if (allowedRoles.length > 0 && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user's role is not in allowed roles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Component to redirect authenticated users away from auth pages
export const RedirectIfAuthenticated = ({ children }) => {
  const { user, status, isAuthenticated } = useSelector(state => state.auth);
  
  // If authentication is still loading, show nothing
  if (status === 'loading') {
    return null;
  }

  // If user is authenticated, redirect to their default route
  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  // For failed or no authentication, just render the children (login/register pages)
  return children;
};

export default ProtectedRoute;

