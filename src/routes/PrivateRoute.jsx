import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute component for protecting routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const PrivateRoute = () => {
  // This is a placeholder for actual authentication logic
  // In a real app, you would check for a valid JWT token in localStorage
  const isAuthenticated = localStorage.getItem('token') !== null;

  // If authenticated, render the child routes (Outlet)
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;