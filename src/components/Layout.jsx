import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

/**
 * Layout component that wraps protected pages
 * Includes header with user info and logout, plus bottom navigation
 */
const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token) {
      navigate('/');
      return;
    }

    // Parse user data or set default
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'User', email: 'user@example.com' });
      }
    } else {
      setUser({ name: 'User', email: 'user@example.com' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;