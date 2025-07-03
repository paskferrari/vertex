import { getToken } from './auth';

/**
 * Base API URL - change this to your backend URL
 * For local development, use localhost
 * For production, use your deployed backend URL
 * Uses environment variable VITE_API_BASE_URL if available
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Make an API request with proper authentication and retry logic
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retries for failed requests
 * @returns {Promise} - Fetch promise
 */
const apiRequest = async (endpoint, options = {}, retries = 2) => {
  // Get token from localStorage
  const token = getToken();
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    // Make request with timeout and retry logic
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
      // Add credentials for CORS
      credentials: 'include',
    });
    
    clearTimeout(timeoutId);
    
    // Check if response is ok
    if (!response.ok) {
      // Try to parse error message
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error: ${response.status}`;
      } catch (e) {
        errorMessage = `Error: ${response.status} - ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse response
    const data = await response.json();
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle network errors and timeouts with retry
    if ((error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('Failed to fetch')) && retries > 0) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return apiRequest(endpoint, options, retries - 1);
    }
    
    // Provide user-friendly error messages
    if (error.name === 'AbortError') {
      throw new Error('Richiesta scaduta. Controlla la tua connessione internet.');
    }
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Impossibile connettersi al server. Controlla la tua connessione internet.');
    }
    
    throw error;
  }
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