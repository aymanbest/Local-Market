import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Fetch application status
export const fetchApplicationStatus = createAsyncThunk(
  'producerApplications/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/producer-applications/status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Submit new application
export const submitApplication = createAsyncThunk(
  'producerApplications/submit',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/producer-applications', applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch pending applications
export const fetchPendingApplications = createAsyncThunk(
  'producerApplications/fetchPending',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/producer-applications/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Approve application
export const approveApplication = createAsyncThunk(
  'producerApplications/approve',
  async ({ applicationId, approveCC }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/producer-applications/${applicationId}/approve${approveCC !== undefined ? `?approveCC=${approveCC}` : ''}`,
        {}
      );
      return { applicationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Decline application
export const declineApplication = createAsyncThunk(
  'producerApplications/decline',
  async ({ applicationId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/producer-applications/${applicationId}/decline`,
        { reason }
      );
      return { applicationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const producerApplicationsSlice = createSlice({
  name: 'producerApplications',
  initialState: {
    // Admin view state
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
    },
    // User application state
    currentApplication: null,
    applicationStatus: null,
    loading: false,
    submitSuccess: false
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
    },
    resetApplication: (state) => {
      state.currentApplication = null;
      state.loading = false;
      state.error = null;
      state.submitSuccess = false;
    },
    clearState: () => ({
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
      },
      currentApplication: null,
      applicationStatus: null,
      loading: false,
      submitSuccess: false
    })
  },
  extraReducers: (builder) => {
    builder
      // Fetch Status
      .addCase(fetchApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationStatus = action.payload;
        state.error = null;
      })
      .addCase(fetchApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Application
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
        state.submitSuccess = true;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Pending Applications
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
      // Approve Application
      .addCase(approveApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          app => app.applicationId !== action.payload.applicationId
        );
      })
      // Decline Application
      .addCase(declineApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          app => app.applicationId !== action.payload.applicationId
        );
      });
  }
});

export const { updateSorting, updatePagination, resetApplication, clearState } = producerApplicationsSlice.actions;
export default producerApplicationsSlice.reducer; 