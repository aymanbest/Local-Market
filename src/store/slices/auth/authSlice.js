import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';
import { submitApplication } from '../producer/producerApplicationsSlice';
import { initializeWebSocket, disconnectWebSocket } from '../common/notificationSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
};

// Get current user data
export const initializeState = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    try {
      const response = await api.get('/api/auth/me', {
        headers: {
          'x-auth-check': 'true'
        }
      });
      const userData = response.data;
      
      if (userData) {
        await dispatch(initializeWebSocket());
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
      // For auth check failures, just return unauthenticated state without error
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          user: null,
          isAuthenticated: false,
          status: 'succeeded', // Mark as succeeded but not authenticated
          error: null
        };
      }
      throw error; // Let the rejection handler deal with other errors
    }
    // No user data case
    return {
      user: null,
      isAuthenticated: false,
      status: 'succeeded', // Mark as succeeded but not authenticated
      error: null
    };
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Only include role in the request if it's provided (admin registration)
      const requestBody = {
        username: userData.username,
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        password: userData.password,
        ...(userData.role && { role: userData.role }) // Only include role if it exists
      };
      
      const response = await api.post('/api/auth/register', requestBody);
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
      await api.post('/api/auth/login', {
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
      // Extract the error message from the response
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.code === 'AUTHENTICATION_FAILED' ? 
                           'Invalid email or password' : 'Login failed');
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // First disconnect WebSocket and clear any pending reconnections
      await dispatch(disconnectWebSocket());
      
      // Clear all related states before making the logout request
      dispatch(clearAuth());
      dispatch({ type: 'producerApplications/clearState' });
      dispatch({ type: 'categories/clearState' });
      dispatch({ type: 'address/clearState' });

      // Then perform the actual logout
      await api.post('/api/auth/logout');
      
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setState: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearAuth: () => ({
      ...initialState,
      status: 'idle'
    }),
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
      })
      .addCase(initializeState.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeState.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(initializeState.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setState, clearAuth } = authSlice.actions;
export default authSlice.reducer;

