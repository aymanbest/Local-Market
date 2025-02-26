import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../lib/axios';

export const fetchRegions = createAsyncThunk(
  'address/fetchRegions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/regions');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch regions');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    regions: [],
    loading: false,
    error: null
  },
  reducers: {
    clearState: () => ({
      regions: [],
      loading: false,
      error: null
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.regions = action.payload;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.regions = [];
      });
  }
});

export default addressSlice.reducer; 