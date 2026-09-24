import axios from 'axios';

// Base URL for the Employee Management mock API.
// Centralised here so every service shares one configured Axios instance
// instead of scattering axios.get/post calls across components.
export const API_BASE_URL = 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extracts a user-friendly message from an Axios/network error.
 * Keeps error-message logic in one place instead of duplicating it
 * inside every thunk/component.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;
  if (error.response) {
    // Server responded with a non-2xx status
    if (error.response.status === 404) return 'Not found.';
    return error.response.data?.message || fallback;
  }
  if (error.request) {
    // Request was made but no response received (network/timeout)
    return 'Network error. Please check your connection and try again.';
  }
  return error.message || fallback;
};

export default apiClient;
