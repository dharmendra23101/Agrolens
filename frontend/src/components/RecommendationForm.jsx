import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { LanguageContext } from '../context/LanguageContext'

function RecommendationForm() {
  const { language, isHindi } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [showResults, setShowResults] = useState(false)

  // Translations
  const translations = {
    english: {
      // Form titles
      formTitle: "Crop Recommendation",
      formDescription: "Enter your soil and climate data to get AI-powered crop recommendations.",

      // Validation
      validationHeader: "Please fix the following errors:",

      // Input fields
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      temperature: "Temperature",
      humidity: "Humidity",
      ph: "pH",
      rainfall: "Rainfall",

      // Units
      mgkg: "mg/kg",
      celsius: "°C",
      percent: "%",
      mm: "mm",

      // Ranges
      nitrogenRange: "Typical range: 0-140 mg/kg",
      phosphorusRange: "Typical range: 5-145 mg/kg",
      potassiumRange: "Typical range: 5-205 mg/kg",
      temperatureRange: "Typical range: 8-45 °C",
      humidityRange: "Typical range: 14-100%",
      phRange: "Typical range: 3.5-10",
      rainfallRange: "Typical range: 20-300 mm",

      // Buttons
      submitButton: "Get Recommendation",
      processingButton: "Processing...",
      startNewButton: "Start New Recommendation",
      tryAgainButton: "Try Again",

      // Results
      recommendationTitle: "Recommendation",
      recommendationMessage: "Based on your input, we recommend growing:",
      parametersTitle: "Your Soil & Climate Parameters:",
      resultTip: "This crop is well-suited to your soil nutrients and climate conditions. For optimal results, follow recommended agricultural practices for {crop}.",
      errorTitle: "Error",
      errorTip: "Please check your inputs and try again. If the problem persists, our server may be experiencing issues.",

      // Parameter labels
      nitrogenLabel: "Nitrogen:",
      phosphorusLabel: "Phosphorus:",
      potassiumLabel: "Potassium:",
      temperatureLabel: "Temperature:",
      humidityLabel: "Humidity:",
      phLabel: "pH Level:",
      rainfallLabel: "Rainfall:",

      // Info card
      infoTitle: "Understanding Soil Parameters",
      nitrogenInfo: "Nitrogen (N)",
      nitrogenDescription: "Essential for leaf growth and protein formation. Deficiency causes yellowing of leaves and stunted growth.",
      phosphorusInfo: "Phosphorus (P)",
      phosphorusDescription: "Important for root development, flowering, and seed formation. Deficiency stunts growth and reduces yields.",
      potassiumInfo: "Potassium (K)",
      potassiumDescription: "Helps in overall health of the plant by strengthening cell walls. Deficiency causes weak stems and poor disease resistance.",
      phInfo: "pH Level",
      phDescription: "Measures soil acidity or alkalinity on a scale of 0-14. Most crops prefer a slightly acidic to neutral pH (6.0-7.0).",
      climateInfo: "Climate Factors",
      climateDescription: "Temperature, humidity, and rainfall significantly impact crop growth cycles and productivity. Different crops have different optimal conditions."
    },
    hindi: {
      // Form titles
      formTitle: "फसल अनुशंसा",
      formDescription: "AI-संचालित फसल अनुशंसाएं प्राप्त करने के लिए अपनी मिट्टी और जलवायु डेटा दर्ज करें।",

      // Validation
      validationHeader: "कृपया निम्नलिखित त्रुटियों को ठीक करें:",

      // Input fields
      nitrogen: "नाइट्रोजन (N)",
      phosphorus: "फॉस्फोरस (P)",
      potassium: "पोटैशियम (K)",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      ph: "पीएच (pH)",
      rainfall: "वर्षा",

      // Units
      mgkg: "मि.ग्रा./कि.ग्रा.",
      celsius: "°C",
      percent: "%",
      mm: "मिमी",

      // Ranges
      nitrogenRange: "सामान्य सीमा: 0-140 मि.ग्रा./कि.ग्रा.",
      phosphorusRange: "सामान्य सीमा: 5-145 मि.ग्रा./कि.ग्रा.",
      potassiumRange: "सामान्य सीमा: 5-205 मि.ग्रा./कि.ग्रा.",
      temperatureRange: "सामान्य सीमा: 8-45 °C",
      humidityRange: "सामान्य सीमा: 14-100%",
      phRange: "सामान्य सीमा: 3.5-10",
      rainfallRange: "सामान्य सीमा: 20-300 मिमी",

      // Buttons
      submitButton: "अनुशंसा प्राप्त करें",
      processingButton: "प्रोसेसिंग...",
      startNewButton: "नई अनुशंसा शुरू करें",
      tryAgainButton: "पुनः प्रयास करें",

      // Results
      recommendationTitle: "अनुशंसा",
      recommendationMessage: "आपके इनपुट के आधार पर, हम निम्न को उगाने की अनुशंसा करते हैं:",
      parametersTitle: "आपके मिट्टी और जलवायु पैरामीटर:",
      resultTip: "यह फसल आपकी मिट्टी के पोषक तत्वों और जलवायु परिस्थितियों के लिए उपयुक्त है। सर्वोत्तम परिणामों के लिए, {crop} के लिए अनुशंसित कृषि प्रथाओं का पालन करें।",
      errorTitle: "त्रुटि",
      errorTip: "कृपया अपने इनपुट की जांच करें और पुनः प्रयास करें। यदि समस्या बनी रहती है, तो हमारा सर्वर समस्याओं का अनुभव कर रहा हो सकता है।",

      // Parameter labels
      nitrogenLabel: "नाइट्रोजन:",
      phosphorusLabel: "फॉस्फोरस:",
      potassiumLabel: "पोटैशियम:",
      temperatureLabel: "तापमान:",
      humidityLabel: "आर्द्रता:",
      phLabel: "पीएच स्तर:",
      rainfallLabel: "वर्षा:",

      // Info card
      infoTitle: "मिट्टी के पैरामीटर को समझना",
      nitrogenInfo: "नाइट्रोजन (N)",
      nitrogenDescription: "पत्ती की वृद्धि और प्रोटीन निर्माण के लिए आवश्यक। कमी से पत्तियों का पीला होना और विकास रुकना होता है।",
      phosphorusInfo: "फॉस्फोरस (P)",
      phosphorusDescription: "जड़ विकास, फूल आने और बीज निर्माण के लिए महत्वपूर्ण। कमी से विकास रुकता है और उपज कम होती है।",
      potassiumInfo: "पोटैशियम (K)",
      potassiumDescription: "सेल दीवारों को मजबूत करके पौधे के समग्र स्वास्थ्य में मदद करता है। कमी से कमजोर तने और खराब रोग प्रतिरोध होता है।",
      phInfo: "पीएच स्तर",
      phDescription: "0-14 के पैमाने पर मिट्टी की अम्लता या क्षारीयता को मापता है। अधिकांश फसलें थोड़ी अम्लीय से तटस्थ पीएच (6.0-7.0) पसंद करती हैं।",
      climateInfo: "जलवायु कारक",
      climateDescription: "तापमान, आर्द्रता और वर्षा फसल विकास चक्र और उत्पादकता पर महत्वपूर्ण प्रभाव डालते हैं। विभिन्न फसलों की अलग-अलग इष्टतम स्थितियां होती हैं।"
    }
  };

  const t = isHindi ? translations.hindi : translations.english;

  // Parameter ranges for validation
  const paramRanges = {
    N: { min: 0, max: 140, name: isHindi ? "नाइट्रोजन" : "Nitrogen" },
    P: { min: 5, max: 145, name: isHindi ? "फॉस्फोरस" : "Phosphorus" },
    K: { min: 5, max: 205, name: isHindi ? "पोटैशियम" : "Potassium" },
    temperature: { min: 8, max: 45, name: isHindi ? "तापमान" : "Temperature" },
    humidity: { min: 14, max: 100, name: isHindi ? "आर्द्रता" : "Humidity" },
    ph: { min: 3.5, max: 10, name: isHindi ? "पीएच" : "pH" },
    rainfall: { min: 20, max: 300, name: isHindi ? "वर्षा" : "Rainfall" }
  }

  // Reset validation errors when form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear the specific validation error when field is changed
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {}

    Object.entries(formData).forEach(([key, value]) => {
      const range = paramRanges[key]

      // Check if field is empty
      if (!value) {
        errors[key] = isHindi 
          ? `${range.name} आवश्यक है` 
          : `${range.name} is required`
        return
      }

      // Check if value is within valid range
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        errors[key] = isHindi 
          ? `${range.name} एक संख्या होनी चाहिए` 
          : `${range.name} must be a number`
      } else if (numValue < range.min || numValue > range.max) {
        errors[key] = isHindi 
          ? `${range.name} ${range.min} और ${range.max} के बीच होना चाहिए` 
          : `${range.name} should be between ${range.min} and ${range.max}`
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form before proceeding
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setPrediction(null)
    setShowResults(false)
    
    try {
      // Get API URL from environment with fallback
      const apiBaseUrl = import.meta.env.VITE_RECOMMEND_API || "https://crop-recommendation-api-393g.onrender.com";
      console.log("Submitting form data to:", `${apiBaseUrl}/predict_crop`);
      console.log("Form data:", formData);
      
      const response = await axios.post(`${apiBaseUrl}/predict_crop`, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 15000
      });
      
      console.log("API response:", response.data);
      
      if (response.data && response.data.crop) {
        setPrediction(response.data.crop);
        setShowResults(true);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("API Error:", err);
      
      // Better error handling with specific messages
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be down or overloaded.');
      } else if (err.message.includes('Network Error')) {
        setError('Network error. Please check your internet connection or the server may be unavailable.');
      } else if (err.response) {
        setError(err.response.data?.error || `Server error: ${err.response.status}`);
      } else {
        setError(err.message || 'An error occurred while processing your request');
      }
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    })
    setPrediction(null)
    setError(null)
    setShowResults(false)
    setValidationErrors({})
  }

  // Get visual cue class for input fields
  const getInputClass = (fieldName) => {
    if (!formData[fieldName]) return ''
    if (validationErrors[fieldName]) return 'input-error'
    return 'input-valid'
  }

  // Get localized crop name
  const getLocalizedCropName = (cropName) => {
    if (!isHindi) return cropName;

    const cropTranslations = {
      "rice": "चावल (Rice)",
      "maize": "मक्का (Maize)",
      "chickpea": "चना (Chickpea)",
      "kidneybeans": "राजमा (Kidney Beans)",
      "pigeonpeas": "अरहर दाल (Pigeon Peas)",
      "mothbeans": "मोठ बीन्स (Moth Beans)",
      "mungbean": "मूंग (Mung Bean)",
      "blackgram": "उड़द (Black Gram)",
      "lentil": "मसूर (Lentil)",
      "pomegranate": "अनार (Pomegranate)",
      "banana": "केला (Banana)",
      "mango": "आम (Mango)",
      "grapes": "अंगूर (Grapes)",
      "watermelon": "तरबूज (Watermelon)",
      "muskmelon": "खरबूजा (Muskmelon)",
      "apple": "सेब (Apple)",
      "orange": "संतरा (Orange)",
      "papaya": "पपीता (Papaya)",
      "coconut": "नारियल (Coconut)",
      "cotton": "कपास (Cotton)",
      "jute": "जूट (Jute)",
      "coffee": "कॉफी (Coffee)"
    };

    // Return the translation or original name if translation not found
    return cropTranslations[cropName.toLowerCase()] || cropName;
  };

  return (
    <div className="recommendation-form-container">
      <div className="form-card">
        <h2 className="form-title">{t.formTitle}</h2>
        <p className="form-description">
          {t.formDescription}
        </p>

        {Object.keys(validationErrors).length > 0 && (
          <div className="validation-summary">
            <div className="validation-header">
              <span className="validation-icon">!</span>
              <h4>{t.validationHeader}</h4>
            </div>
            <ul className="validation-list">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {!showResults ? (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="N">
                  {t.nitrogen} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
                </label>
                <input
                  type="number"
                  id="N"
                  name="N"
                  value={formData.N}
                  onChange={handleChange}
                  placeholder="0-140"
                  className={getInputClass('N')}
                  required
                />
                <small className="input-help">{t.nitrogenRange}</small>
                {validationErrors.N && <div className="field-error">{validationErrors.N}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="P">
                  {t.phosphorus} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
                </label>
                <input
                  type="number"
                  id="P"
                  name="P"
                  value={formData.P}
                  onChange={handleChange}
                  placeholder="5-145"
                  className={getInputClass('P')}
                  required
                />
                <small className="input-help">{t.phosphorusRange}</small>
                {validationErrors.P && <div className="field-error">{validationErrors.P}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="K">
                  {t.potassium} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
                </label>
                <input
                  type="number"
                  id="K"
                  name="K"
                  value={formData.K}
                  onChange={handleChange}
                  placeholder="5-205"
                  className={getInputClass('K')}
                  required
                />
                <small className="input-help">{t.potassiumRange}</small>
                {validationErrors.K && <div className="field-error">{validationErrors.K}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="temperature">
                  {t.temperature} <span className="required">*</span> <span className="unit">{t.celsius}</span>
                </label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="8-45"
                  className={getInputClass('temperature')}
                  required
                />
                <small className="input-help">{t.temperatureRange}</small>
                {validationErrors.temperature && <div className="field-error">{validationErrors.temperature}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="humidity">
                  {t.humidity} <span className="required">*</span> <span className="unit">{t.percent}</span>
                </label>
                <input
                  type="number"
                  id="humidity"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  placeholder="14-100"
                  className={getInputClass('humidity')}
                  required
                />
                <small className="input-help">{t.humidityRange}</small>
                {validationErrors.humidity && <div className="field-error">{validationErrors.humidity}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="ph">
                  {t.ph} <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="ph"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  placeholder="3.5-10"
                  step="0.1"
                  className={getInputClass('ph')}
                  required
                />
                <small className="input-help">{t.phRange}</small>
                {validationErrors.ph && <div className="field-error">{validationErrors.ph}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="rainfall">
                  {t.rainfall} <span className="required">*</span> <span className="unit">{t.mm}</span>
                </label>
                <input
                  type="number"
                  id="rainfall"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  placeholder="20-300"
                  className={getInputClass('rainfall')}
                  required
                />
                <small className="input-help">{t.rainfallRange}</small>
                {validationErrors.rainfall && <div className="field-error">{validationErrors.rainfall}</div>}
              </div>
            </div>

            <button
              type="submit"
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? t.processingButton : t.submitButton}
            </button>
          </form>
        ) : (
          <div className="results-container">
            {prediction && (
              <div className="result success">
                <div className="result-header">
                  <h3>{t.recommendationTitle}</h3>
                  <span className="result-icon">✓</span>
                </div>
                <p className="result-message">{t.recommendationMessage}</p>
                <div className="crop-result">{getLocalizedCropName(prediction)}</div>

                <div className="parameters-summary">
                  <h4>{t.parametersTitle}</h4>
                  <div className="params-grid">
                    <div className="param-item">
                      <span className="param-label">{t.nitrogenLabel}</span>
                      <span className="param-value">{formData.N} {t.mgkg}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.phosphorusLabel}</span>
                      <span className="param-value">{formData.P} {t.mgkg}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.potassiumLabel}</span>
                      <span className="param-value">{formData.K} {t.mgkg}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.temperatureLabel}</span>
                      <span className="param-value">{formData.temperature}{t.celsius}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.humidityLabel}</span>
                      <span className="param-value">{formData.humidity}{t.percent}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.phLabel}</span>
                      <span className="param-value">{formData.ph}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label">{t.rainfallLabel}</span>
                      <span className="param-value">{formData.rainfall} {t.mm}</span>
                    </div>
                  </div>
                </div>

                <p className="result-tip">
                  {t.resultTip.replace('{crop}', getLocalizedCropName(prediction))}
                </p>

                <button 
                  className="restart-button"
                  onClick={resetForm}
                >
                  {t.startNewButton}
                </button>
              </div>
            )}

            {error && (
              <div className="result error">
                <div className="result-header">
                  <h3>{t.errorTitle}</h3>
                  <span className="result-icon">!</span>
                </div>
                <p className="result-message">{error}</p>
                <p className="result-tip">
                  {t.errorTip}
                </p>
                <button 
                  className="restart-button error-restart"
                  onClick={resetForm}
                >
                  {t.tryAgainButton}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>{t.infoTitle}</h3>
        <div className="info-item">
          <h4>{t.nitrogenInfo}</h4>
          <p>{t.nitrogenDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.phosphorusInfo}</h4>
          <p>{t.phosphorusDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.potassiumInfo}</h4>
          <p>{t.potassiumDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.phInfo}</h4>
          <p>{t.phDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.climateInfo}</h4>
          <p>{t.climateDescription}</p>
        </div>
      </div>

      {/* Add the styling */}
      <style>{`
        .recommendation-form-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 992px) {
          .recommendation-form-container {
            grid-template-columns: 3fr 2fr;
          }
        }

        .form-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, #2f855a, #48bb78);
        }

        .form-title {
          font-size: 1.75rem;
          color: #2f855a;
          margin-bottom: 0.5rem;
        }

        .form-description {
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .required {
          color: #e53e3e;
          margin-left: 2px;
        }

        .validation-summary {
          background-color: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          animation: shake 0.5s ease-in-out;
        }

        .validation-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .validation-header h4 {
          margin: 0;
          color: #92400e;
          font-size: 1rem;
        }

        .validation-icon {
          background-color: #fbbf24;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .validation-list {
          margin: 0;
          padding-left: 1.5rem;
          color: #92400e;
        }

        .validation-list li {
          margin-bottom: 0.25rem;
        }

        .field-error {
          color: #e53e3e;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }

        .unit {
          font-size: 0.85rem;
          color: #718096;
          font-weight: normal;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #f7fafc;
        }

        input:focus {
          outline: none;
          border-color: #2f855a;
          box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
          background-color: white;
        }

        .input-error {
          border-color: #e53e3e;
          background-color: #fff5f5;
        }

        .input-error:focus {
          border-color: #e53e3e;
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }

        .input-valid {
          border-color: #48bb78;
          background-color: #f0fff4;
        }

        .input-valid:focus {
          border-color: #48bb78;
          box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
        }

        .input-help {
          display: block;
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.25rem;
        }

        .submit-button {
          display: block;
          width: 100%;
          padding: 0.875rem;
          margin-top: 1.5rem;
          background-color: #2f855a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          background-color: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .submit-button.loading {
          background-color: #9ae6b4;
          cursor: not-allowed;
        }

        .results-container {
          animation: fadeIn 0.5s ease;
        }

        .result {
          margin-top: 1rem;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .result.success {
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
        }

        .result.error {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .result-header h3 {
          font-size: 1.25rem;
          color: #2d3748;
          margin: 0;
        }

        .result-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: bold;
        }

        .success .result-icon {
          background-color: #c6f6d5;
          color: #2f855a;
        }

        .error .result-icon {
          background-color: #fed7d7;
          color: #c53030;
        }

        .result-message {
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .crop-result {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2f855a;
          text-align: center;
          padding: 1rem;
          margin: 1rem 0;
          background-color: #e6fffa;
          border-radius: 8px;
        }

        .parameters-summary {
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .parameters-summary h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #4a5568;
          font-size: 1rem;
        }

        .params-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .param-item {
          display: flex;
          flex-direction: column;
        }

        .param-label {
          font-size: 0.8rem;
          color: #718096;
        }

        .param-value {
          font-weight: 600;
          color: #2d3748;
        }

        .result-tip {
          font-size: 0.875rem;
          color: #718096;
          margin-top: 1.5rem;
        }

        .restart-button {
          display: block;
          width: 100%;
          padding: 0.875rem;
          margin-top: 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .restart-button:hover {
          background-color: #3182ce;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .error-restart {
          background-color: #f56565;
        }

        .error-restart:hover {
          background-color: #e53e3e;
        }

        .info-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
        }

        .info-card h3 {
          color: #2f855a;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .info-item {
          margin-bottom: 1.25rem;
        }

        .info-item h4 {
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .info-item p {
          color: #718096;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .params-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default RecommendationForm
