import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAvailableLanguages } from '../services/translationService';

// Create Language Context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Language state - default to 'en' (English)
  const [language, setLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('language');
    console.log('[LanguageContext] Initial language:', savedLanguage || 'en (default)');
    return savedLanguage || 'en';
  });
  
  // Available languages state
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' }
  ]);
  
  // Loading state for API operations
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch available languages when the component mounts
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const languages = await getAvailableLanguages();
        setAvailableLanguages(languages);
        console.log('[LanguageContext] Languages loaded:', languages);
      } catch (error) {
        console.error('[LanguageContext] Error fetching languages:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLanguages();
  }, []);
  
  // Function to change language
  const changeLanguage = useCallback((lang) => {
    console.log('[LanguageContext] Changing language from', language, 'to', lang);
    
    if (lang === language) {
      console.log('[LanguageContext] Language unchanged, skipping update');
      return;
    }
    
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Optional: force refresh components that might not re-render automatically
    // This is a bit of a hack, but it helps ensure all components update
    document.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
  }, [language]);
  
  // For backward compatibility
  const isHindi = language === 'hi';
  
  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        changeLanguage, 
        isHindi, // Keep for backward compatibility
        isLoading,
        error,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
