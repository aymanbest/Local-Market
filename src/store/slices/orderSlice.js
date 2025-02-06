import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Fetch producer orders
export const fetchProducerOrders = createAsyncThunk(
  'orders/fetchProducerOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/api/orders/producer-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Fetch orders by status
export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchByStatus',
  async (status, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/api/orders/producer-orders/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.put(`/api/orders/${orderId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const initialState = {
  items: [],
  filteredOrders: [],
  status: 'idle',
  error: null,
  stats: {
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    filterOrders: (state, action) => {
      const { searchTerm, filters } = action.payload;
      let result = [...state.items];

      if (searchTerm) {
        result = result.filter(order => 
          order.orderId.toString().includes(searchTerm) ||
          order.customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.status !== 'all') {
        result = result.filter(order => order.status === filters.status);
      }

      if (filters.minAmount) {
        result = result.filter(order => order.totalPrice >= Number(filters.minAmount));
      }

      if (filters.maxAmount) {
        result = result.filter(order => order.totalPrice <= Number(filters.maxAmount));
      }

      state.filteredOrders = result;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducerOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducerOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredOrders = action.payload;
        
        // Update stats with correct status values
        state.stats = {
          total: action.payload.length,
          pending: action.payload.filter(o => 
            o.status === 'PENDING_PAYMENT' || 
            o.status === 'PAYMENT_COMPLETED'
          ).length,
          processing: action.payload.filter(o => 
            o.status === 'PROCESSING' || 
            o.status === 'SHIPPED'
          ).length,
          delivered: action.payload.filter(o => o.status === 'DELIVERED').length
        };
      })
      .addCase(fetchProducerOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.items = state.items.map(order => 
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        );
        state.filteredOrders = state.filteredOrders.map(order => 
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        );
      });
  }
});

export const { filterOrders } = orderSlice.actions;
export default orderSlice.reducer; 