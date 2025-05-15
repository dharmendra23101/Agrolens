import React, { createContext, useState, useEffect } from 'react';

// Create the language context
export const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Initialize with English, but check localStorage for previously saved preference
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('agrolens-language');
    return savedLanguage || 'english';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('agrolens-language', language);
  }, [language]);

  // Function to change the language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Value to be provided by the context
  const contextValue = {
    language,
    changeLanguage,
    isHindi: language === 'hindi'
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};