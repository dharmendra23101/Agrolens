/**
 * Translation service using LibreTranslate API
 */

// Use a LibreTranslate API that allows CORS
// You may need to use a different URL if this doesn't work
const LIBRETRANSLATE_API_URL = "https://translate.argosopentech.com";
// Backup services in case the primary one fails
const BACKUP_API_URLS = [
  "https://libretranslate.de",
  "https://translate.terraprint.co"
];

// In-memory cache for translations
const translationCache = {};

/**
 * Try to translate using multiple API endpoints
 * 
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @returns {Promise<string>} - Translated text
 */
const tryTranslateWithMultipleAPIs = async (text, targetLang, sourceLang = 'en') => {
  // Try the primary API first
  try {
    const result = await callTranslationAPI(LIBRETRANSLATE_API_URL, text, targetLang, sourceLang);
    console.log(`[Translation] Success with primary API: ${LIBRETRANSLATE_API_URL}`);
    return result;
  } catch (primaryError) {
    console.warn(`[Translation] Primary API failed: ${primaryError.message}`);
    
    // Try backup APIs sequentially
    for (const backupUrl of BACKUP_API_URLS) {
      try {
        console.log(`[Translation] Trying backup API: ${backupUrl}`);
        const result = await callTranslationAPI(backupUrl, text, targetLang, sourceLang);
        console.log(`[Translation] Success with backup API: ${backupUrl}`);
        return result;
      } catch (backupError) {
        console.warn(`[Translation] Backup API ${backupUrl} failed: ${backupError.message}`);
      }
    }
    
    // If all APIs fail, throw the original error
    throw primaryError;
  }
};

/**
 * Call a specific translation API
 */
const callTranslationAPI = async (apiUrl, text, targetLang, sourceLang) => {
  const response = await fetch(`${apiUrl}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`API error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  return data.translatedText || text;
};

/**
 * Translates text from source language to target language
 */
export const translateText = async (text, targetLang, sourceLang = 'en') => {
  console.log(`[Translation] Request: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" to ${targetLang}`);
  
  // Don't translate if text is empty or target language is English or same as source
  if (!text || targetLang === 'en' || targetLang === sourceLang) {
    console.log('[Translation] Skipped - Empty text or same language');
    return text;
  }

  // Check cache first
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;
  if (translationCache[cacheKey]) {
    console.log('[Translation] Using cached translation');
    return translationCache[cacheKey];
  }

  // Check localStorage cache
  try {
    const cachedTranslations = JSON.parse(localStorage.getItem('translationCache') || '{}');
    if (cachedTranslations[cacheKey]) {
      console.log('[Translation] Using localStorage cached translation');
      translationCache[cacheKey] = cachedTranslations[cacheKey];
      return cachedTranslations[cacheKey];
    }
  } catch (e) {
    console.warn('[Translation] Error reading from localStorage:', e);
  }

  try {
    // Try translating with multiple API endpoints
    const translatedText = await tryTranslateWithMultipleAPIs(text, targetLang, sourceLang);
    
    // Cache the result in memory
    translationCache[cacheKey] = translatedText;
    
    // Also store in localStorage
    try {
      const cachedTranslations = JSON.parse(localStorage.getItem('translationCache') || '{}');
      cachedTranslations[cacheKey] = translatedText;
      localStorage.setItem('translationCache', JSON.stringify(cachedTranslations));
    } catch (e) {
      console.warn('[Translation] Error saving to localStorage:', e);
    }
    
    return translatedText;
  } catch (error) {
    console.error("[Translation] All translation attempts failed:", error);
    // Return original text if translation fails
    return text;
  }
};

/**
 * Get available languages from LibreTranslate API
 */
export const getAvailableLanguages = async () => {
  // First try to get from localStorage for faster startup
  try {
    const cachedLanguages = localStorage.getItem('availableLanguages');
    if (cachedLanguages) {
      const languages = JSON.parse(cachedLanguages);
      console.log('[Translation] Using cached language list:', languages);
      return languages;
    }
  } catch (e) {
    console.warn('[Translation] Error reading languages from localStorage:', e);
  }
  
  // Fallback languages if API fails
  const fallbackLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' }
  ];
  
  // Try to fetch languages from any available API
  const apiUrls = [LIBRETRANSLATE_API_URL, ...BACKUP_API_URLS];
  
  for (const apiUrl of apiUrls) {
    try {
      console.log(`[Translation] Fetching languages from ${apiUrl}`);
      const response = await fetch(`${apiUrl}/languages`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const languages = await response.json();
      console.log('[Translation] Languages retrieved:', languages);
      
      if (languages && Array.isArray(languages) && languages.length > 0) {
        // Store in localStorage for future use
        localStorage.setItem('availableLanguages', JSON.stringify(languages));
        return languages;
      }
    } catch (error) {
      console.warn(`[Translation] Failed to fetch languages from ${apiUrl}:`, error);
    }
  }
  
  console.log('[Translation] Using fallback language list');
  return fallbackLanguages;
};

// Initialize by preloading languages
getAvailableLanguages().catch(err => {
  console.warn('[Translation] Failed to preload languages:', err);
});