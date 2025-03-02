import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeState } from '../../store/slices/auth/authSlice';

const AuthPersistence = () => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    // Only check once per app session and only if not already checking or checked
    if (!hasInitialized.current && status !== 'loading' && status !== 'succeeded') {
      hasInitialized.current = true;
      dispatch(initializeState());
    }
  }, [dispatch, status]);
  
  // This component doesn't render anything
  return null;
};

export default AuthPersistence; 