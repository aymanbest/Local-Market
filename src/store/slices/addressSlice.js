import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const GEONAMES_API = 'http://api.geonames.org/searchJSON';
const GEONAMES_USERNAME = 'haste';

export const searchCities = createAsyncThunk(
  'address/searchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${GEONAMES_API}?country=MA&featureClass=P&maxRows=10&username=${GEONAMES_USERNAME}`
      );
      const data = await response.json();
      
      return data.geonames.map(city => ({
        name: city.name,
        adminName1: city.adminName1, // Region/State
        population: city.population
      }));
    } catch (error) {
      return rejectWithValue('Failed to fetch cities');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    cities: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cities = [];
      });
  }
});

export default addressSlice.reducer; 