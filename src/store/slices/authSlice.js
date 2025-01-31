import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { submitApplication } from './producerApplicationSlice';

export const initializeAuthFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role.toLowerCase(),
        firstName: payload.firstname,
        lastName: payload.lastname,
        username: payload.username,
        applicationStatus: payload.applicationStatus
      },
      token,
      isAuthenticated: true
    };
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
}; 

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      
      const { token, status } = response.data;
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role.toLowerCase(),
          firstName: payload.firstname,
          lastName: payload.lastname,
          username: payload.username,
          applicationStatus: payload.applicationStatus
        },
        token,
        status
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await api.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initializeAuthFromToken() || {
      user: null,
      token: null,
      status: 'idle',
      error: null,
      isAuthenticated: false
    }
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = action.payload;
        localStorage.removeItem('token');
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        if (state.user) {
          state.user.applicationStatus = 'PENDING';
        }
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

