import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export const fetchMyProducts = createAsyncThunk(
  'producerProducts/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/products/my-products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'producerProducts/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all product data to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'categoryIds' && Array.isArray(productData[key])) {
          formData.append(key, productData[key].join(','));
        } else if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'producerProducts/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all product data to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'categoryIds' && Array.isArray(productData[key])) {
          formData.append(key, productData[key].join(','));
        } else if (key === 'image' && productData[key]) {
          formData.append('image', productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.put(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'producerProducts/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  createProductStatus: 'idle',
  updateProductStatus: 'idle',
};

const producerProductsSlice = createSlice({
  name: 'producerProducts',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createProductStatus = 'idle';
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.updateProductStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Products
      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.createProductStatus = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createProductStatus = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createProductStatus = 'failed';
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.updateProductStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateProductStatus = 'succeeded';
        const index = state.products.findIndex(p => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductStatus = 'failed';
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.productId !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreateStatus, resetUpdateStatus } = producerProductsSlice.actions;

export default producerProductsSlice.reducer; 