import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import countryService from '../../services/countryService';

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      return await countryService.getCountries();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load countries. Please try again.';
      });
  },
});

export const selectCountries = (state) => state.countries.items;
export const selectCountriesStatus = (state) => state.countries.status;
export const selectCountriesError = (state) => state.countries.error;

export default countrySlice.reducer;
