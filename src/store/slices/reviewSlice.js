import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Check if user can review a product
export const checkReviewEligibility = createAsyncThunk(
  'reviews/checkEligibility',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await api.get(`/api/reviews/eligibility/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = getState().auth.token;
      const response = await api.post('/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const response = await api.get('/api/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      });
  }
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer; 