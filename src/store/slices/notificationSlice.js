import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

let wsConnection = null;

export const initializeWebSocket = createAsyncThunk(
  'notifications/initializeWebSocket',
  async (_, { getState, dispatch }) => {
    const state = getState();
    
    // If there's an existing open connection, reuse it
    if (wsConnection?.readyState === WebSocket.OPEN) {
      console.log('Reusing existing WebSocket connection');
      return true;
    }

    // If connection is connecting, wait for it
    if (wsConnection?.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket is already connecting');
      return new Promise((resolve) => {
        wsConnection.onopen = () => {
          console.log('WebSocket Connected!');
          dispatch(setConnected(true));
          resolve(true);
        };
      });
    }

    try {
      return new Promise((resolve, reject) => {
        console.log('Creating new WebSocket connection');
        wsConnection = new WebSocket(`ws://localhost:8080/ws`);

        wsConnection.onopen = () => {
          console.log('WebSocket Connected!');
          dispatch(setConnected(true));
          resolve(true);
        };

        wsConnection.onmessage = (event) => {
          try {
            const notification = JSON.parse(event.data);
            console.log('Received notification:', notification);
            dispatch(addNotification(notification));
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };

        wsConnection.onclose = (event) => {
          console.log('WebSocket connection closed', event.code, event.reason);
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
          console.error('WebSocket error:', error);
          dispatch(setError('WebSocket connection error'));
          reject(error);
        };
      });
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      throw error;
    }
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'notifications/disconnect',
  async () => {
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
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