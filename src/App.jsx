import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// i18n configuration
import './i18n';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import GuestLayout from './components/GuestLayout';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GuestHome from './pages/GuestHome';
import TestPage from './pages/TestPage';
import SimplePage from './pages/SimplePage';
import DashboardPage from './pages/DashboardPage';
import WalletPage from './pages/WalletPage';
import ROIPage from './pages/ROIPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import Predictions from './pages/Predictions';
import Notifications from './pages/Notifications';
import UsersAdmin from './pages/UsersAdmin';

// Routes
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

function App() {
  const { t } = useTranslation();
  
  // Check for dark mode preference
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    // Log to verify the component is loading
    console.log('App component loaded');
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<GuestHome />} />
          <Route path="/guest" element={<GuestHome />} />
        </Route>
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/simple" element={<SimplePage />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/roi" element={<ROIPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UsersAdmin />
              </AdminRoute>
            } />
          </Route>
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
