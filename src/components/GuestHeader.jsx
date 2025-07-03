import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GuestHeader = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'it' ? 'en' : 'it';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-dark-lighter border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-white">{t('common.appName')}</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Cambia lingua"
            >
              <span className="text-sm font-medium">
                {i18n.language === 'it' ? '🇮🇹' : '🇺🇸'}
              </span>
            </button>

            {/* Login Button */}
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;