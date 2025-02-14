import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

// Check if user can review a product
export const checkReviewEligibility = createAsyncThunk(
  'reviews/checkEligibility',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(`/api/reviews/eligibility/${productId}`);
      console.log("response review eligibility",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Submit a review
export const submitReview = createAsyncThunk(
  'reviews/submit',
  async (reviewData, { rejectWithValue, getState }) => {
    try {
      const response = await api.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user's reviews
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ page = 0, size = 4, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/api/reviews?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// for admin review management
export const fetchPendingReviews = createAsyncThunk(
  'reviews/fetchPending',
  async ({ page = 0, size = 10, sortBy = 'createdAt', direction = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews/pending?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const approveReview = createAsyncThunk(
  'reviews/approve',
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/api/reviews/${reviewId}/approve`, {});
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const declineReview = createAsyncThunk(
  'reviews/decline',
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/api/reviews/${reviewId}/decline`, {});
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    eligibility: null,
    userReviews: [],
    pendingReviews: [],
    loading: false,
    error: null,
    success: false,
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
    resetReviewState: (state) => {
      state.eligibility = null;
      state.loading = false;
      state.error = null;
      state.success = false;
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
      // Check eligibility cases
      .addCase(checkReviewEligibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkReviewEligibility.fulfilled, (state, action) => {
        state.loading = false;
        state.eligibility = action.payload;
      })
      .addCase(checkReviewEligibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit review cases
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userReviews.push(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user reviews cases
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add new cases for admin review management
      .addCase(fetchPendingReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReviews = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          pageSize: action.payload.size,
          isFirst: action.payload.first,
          isLast: action.payload.last
        };
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        state.pendingReviews = state.pendingReviews.filter(
          review => review.reviewId !== action.payload.reviewId
        );
      })
      .addCase(declineReview.fulfilled, (state, action) => {
        state.pendingReviews = state.pendingReviews.filter(
          review => review.reviewId !== action.payload.reviewId
        );
      });
  }
});

export const { resetReviewState, updateSorting, updatePagination } = reviewSlice.actions;
export default reviewSlice.reducer; 