import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initializeState, clearAuth } from '../../store/slices/auth/authSlice';

const AuthPersistence = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isAuthenticated, user } = useSelector(state => state.auth);
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    // Only check once per app session and only if not already checking
    if (!hasInitialized.current && status !== 'loading') {
      hasInitialized.current = true;
      
      // handle authentication validation
      dispatch(initializeState())
        .unwrap()
        .then(result => {
          // If the result shows we were previously authenticated but now we're not,
          // it means the session expired
          if (!result.isAuthenticated && isAuthenticated) {
            navigate('/login', { 
              state: { message: 'Your session has expired. Please log in again.' }
            });
          }
        })
        .catch(error => {
          // If there's an error during initialization, clear auth and redirect
          dispatch(clearAuth());
          navigate('/login', { 
            state: { message: 'Authentication error. Please log in again.' }
          });
        });
    }
  }, [dispatch, status, isAuthenticated, navigate]);
  
  // this component doesn't render
  return null;
};

export default AuthPersistence; 