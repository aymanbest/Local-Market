import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 0, size = 4, sortBy = 'createdAt', direction = 'desc' } = {}) => {
    const response = await api.get(`/api/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: {
      products: []
    },
    status: 'idle',
    error: null,
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 4,
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
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Transform the data structure to match what the component expects
        const allProducts = action.payload.content.flatMap(producer => {
          return producer.products.map(product => ({
            ...product,
            producer: producer.username,
            producerName: `${producer.firstname} ${producer.lastname}`
          }));
        });
        state.items = { products: allProducts };
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;

