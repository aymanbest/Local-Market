import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export const submitApplication = createAsyncThunk(
  'producerApplication/submit',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const response = await api.post('/api/producer-applications', applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const producerApplicationSlice = createSlice({
  name: 'producerApplication',
  initialState: {
    application: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetApplication: (state) => {
      state.application = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload;
        state.success = true;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetApplication } = producerApplicationSlice.actions;
export default producerApplicationSlice.reducer; 