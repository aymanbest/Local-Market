import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeWebSocket } from '../../store/slices/common/notificationSlice';

const WebSocketInitializer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(initializeWebSocket());
    }
  }, [isAuthenticated, dispatch]);

  return null; // This is a utility component, it doesn't render anything
};

export default WebSocketInitializer; 