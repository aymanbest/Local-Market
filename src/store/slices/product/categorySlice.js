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

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/categories', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ categoryId, purge = false }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${categoryId}${purge ? '?purge=true' : ''}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to delete category',
        code: error.response?.data?.code
      });
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
    },
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    resetStatus: (state) => {
      state.createStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
      state.error = null;
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
      })
      .addCase(createCategory.pending, (state) => {
        state.createStatus = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.categories.findIndex(cat => cat.categoryId === action.payload.categoryId);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.categories = state.categories.filter(cat => cat.categoryId !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setSelectedProduct, resetStatus } = categorySlice.actions;
export default categorySlice.reducer; 