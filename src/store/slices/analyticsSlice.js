import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Thunk for fetching business metrics
export const fetchBusinessMetrics = createAsyncThunk(
  'analytics/fetchBusinessMetrics',
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/api/analytics/business-metrics', {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch metrics');
    }
  }
);

// Thunk for fetching transaction data
export const fetchTransactionData = createAsyncThunk(
  'analytics/fetchTransactionData',
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/api/analytics/transactions', {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

// Thunk for fetching user analytics
export const fetchUserAnalytics = createAsyncThunk(
  'analytics/fetchUserAnalytics',
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/api/analytics/users', {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    businessMetrics: null,
    transactions: null,
    userAnalytics: null,
    loading: false,
    error: null
  },
  reducers: {
    clearAnalytics: (state) => {
      state.businessMetrics = null;
      state.transactions = null;
      state.userAnalytics = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Business Metrics
      .addCase(fetchBusinessMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.businessMetrics = action.payload;
      })
      .addCase(fetchBusinessMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Transaction Data
      .addCase(fetchTransactionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionData.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // User Analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer; 