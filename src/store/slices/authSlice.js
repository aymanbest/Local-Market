import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { submitApplication } from './producerApplicationSlice';

// Get current user data
const initializeState = async () => {
  try {
    const response = await api.get('/api/auth/me');
    const userData = response.data;
    
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
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
      status: 'idle',
      error: null
    };
  }
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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // First, make the login request
      await api.post('/api/auth/login', {
        email,
        password
      });
      
      // Then fetch the user data
      const response = await api.get('/api/auth/me');
      const userData = response.data;
      
      return {
        user: {
          id: userData.userId,
          email: userData.email,
          role: userData.role.toLowerCase(),
          firstName: userData.firstname,
          lastName: userData.lastname,
          username: userData.username,
          applicationStatus: userData.applicationStatus
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await api.post('/api/auth/logout');
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

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

