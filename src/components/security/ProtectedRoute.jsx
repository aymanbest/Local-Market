import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeState } from '../../store/slices/auth/authSlice';

export const GuestRoute = ({ children }) => {
  const { user, status } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(() => {
    // Only initialize if we're not on login/register pages
    if (status === 'idle' && 
        !location.pathname.includes('login') && 
        !location.pathname.includes('register')) {
      dispatch(initializeState());
    }
  }, [dispatch, status, location]);

  if (status === 'loading') {
    return null;
  }

  if (user) {
    // If user is already logged in, redirect to appropriate dashboard or home
    if (user.role === 'admin') {
      return <Navigate to="/admin/users" replace />;
    } else if (user.role === 'producer') {
      return <Navigate to="/producer/products" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const ProtectedRoute = ({ children, adminOnly = false, producerOnly = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(initializeState());
    }
  }, [dispatch, status]);

  if (status === 'loading' || status === 'idle') {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  if (producerOnly && user.role !== 'producer') {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

