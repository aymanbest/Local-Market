import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await api.get('/api/categories');
    return response.data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'categories/fetchProductsByCategory',
  async ({ categoryId, page = 0, size = 4, sortBy = 'name', direction = 'desc' }) => {
    const response = await api.get(`/api/products/category/${categoryId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'categories/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
      }
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategoryProducts: null,
    selectedProduct: null,
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
      sortBy: 'name',
      direction: 'desc'
    }
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const allProducts = action.payload.content.flatMap(producer => {
          return producer.products.map(product => ({
            ...product,
            producer: producer.username,
            producerName: `${producer.firstname} ${producer.lastname}`
          }));
        });
        state.currentCategoryProducts = allProducts;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  }
});

export const { setSelectedProduct } = categorySlice.actions;
export default categorySlice.reducer; 