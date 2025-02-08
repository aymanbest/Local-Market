import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { submitApplication } from './producerApplicationSlice';
import store from '../../store';
import { initializeWebSocket, disconnectWebSocket } from './notificationSlice';

// Get current user data
export const initializeState = async () => {
  try {
    const response = await api.get('/api/auth/me');
    const userData = response.data;
    
    if (userData) {
      store.dispatch(initializeWebSocket());
      return {
        user: {
          id: userData.userId,
          email: userData.email,
          role: userData.role.toLowerCase(),
          firstName: userData.firstname,
          lastName: userData.lastname,
          username: userData.username,
          applicationStatus: userData.applicationStatus
        },
        isAuthenticated: true,
        status: 'succeeded',
        error: null
      };
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
  }
  
  return {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null
  };
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      // First, make the login request
      const loginResponse = await api.post('/api/auth/login', {
        email,
        password
      });
      
      // Then fetch the user data
      const response = await api.get('/api/auth/me');
      const userData = response.data;
      
      if (userData) {
        const authData = {
          user: {
            id: userData.userId,
            email: userData.email,
            role: userData.role.toLowerCase(),
            firstName: userData.firstname,
            lastName: userData.lastname,
            username: userData.username,
            applicationStatus: userData.applicationStatus
          },
          isAuthenticated: true,
          status: 'succeeded',
          error: null
        };
        
        // Initialize WebSocket after getting user data but before returning
        await dispatch(initializeWebSocket());
        
        return authData;
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/auth/logout');
      // Disconnect WebSocket before clearing auth
      await dispatch(disconnectWebSocket());
      dispatch(clearAuth());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: await initializeState(),
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    setState: (state, action) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        // Don't set user here as they need to login after registration
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(submitApplication.fulfilled, (state) => {
        if (state.user) {
          state.user.applicationStatus = 'PENDING';
        }
      });
  }
});

export const { clearAuth, setState } = authSlice.actions;
export default authSlice.reducer;

