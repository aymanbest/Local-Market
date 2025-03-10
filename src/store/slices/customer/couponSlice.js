import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Async thunks
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async ({ page = 0, size = 10, sortBy = 'validFrom', direction = 'desc' } = {}) => {
    const response = await api.get(`/api/coupons?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
    return response.data;
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/coupons', couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/coupons/${couponId}`, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/coupons/${couponId}`);
      return couponId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon');
    }
  }
);

// Add new thunk for status update
export const updateCouponStatus = createAsyncThunk(
  'coupons/updateStatus',
  async ({ couponId, isActive }, { rejectWithValue }) => {
    try {
      await api.patch(`/api/coupons/${couponId}/status?isActive=${isActive}`);
      return { couponId, isActive };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update coupon status');
    }
  }
);

const initialState = {
  coupons: [],
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
    sortBy: 'createdAt',
    direction: 'desc'
  },
  selectedCoupon: null
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
    },
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    },
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
      // Fetch coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(coupon => coupon.couponId === action.payload.couponId);
        if (index !== -1) {
          state.coupons[index] = {
            ...state.coupons[index],
            ...action.payload
          };
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(coupon => coupon.couponId !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update coupon status
      .addCase(updateCouponStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCouponStatus.fulfilled, (state, action) => {
        state.loading = false;
        const coupon = state.coupons.find(c => c.couponId === action.payload.couponId);
        if (coupon) {
          coupon.isActive = action.payload.isActive;
        }
      })
      .addCase(updateCouponStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedCoupon, clearSelectedCoupon, updateSorting, updatePagination } = couponSlice.actions;
export default couponSlice.reducer; 