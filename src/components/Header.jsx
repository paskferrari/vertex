import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ user, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  // Check if current route is login page
  const isLoginPage = location.pathname === '/';

  // Don't show header on login page
  if (isLoginPage) return null;

  return (
    <header className="bg-dark-lighter py-4 px-4 md:px-6 sticky top-0 z-10 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-white flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Vertex</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/home" 
            className={`text-sm ${location.pathname === '/home' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            {t('navigation.home')}
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            {t('navigation.dashboard')}
          </Link>
          <Link 
            to="/wallet" 
            className={`text-sm ${location.pathname === '/wallet' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            {t('navigation.wallet')}
          </Link>
          <Link 
            to="/roi" 
            className={`text-sm ${location.pathname === '/roi' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            {t('navigation.roi')}
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm ${location.pathname === '/profile' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            {t('navigation.profile')}
          </Link>
          <Link 
            to="/notifications" 
            className={`text-sm ${location.pathname === '/notifications' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
          >
            Notifiche
          </Link>
          {isAdmin() && (
            <Link 
              to="/admin/users" 
              className={`text-sm ${location.pathname === '/admin/users' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
            >
              Gestione Utenti
            </Link>
          )}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{t('common.welcome', { name: user?.name || 'User' })}</span>
            <button 
              onClick={onLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t('common.logout')}
            </button>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-400 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-4 py-4 px-4 bg-dark-lighter rounded-2xl shadow-lg absolute left-4 right-4"
        >
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/home" 
              className={`text-sm ${location.pathname === '/home' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.dashboard')}
            </Link>
            <Link 
              to="/wallet" 
              className={`text-sm ${location.pathname === '/wallet' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.wallet')}
            </Link>
            <Link 
              to="/roi" 
              className={`text-sm ${location.pathname === '/roi' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.roi')}
            </Link>
            <Link 
              to="/profile" 
              className={`text-sm ${location.pathname === '/profile' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navigation.profile')}
            </Link>
            <Link 
              to="/notifications" 
              className={`text-sm ${location.pathname === '/notifications' ? 'text-white' : 'text-gray-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Notifiche
            </Link>
            {isAdmin() && (
              <Link 
                to="/admin/users" 
                className={`text-sm ${location.pathname === '/admin/users' ? 'text-white' : 'text-gray-400'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Gestione Utenti
              </Link>
            )}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-500 mb-2">Logged in as:</p>
              <p className="text-sm text-white mb-3">{user?.name || 'User'}</p>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="text-sm text-gray-400 text-left"
                >
                  {t('common.logout')}
                </button>
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;