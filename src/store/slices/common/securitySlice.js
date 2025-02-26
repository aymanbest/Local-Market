import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';
import { clearAuth } from '../auth/authSlice';
import { disconnectWebSocket } from './notificationSlice';

export const changePassword = createAsyncThunk(
  'security/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/users/change-password', 
        {
          oldPassword,
          newPassword,
        }
      );
      
      // Clear all states after successful password change
      dispatch(disconnectWebSocket());
      dispatch(clearAuth());
      dispatch({ type: 'producerApplications/clearState' });
      dispatch({ type: 'categories/clearState' });
      dispatch({ type: 'address/clearState' });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetStatus } = securitySlice.actions;
export default securitySlice.reducer; 