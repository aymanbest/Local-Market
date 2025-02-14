import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';


export const fetchPendingProducts = createAsyncThunk(
  'pendingProducts/fetchAll',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending products');
    }
  }
);

export const approveProduct = createAsyncThunk(
  'pendingProducts/approve',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/products/${productId}/approve`, 
        {});
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve product');
    }
  }
);

export const declineProduct = createAsyncThunk(
  'pendingProducts/decline',
  async ({ productId, reason }, { getState, rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/products/${productId}/decline`, 
        { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to decline product');
    }
  }
);

const initialState = {
  items: [],
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
};

const pendingProductsSlice = createSlice({
  name: 'pendingProducts',
  initialState,
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
      .addCase(fetchPendingProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.content;
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
      .addCase(fetchPendingProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(approveProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.items = state.items.map(producer => ({
          ...producer,
          products: producer.products.filter(p => p.productId !== productId)
        })).filter(producer => producer.products.length > 0);
      })
      .addCase(declineProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.items = state.items.map(producer => ({
          ...producer,
          products: producer.products.filter(p => p.productId !== productId)
        })).filter(producer => producer.products.length > 0);
      });
  }
});

export default pendingProductsSlice.reducer; 