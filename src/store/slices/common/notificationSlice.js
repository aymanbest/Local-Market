import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

let wsConnection = null;

// Async thunks for API calls
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 0, size = 10, sort = 'timestamp,desc' }) => {
    const response = await api.get(`/api/notifications?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    await api.post(`/api/notifications/${notificationId}/mark-read`);
    return notificationId;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await api.post('/api/notifications/mark-read');
    return true;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId) => {
    await api.delete(`/api/notifications/${notificationId}`);
    return notificationId;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  }
);

export const initializeWebSocket = createAsyncThunk(
  'notifications/initializeWebSocket',
  async (_, { getState, dispatch }) => {
    // If there's an existing open connection, reuse it
    if (wsConnection?.readyState === WebSocket.OPEN) {
      return true;
    }

    // If connection is connecting, just return
    if (wsConnection?.readyState === WebSocket.CONNECTING) {
      return false;
    }

    // Clean up any existing connection
    if (wsConnection) {
      wsConnection.onopen = null;
      wsConnection.onmessage = null;
      wsConnection.onclose = null;
      wsConnection.onerror = null;
      wsConnection.close();
      wsConnection = null;
    }

    let reconnectAttempt = 0;
    const maxReconnectAttempts = 5;
    const baseDelay = 2000; // 2 seconds

    const connect = () => {
      wsConnection = new WebSocket(`ws://localhost:8080/ws`);

      wsConnection.onopen = () => {
        console.log('WebSocket Connected!');
        dispatch(setConnected(true));
        reconnectAttempt = 0; // Reset attempt counter on successful connection
      };

      wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          console.log('Received notification:', data);
          
          // Handle heartbeat
          if (data.type === 'heartbeat') {
            wsConnection.send(JSON.stringify({ type: 'heartbeat', message: 'pong' }));
            return;
          }
          
          // Add the new notification directly to the state
          dispatch(addWebSocketNotification(data));
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      wsConnection.onclose = (event) => {
        console.log(`WebSocket connection closed with code: ${event.code}`);
        dispatch(setConnected(false));
        
        // Don't reconnect if:
        // 1. It was a normal closure (1000)
        // 2. Authentication failed (4001)
        // 3. Maximum reconnection attempts reached
        // 4. User is no longer authenticated
        const state = getState();
        if (event.code !== 1000 && 
            event.code !== 4001 && 
            reconnectAttempt < maxReconnectAttempts && 
            state.auth.isAuthenticated) {
          
          const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempt), 30000); // Max 30 seconds
          reconnectAttempt++;
          
          console.log(`Attempting to reconnect... Attempt ${reconnectAttempt} in ${delay}ms`);
          setTimeout(connect, delay);
        } else if (event.code === 4001) {
          // Handle authentication failure
          dispatch(setError('WebSocket authentication failed'));
          // Optionally trigger a re-authentication flow here
        }
      };

      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        dispatch(setError('WebSocket connection error'));
      };
    };

    connect();
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
    unreadCount: 0,
    loading: false,
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      hasMore: true
    }
  },
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addWebSocketNotification: (state, action) => {
      // Add the new notification at the beginning of the array
      state.notifications.unshift(action.payload);
      // Increment unread count
      state.unreadCount += 1;
      // Update pagination
      state.pagination.totalElements += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // If it's the first page, replace notifications
        // If it's a subsequent page, append new notifications
        state.notifications = action.payload.number === 0
          ? action.payload.content
          : [...state.notifications, ...action.payload.content];
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          hasMore: !action.payload.last
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(n => n.id === action.payload);
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        if (deletedNotification && !deletedNotification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  }
});

export const { 
  setConnected, 
  setError, 
  clearError,
  addWebSocketNotification 
} = notificationSlice.actions;

export default notificationSlice.reducer; 