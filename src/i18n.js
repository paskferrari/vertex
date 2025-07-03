import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslation from './locales/en.json';
import itTranslation from './locales/it.json';

// Initialize i18next
i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Still include preloaded resources for immediate rendering
    resources: {
      en: {
        translation: enTranslation
      },
      it: {
        translation: itTranslation
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Common namespace used around the full app
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Backend configuration for loading translations
    backend: {
      // Path where resources get loaded from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // React specific options
    react: {
      useSuspense: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
      // Wait for translations to be loaded before rendering
      wait: true
    },
    
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    
    // Performance options
    load: 'languageOnly', // Only load language part of the code, e.g. 'en' from 'en-US'
    cleanCode: true, // Clean language code, e.g. 'en-US' -> 'en'
  });

export default i18n;