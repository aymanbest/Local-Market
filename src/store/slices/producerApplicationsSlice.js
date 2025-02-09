import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Fetch pending applications
export const fetchPendingApplications = createAsyncThunk(
  'producerApplications/fetchPending',
  async (_, { getState }) => {
    const response = await api.get('/api/producer-applications/pending');
    return response.data;
  }
);

// Approve application
export const approveApplication = createAsyncThunk(
  'producerApplications/approve',
  async ({ applicationId, approveCC }, { getState }) => {
    const response = await api.post(
      `/api/producer-applications/${applicationId}/approve${approveCC !== undefined ? `?approveCC=${approveCC}` : ''}`,
        {}
    );
    return { applicationId, data: response.data };
  }
);

// Decline application
export const declineApplication = createAsyncThunk(
  'producerApplications/decline',
  async ({ applicationId, reason }, { getState }) => {
    const response = await api.post(
      `/api/producer-applications/${applicationId}/decline`,
      { reason }
    );
    return { applicationId, data: response.data };
  }

);

const producerApplicationsSlice = createSlice({
  name: 'producerApplications',
  initialState: {
    applications: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(approveApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          app => app.applicationId !== action.payload.applicationId
        );
      })
      .addCase(declineApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          app => app.applicationId !== action.payload.applicationId
        );
      });
  }
});

export default producerApplicationsSlice.reducer; 