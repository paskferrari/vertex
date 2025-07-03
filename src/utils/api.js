import { getToken } from './auth';

/**
 * Base API URL - change this to your backend URL
 * For local development, use localhost
 * For production, use your deployed backend URL
 * Uses environment variable VITE_API_BASE_URL if available
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Make an API request with proper authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
const apiRequest = async (endpoint, options = {}) => {
  // Get token from localStorage
  const token = getToken();
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Check if response is ok
  if (!response.ok) {
    // Try to parse error message
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = `Error: ${response.status}`;
    }
    
    throw new Error(errorMessage);
  }
  
  // Parse response
  const data = await response.json();
  return data;
};

/**
 * API utility functions
 */
export const api = {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - Fetch promise
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'GET',
    });
  },
  
  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - Fetch promise
   */
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - Fetch promise
   */
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise} - Fetch promise
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};