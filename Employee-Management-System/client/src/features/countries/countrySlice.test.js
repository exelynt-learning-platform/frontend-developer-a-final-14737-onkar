import { configureStore } from '@reduxjs/toolkit';
import countryReducer, { fetchCountries } from './countrySlice';
import countryService from '../../services/countryService';

jest.mock('../../services/countryService');

const makeStore = () => configureStore({ reducer: { countries: countryReducer } });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('countrySlice', () => {
  test('returns the expected initial state', () => {
    const store = makeStore();
    const state = store.getState().countries;
    expect(state.items).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  test('fetchCountries pending -> loading, fulfilled -> succeeded with items', async () => {
    const countries = [{ id: '1', name: 'India' }];
    countryService.getCountries.mockResolvedValueOnce(countries);
    const store = makeStore();

    const promise = store.dispatch(fetchCountries());
    expect(store.getState().countries.status).toBe('loading');

    await promise;
    const state = store.getState().countries;
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(countries);
  });

  test('fetchCountries rejected -> failed with an error message', async () => {
    countryService.getCountries.mockRejectedValueOnce(new Error('Unable to load countries. Please try again.'));
    const store = makeStore();

    await store.dispatch(fetchCountries());
    const state = store.getState().countries;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Unable to load countries. Please try again.');
  });
});
