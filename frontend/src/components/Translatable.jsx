import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translateText } from '../services/translationService';

/**
 * Component that automatically translates its children text
 */
function Translatable({ children, showLoading = false }) {
  const { language } = useContext(LanguageContext);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevChildrenRef = useRef('');
  const prevLanguageRef = useRef('');
  
  useEffect(() => {
    // Don't translate if children is not a string
    if (typeof children !== 'string') {
      return;
    }
    
    // Skip translation for English or empty text
    if (language === 'en' || !children) {
      setTranslatedText(children);
      return;
    }
    
    // Skip if nothing changed
    if (children === prevChildrenRef.current && language === prevLanguageRef.current) {
      return;
    }
    
    // Store current values for comparison in next render
    prevChildrenRef.current = children;
    prevLanguageRef.current = language;
    
    const translateContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await translateText(children, language, 'en');
        setTranslatedText(result);
      } catch (error) {
        console.error('[Translatable] Translation error:', error);
        setError(error.message);
        setTranslatedText(children); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };
    
    translateContent();
  }, [children, language]);
  
  // If children is not a string, return it as is
  if (typeof children !== 'string') {
    return children;
  }
  
  // Return translated text or original while loading
  return (
    <span className={isLoading ? 'translating' : ''} title={error ? `Translation error: ${error}` : undefined}>
      {translatedText || children}
      {isLoading && showLoading && (
        <span className="translation-loading-dots">...</span>
      )}
    </span>
  );
}

export default Translatable;
