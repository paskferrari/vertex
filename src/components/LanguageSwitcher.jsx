import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageLoader from './LanguageLoader';

/**
 * LanguageSwitcher component for toggling between English and Italian
 */
const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isChanging, setIsChanging] = useState(false);

  // Update state when language changes externally
  useEffect(() => {
    setCurrentLanguage(i18n.language);
    setIsChanging(false);
  }, [i18n.language]);

  // Toggle between English and Italian
  const toggleLanguage = () => {
    setIsChanging(true);
    const newLanguage = currentLanguage === 'en' ? 'it' : 'en';
    
    // Add a small delay to show the loading animation
    setTimeout(() => {
      i18n.changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
      // Store language preference in localStorage
      localStorage.setItem('i18nextLng', newLanguage);
      
      // Add a small delay to ensure the UI updates smoothly
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }, 500);
  };

  return (
    <div className="flex items-center">
      <motion.button
        onClick={toggleLanguage}
        className="relative flex items-center space-x-1 px-3 py-1.5 rounded-full bg-dark-lighter border border-gray-700 text-gray-300 hover:border-gray-600 transition-colors"
        aria-label={`Switch to ${currentLanguage === 'en' ? 'Italian' : 'English'}`}
        whileTap={{ scale: 0.95 }}
        disabled={isChanging}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentLanguage}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <span className={`text-xs font-medium ${currentLanguage === 'en' ? 'text-white' : 'text-gray-400'}`}>EN</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className={`text-xs font-medium ${currentLanguage === 'it' ? 'text-white' : 'text-gray-400'}`}>IT</span>
          </motion.div>
        </AnimatePresence>
        
        {/* Indicator dot */}
        <motion.div 
          className="absolute bottom-0 w-1 h-1 bg-primary rounded-full"
          initial={false}
          animate={{ 
            x: currentLanguage === 'en' ? 'calc(25% - 2px)' : 'calc(75% - 2px)' 
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </motion.button>
      
      {/* Language change loader */}
      <AnimatePresence>
        {isChanging && <LanguageLoader />}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;