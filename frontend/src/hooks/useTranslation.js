import { useState, useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translateText } from '../services/translationService';


export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  const [translationCache, setTranslationCache] = useState({});

  
  const translate = useCallback(async (text) => {
    
    if (language === 'en' || !text) {
      return text;
    }

   
    const cacheKey = `${text}_${language}`;
    
 
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
 
    try {
      const translatedText = await translateText(text, language, 'en');
      
    
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; 
    }
  }, [language, translationCache]);

  return { translate };
};
