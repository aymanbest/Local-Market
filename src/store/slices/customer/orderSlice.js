import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Update the validation function at the top
const isValidStatusTransition = (currentStatus, newStatus) => {
  const transitions = {
    'PENDING_PAYMENT': [], // No manual transitions allowed
    'PAYMENT_FAILED': [], // No manual transitions allowed
    'PAYMENT_COMPLETED': ['PROCESSING'],
    'PROCESSING': ['SHIPPED', 'CANCELLED'],
    'SHIPPED': ['DELIVERED'],
    'DELIVERED': ['RETURNED'],
    'CANCELLED': [], // No further transitions
    'RETURNED': [] // No further transitions
  };

  return transitions[currentStatus]?.includes(newStatus) || false;
};

// Fetch producer orders
export const fetchProducerOrders = createAsyncThunk(
  'orders/fetchProducerOrders',
  async ({ page = 0, size = 10, sortBy = 'orderDate', direction = 'desc', customerEmail = '' } = {}) => {
    const response = await api.get(
      `/api/orders/producer-orders?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}${customerEmail ? `&customerEmail=${customerEmail}` : ''}`
    );
    return response.data;
  }
);

// Fetch orders by status
export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchByStatus',
  async ({ status, page = 0, size = 10, sortBy = 'orderDate', direction = 'desc', customerEmail = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/orders/producer-orders/status/${status}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}${customerEmail ? `&customerEmail=${customerEmail}` : ''}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, newStatus, currentStatus }, { rejectWithValue }) => {
    try {
      if (!isValidStatusTransition(currentStatus, newStatus)) {
        throw new Error('Invalid status transition');
      }

      const response = await api.put(`/api/orders/${orderId}/status?status=${newStatus}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
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
    sortBy: 'orderDate',
    direction: 'desc'
  },
  filteredOrders: [],
  status: 'idle',
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
      let result = [...state.orders];

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
    },
    updateSorting: (state, action) => {
      state.sorting = action.payload;
    },
    updatePagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    updateSingleOrder: (state, action) => {
      const updatedOrder = action.payload;
      const index = state.orders.findIndex(order => order.orderId === updatedOrder.orderId);
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
        state.filteredOrders = action.payload.content;
        
        // Update stats with correct status values
        state.stats = {
          total: action.payload.totalElements,
          pending: action.payload.content.filter(o => 
            o.status === 'PENDING_PAYMENT' || 
            o.status === 'PAYMENT_COMPLETED'
          ).length,
          processing: action.payload.content.filter(o => 
            o.status === 'PROCESSING' || 
            o.status === 'SHIPPED'
          ).length,
          delivered: action.payload.content.filter(o => o.status === 'DELIVERED').length
        };
      })
      .addCase(fetchProducerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map(order => 
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        );
        state.filteredOrders = state.filteredOrders.map(order => 
          order.orderId === updatedOrder.orderId ? updatedOrder : order
        );
      })
      // Add cases for fetchOrdersByStatus
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
        state.filteredOrders = action.payload.content;
        
        // Update stats for filtered status
        state.stats = {
          total: action.payload.totalElements,
          pending: action.payload.content.filter(o => 
            o.status === 'PENDING_PAYMENT' || 
            o.status === 'PAYMENT_COMPLETED'
          ).length,
          processing: action.payload.content.filter(o => 
            o.status === 'PROCESSING' || 
            o.status === 'SHIPPED'
          ).length,
          delivered: action.payload.content.filter(o => o.status === 'DELIVERED').length
        };
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { filterOrders, updateSorting, updatePagination, updateSingleOrder } = orderSlice.actions;
export default orderSlice.reducer; 