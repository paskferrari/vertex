import { jwtDecode } from 'jwt-decode';

/**
 * Auth utility functions for handling JWT tokens
 */

/**
 * Set JWT token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode token to check expiration
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token is expired, remove it
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token
    removeToken();
    return false;
  }
};

/**
 * Get user info from token
 * @returns {Object|null} - User info or null if not authenticated
 */
export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode token to get user info
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      // Add any other user info from token
    };
  } catch (error) {
    // Invalid token
    return null;
  }
};