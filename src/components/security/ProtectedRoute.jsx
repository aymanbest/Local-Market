import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeState } from '../../store/slices/auth/authSlice';

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

