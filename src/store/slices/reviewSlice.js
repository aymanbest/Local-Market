import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Check if user can review a product
export const checkReviewEligibility = createAsyncThunk(
  'reviews/checkEligibility',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(`/api/reviews/eligibility/${productId}`);
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
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get('/api/reviews');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New thunks for admin review management
export const fetchPendingReviews = createAsyncThunk(
  'reviews/fetchPending',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/api/reviews/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
    success: false
  },
  reducers: {
    resetReviewState: (state) => {
      state.eligibility = null;
      state.loading = false;
      state.error = null;
      state.success = false;
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
        state.userReviews = action.payload;
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
        state.pendingReviews = action.payload;
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

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer; 