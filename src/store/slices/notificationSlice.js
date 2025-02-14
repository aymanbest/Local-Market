import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

let wsConnection = null;

export const initializeWebSocket = createAsyncThunk(
  'notifications/initializeWebSocket',
  async (_, { getState, dispatch }) => {
    const state = getState();
    
    // If there's an existing open connection, reuse it
    if (wsConnection?.readyState === WebSocket.OPEN) {
      return true;
    }

    // If connection is connecting, just return
    if (wsConnection?.readyState === WebSocket.CONNECTING) {
      return false;
    }

    wsConnection = new WebSocket(`ws://localhost:8080/ws`);

    wsConnection.onopen = () => {
      console.log('WebSocket Connected!');
      dispatch(setConnected(true));
    };

    wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle heartbeat
        if (data.type === 'heartbeat') {
          // console.log('Received heartbeat');
          wsConnection.send(JSON.stringify({ type: 'heartbeat', message: 'pong' }));
          return;
        }
        
        dispatch(addNotification(data));
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    wsConnection.onclose = (event) => {
      console.log('WebSocket connection closed');
      dispatch(setConnected(false));
      
      // Attempt to reconnect if the connection was closed unexpectedly
      // and user is still authenticated
      if (event.code !== 1000) { // 1000 is normal closure
        const state = getState();
        if (state.auth.isAuthenticated) {
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            dispatch(initializeWebSocket());
          }, 5000);
        }
      }
    };

    wsConnection.onerror = (error) => {
      dispatch(setError('WebSocket connection error'));
    };

    // Return immediately, don't wait for connection
    return false;
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'notifications/disconnect',
  async (_, { dispatch }) => {
    if (wsConnection) {
      // Remove all event listeners to prevent any callbacks
      wsConnection.onopen = null;
      wsConnection.onmessage = null;
      wsConnection.onclose = null;
      wsConnection.onerror = null;
      wsConnection.close();


      // Close the connection if it's open or connecting
      if (wsConnection.readyState === WebSocket.OPEN || 
          wsConnection.readyState === WebSocket.CONNECTING) {
        wsConnection.close(1000, 'User logged out');
      }
      
      wsConnection = null;
      dispatch(setConnected(false));
      dispatch(clearError());
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    isConnected: false,
    error: null,
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  setConnected, 
  setError, 
  clearError 
} = notificationSlice.actions;

export default notificationSlice.reducer; 