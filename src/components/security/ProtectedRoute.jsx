import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeState } from '../../store/slices/auth/authSlice';

export const ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer',
  CUSTOMER: 'customer',
  GUEST: null
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(initializeState());
    }
  }, [dispatch, status]);

  // Show nothing while checking authentication
  if (status === 'loading') {
    return null;
  }

  // If authentication is required but user is not logged in
  if (allowedRoles.length > 0 && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user's role is not in allowed roles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

