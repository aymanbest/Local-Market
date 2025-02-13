import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Fetch pending applications
export const fetchPendingApplications = createAsyncThunk(
  'producerApplications/fetchPending',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}) => {
    const response = await api.get(`/api/producer-applications/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
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
    error: null,
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 10,
      isFirst: true,
      isLast: false
    },
    sorting: {
      sortBy: 'createdAt',
      direction: 'desc'
    }
  },
  reducers: {
    updateSorting: (state, action) => {
      state.sorting = action.payload;
    },
    updatePagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
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