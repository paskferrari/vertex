import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute component for protecting admin-only routes
 * Redirects to dashboard if user is not authenticated or not an admin
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user exists and has admin role
  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso Negato</h2>
          <p className="text-gray-600 mb-6">
            Non hai i permessi necessari per accedere a questa sezione. 
            È richiesto il ruolo di amministratore.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  // User is admin, render the protected content
  return children;
};

export default AdminRoute;