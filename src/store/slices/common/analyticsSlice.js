import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Thunk for fetching business metrics
export const fetchBusinessMetrics = createAsyncThunk(
  'analytics/fetchBusinessMetrics',
  async ({ startDate, endDate }, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/api/analytics/business-metrics', {
        params: { startDate, endDate }
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
      const response = await api.get('/api/analytics/transactions', {
        params: { startDate, endDate }
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
      const response = await api.get('/api/analytics/users', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user analytics');
    }
  }
);

export const fetchProducerOverview = createAsyncThunk(
  'analytics/fetchProducerOverview',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/api/analytics/overview');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overview');
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  'analytics/fetchOrderStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const [total, processing, pending, delivered] = await Promise.all([
        api.get('/api/analytics/total-orders'),
        api.get('/api/analytics/total-processing-orders'),
        api.get('/api/analytics/total-pending-orders'),
        api.get('/api/analytics/total-delivered-orders')
      ]);


      return {
        total: total.data,
        processing: processing.data,
        pending: pending.data,
        delivered: delivered.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order stats');
    }
  }
);

// Thunk for exporting analytics data
export const exportAnalytics = createAsyncThunk(
  'analytics/exportAnalytics',
  async ({ startDate, endDate, format }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/analytics/export', {
        params: { startDate, endDate, format },
        responseType: 'blob'  // Important for handling file downloads
      });
      
      // Format the date for the filename
      const date = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const formattedDate = `${monthNames[date.getMonth()]}${date.getDate()}_${date.getFullYear()}`;
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_export_${formattedDate}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export analytics');
    }
  }
);

export const fetchOrderStatistics = createAsyncThunk(
  'analytics/fetchOrderStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/analytics/order-statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order statistics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    businessMetrics: null,
    transactions: null,
    userAnalytics: null,
    overview: null,
    orderStats: null,
    loading: false,
    error: null,
    orderStatistics: {
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      deliveredOrders: 0
    }
  },
  reducers: {
    clearAnalytics: (state) => {
      state.businessMetrics = null;
      state.transactions = null;
      state.userAnalytics = null;
      state.overview = null;
      state.orderStats = null;
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
      })
      .addCase(fetchProducerOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducerOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchProducerOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatistics = action.payload;
      })
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer; 