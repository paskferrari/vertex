import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated by looking for JWT token in localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If no token or user data, redirect to login/home
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  
  // Optional: Add token validation logic here
  // For now, we just check if token exists
  try {
    // Basic token format validation (JWT has 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      // Invalid token format, clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/" replace />;
    }
    
    // Optional: Check token expiration
    // const payload = JSON.parse(atob(tokenParts[1]));
    // const currentTime = Date.now() / 1000;
    // if (payload.exp && payload.exp < currentTime) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   return <Navigate to="/" replace />;
    // }
  } catch (error) {
    // Token parsing failed, clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated, render the protected component
  return children;
};

export default PrivateRoute;