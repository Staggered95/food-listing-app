// src/api/axiosConfig.js
import axios from 'axios';

// This function will set up the interceptors.
export const setupAxiosInterceptors = (showLoading, hideLoading) => {
  
  // Set the default base URL for all requests
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // Request interceptor: Called before any request is sent
  axios.interceptors.request.use(
    config => {
      showLoading();
      return config;
    },
    error => {
      hideLoading();
      return Promise.reject(error);
    }
  );

  // Response interceptor: Called after any response is received
  axios.interceptors.response.use(
    response => {
      hideLoading();
      return response;
    },
    error => {
      hideLoading();
      return Promise.reject(error);
    }
  );
};