import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { LanguageContext } from '../context/LanguageContext'

function YieldForm() {
  const { language, isHindi } = useContext(LanguageContext)
  
  const [formData, setFormData] = useState({
    soil_type: '',
    crop: '',
    rainfall: '',
    temperature: '',
    fertilizer: 'No',
    irrigation: 'No',
    weather: '',
    days_to_harvest: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [validationError, setValidationError] = useState(null)

  // Translations
  const translations = {
    english: {
      // Step labels
      stepCropInfo: "Crop Info",
      stepEnvironment: "Environment",
      stepFarmingPractices: "Farming Practices",
      stepResults: "Results",
      
      // Validation
      validationErrorMessage: "Please fill all required fields before proceeding",
      
      // Step 1
      cropInfoTitle: "Crop Information",
      cropInfoDescription: "Tell us about your crop and soil conditions.",
      soilType: "Soil Type",
      soilTypeHelp: "The primary soil type in your field",
      cropType: "Crop Type",
      cropTypeHelp: "The crop you are planning to grow",
      daysToHarvest: "Days to Harvest",
      daysToHarvestHelp: "Expected days from planting to harvest",
      
      // Soil types
      sandy: "Sandy",
      clay: "Clay",
      loam: "Loam",
      silt: "Silt",
      peaty: "Peaty",
      chalky: "Chalky",
      selectSoilType: "Select Soil Type",
      
      // Crop types
      cotton: "Cotton",
      rice: "Rice",
      barley: "Barley",
      soybean: "Soybean",
      wheat: "Wheat",
      maize: "Maize",
      selectCrop: "Select Crop",
      
      // Step 2
      environmentTitle: "Environmental Conditions",
      environmentDescription: "Provide information about the climate and weather conditions.",
      rainfall: "Rainfall (mm)",
      rainfallHelp: "Average monthly rainfall in millimeters",
      temperature: "Temperature (°C)",
      temperatureHelp: "Average daily temperature in Celsius",
      weatherCondition: "Weather Condition",
      weatherHelp: "Predominant weather pattern during growing season",
      
      // Weather types
      cloudy: "Cloudy",
      rainy: "Rainy",
      sunny: "Sunny",
      selectWeather: "Select Weather Condition",
      
      // Step 3
      farmingPracticesTitle: "Farming Practices",
      farmingPracticesDescription: "Tell us about the agricultural techniques you're employing.",
      fertilizerUsage: "Fertilizer Usage",
      fertilizerHelp: "Whether you're using fertilizers",
      irrigationSystem: "Irrigation System",
      irrigationHelp: "Whether you're using an irrigation system",
      yes: "Yes",
      no: "No",
      
      // Navigation
      next: "Next",
      back: "Back",
      predictYield: "Predict Yield",
      processing: "Processing...",
      startNew: "Start New Prediction",
      tryAgain: "Try Again",
      
      // Results
      resultsTitle: "Yield Prediction Results",
      resultsDescription: "View your crop yield prediction based on provided data.",
      resultComplete: "Yield Prediction Complete",
      tonsPerHectare: "tons/hectare",
      crop: "Crop",
      soil: "Soil",
      growth: "Growth",
      days: "days",
      resultTip: "Based on your inputs, we predict this yield for your {crop} crop. Actual yields may vary based on additional factors not included in this model.",
      errorTitle: "Error",
      errorTip: "Please check your inputs and try again. If the problem persists, our server may be experiencing issues.",
      
      // Info card
      infoTitle: "Understanding Factors Affecting Crop Yield",
      soilTypeInfo: "Soil Type",
      soilTypeDescription: "Different crops thrive in different soil types. Loamy soil is generally considered optimal for most crops.",
      weatherInfo: "Weather Conditions",
      weatherDescription: "Weather patterns significantly impact crop development. Consistent conditions generally produce better yields.",
      fertilizerInfo: "Fertilizer Usage",
      fertilizerDescription: "Proper fertilization can increase yields by 30-50% by providing essential nutrients to crops.",
      irrigationInfo: "Irrigation",
      irrigationDescription: "Consistent irrigation reduces dependence on rainfall and can dramatically improve yields in drier regions."
    },
    hindi: {
      // Step labels
      stepCropInfo: "फसल जानकारी",
      stepEnvironment: "पर्यावरण",
      stepFarmingPractices: "खेती की प्रथाएँ",
      stepResults: "परिणाम",
      
      // Validation
      validationErrorMessage: "कृपया आगे बढ़ने से पहले सभी आवश्यक फ़ील्ड भरें",
      
      // Step 1
      cropInfoTitle: "फसल की जानकारी",
      cropInfoDescription: "हमें अपनी फसल और मिट्टी की स्थिति के बारे में बताएं।",
      soilType: "मिट्टी का प्रकार",
      soilTypeHelp: "आपके खेत में मुख्य मिट्टी का प्रकार",
      cropType: "फसल का प्रकार",
      cropTypeHelp: "आप जो फसल उगाने की योजना बना रहे हैं",
      daysToHarvest: "कटाई तक के दिन",
      daysToHarvestHelp: "रोपण से कटाई तक अपेक्षित दिन",
      
      // Soil types
      sandy: "रेतीली (Sandy)",
      clay: "चिकनी मिट्टी (Clay)",
      loam: "दोमट मिट्टी (Loam)",
      silt: "गाद मिट्टी (Silt)",
      peaty: "पीटी मिट्टी (Peaty)",
      chalky: "चूना मिट्टी (Chalky)",
      selectSoilType: "मिट्टी का प्रकार चुनें",
      
      // Crop types
      cotton: "कपास (Cotton)",
      rice: "धान (Rice)",
      barley: "जौ (Barley)",
      soybean: "सोयाबीन (Soybean)",
      wheat: "गेहूं (Wheat)",
      maize: "मक्का (Maize)",
      selectCrop: "फसल चुनें",
      
      // Step 2
      environmentTitle: "पर्यावरण स्थितियां",
      environmentDescription: "जलवायु और मौसम की स्थितियों के बारे में जानकारी प्रदान करें।",
      rainfall: "वर्षा (मिमी)",
      rainfallHelp: "मिलीमीटर में औसत मासिक वर्षा",
      temperature: "तापमान (°C)",
      temperatureHelp: "सेल्सियस में औसत दैनिक तापमान",
      weatherCondition: "मौसम की स्थिति",
      weatherHelp: "बढ़ते मौसम के दौरान प्रमुख मौसम पैटर्न",
      
      // Weather types
      cloudy: "बादल (Cloudy)",
      rainy: "बारिश (Rainy)",
      sunny: "धूप (Sunny)",
      selectWeather: "मौसम की स्थिति चुनें",
      
      // Step 3
      farmingPracticesTitle: "खेती की प्रथाएँ",
      farmingPracticesDescription: "हमें बताएं कि आप कौन सी कृषि तकनीकें अपना रहे हैं।",
      fertilizerUsage: "उर्वरक का उपयोग",
      fertilizerHelp: "क्या आप उर्वरकों का उपयोग कर रहे हैं",
      irrigationSystem: "सिंचाई प्रणाली",
      irrigationHelp: "क्या आप सिंचाई प्रणाली का उपयोग कर रहे हैं",
      yes: "हां",
      no: "नहीं",
      
      // Navigation
      next: "अगला",
      back: "पीछे",
      predictYield: "उपज का अनुमान लगाएं",
      processing: "प्रोसेसिंग...",
      startNew: "नया अनुमान शुरू करें",
      tryAgain: "पुनः प्रयास करें",
      
      // Results
      resultsTitle: "उपज अनुमान परिणाम",
      resultsDescription: "प्रदान किए गए डेटा के आधार पर अपनी फसल उपज अनुमान देखें।",
      resultComplete: "उपज अनुमान पूर्ण",
      tonsPerHectare: "टन/हेक्टेयर",
      crop: "फसल",
      soil: "मिट्टी",
      growth: "विकास",
      days: "दिन",
      resultTip: "आपके इनपुट के आधार पर, हम आपकी {crop} फसल के लिए इस उपज का अनुमान लगाते हैं। वास्तविक उपज इस मॉडल में शामिल न किए गए अतिरिक्त कारकों के आधार पर भिन्न हो सकती है।",
      errorTitle: "त्रुटि",
      errorTip: "कृपया अपने इनपुट की जांच करें और पुनः प्रयास करें। यदि समस्या बनी रहती है, तो हमारा सर्वर समस्याओं का अनुभव कर रहा हो सकता है।",
      
      // Info card
      infoTitle: "फसल उपज को प्रभावित करने वाले कारकों को समझना",
      soilTypeInfo: "मिट्टी का प्रकार",
      soilTypeDescription: "विभिन्न फसलें विभिन्न प्रकार की मिट्टी में पनपती हैं। दोमट मिट्टी को आमतौर पर अधिकांश फसलों के लिए इष्टतम माना जाता है।",
      weatherInfo: "मौसम की स्थितियां",
      weatherDescription: "मौसम पैटर्न फसल विकास पर महत्वपूर्ण प्रभाव डालते हैं। सुसंगत स्थितियां आमतौर पर बेहतर उपज देती हैं।",
      fertilizerInfo: "उर्वरक का उपयोग",
      fertilizerDescription: "फसलों को आवश्यक पोषक तत्व प्रदान करके उचित उर्वरण उपज को 30-50% तक बढ़ा सकता है।",
      irrigationInfo: "सिंचाई",
      irrigationDescription: "निरंतर सिंचाई वर्षा पर निर्भरता कम करती है और शुष्क क्षेत्रों में उपज में नाटकीय रूप से सुधार कर सकती है।"
    }
  }

  const t = isHindi ? translations.hindi : translations.english

  // Debug log to track state changes
  useEffect(() => {
    console.log("Current step:", step);
    console.log("Prediction:", prediction);
    console.log("Error:", error);
  }, [step, prediction, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setValidationError(null) // Clear validation errors when user makes changes
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null) // Reset prediction before new request
    
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(`${import.meta.env.VITE_YIELD_API}/predict_yield`, formData);
      console.log("API response:", response.data);
      
      if (response.data && response.data.prediction) {
        setPrediction(response.data.prediction)
        // Force step update to 4 directly instead of using nextStep function
        setStep(4)
      } else {
        throw new Error("Invalid response format from API")
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || err.message || 'An error occurred')
      // Stay on step 3 when there's an error
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        if (!formData.soil_type || !formData.crop || !formData.days_to_harvest) {
          setValidationError(t.validationErrorMessage)
          return false
        }
        break
      case 2:
        if (!formData.rainfall || !formData.temperature || !formData.weather) {
          setValidationError(t.validationErrorMessage)
          return false
        }
        break
      case 3:
        // All fields in step 3 have default values, so validation always passes
        return true
      default:
        return true
    }
    
    setValidationError(null)
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      console.log("Moving to next step:", step + 1);
      setStep(prevStep => prevStep + 1)
    }
  }

  const prevStep = () => {
    setStep(prevStep => prevStep - 1)
  }

  const restartForm = () => {
    setPrediction(null)
    setError(null)
    setStep(1)
  }

  // Helper to get crop name in current language
  const getLocalizedCropName = (cropName) => {
    const cropTranslations = {
      "Cotton": isHindi ? "कपास" : "Cotton",
      "Rice": isHindi ? "धान" : "Rice", 
      "Barley": isHindi ? "जौ" : "Barley",
      "Soybean": isHindi ? "सोयाबीन" : "Soybean",
      "Wheat": isHindi ? "गेहूं" : "Wheat",
      "Maize": isHindi ? "मक्का" : "Maize"
    };
    
    return cropTranslations[cropName] || cropName;
  };

  return (
    <div className="yield-form-container">
      <div className="form-card">
        <div className="form-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">{t.stepCropInfo}</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">{t.stepEnvironment}</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">{t.stepFarmingPractices}</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">{t.stepResults}</div>
          </div>
        </div>

        {validationError && (
          <div className="validation-alert">
            <span className="alert-icon">!</span>
            {validationError}
          </div>
        )}

        {/* Debug info - remove in production */}
        <div className="debug-info" style={{display: 'none'}}>
          Current Step: {step} | Has Prediction: {prediction ? 'Yes' : 'No'} | Has Error: {error ? 'Yes' : 'No'}
        </div>

        <form onSubmit={handleSubmit} className="form">
          {step === 1 && (
            <div className="form-step">
              <h2 className="form-title">{t.cropInfoTitle}</h2>
              <p className="form-description">
                {t.cropInfoDescription}
              </p>
              
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="soil_type">
                    {t.soilType} <span className="required">*</span>
                  </label>
                  <select
                    id="soil_type"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>{t.selectSoilType}</option>
                    <option value="Sandy">{t.sandy}</option>
                    <option value="Clay">{t.clay}</option>
                    <option value="Loam">{t.loam}</option>
                    <option value="Silt">{t.silt}</option>
                    <option value="Peaty">{t.peaty}</option>
                    <option value="Chalky">{t.chalky}</option>
                  </select>
                  <small className="input-help">{t.soilTypeHelp}</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="crop">
                    {t.cropType} <span className="required">*</span>
                  </label>
                  <select
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>{t.selectCrop}</option>
                    <option value="Cotton">{t.cotton}</option>
                    <option value="Rice">{t.rice}</option>
                    <option value="Barley">{t.barley}</option>
                    <option value="Soybean">{t.soybean}</option>
                    <option value="Wheat">{t.wheat}</option>
                    <option value="Maize">{t.maize}</option>
                  </select>
                  <small className="input-help">{t.cropTypeHelp}</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="days_to_harvest">
                    {t.daysToHarvest} <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="days_to_harvest"
                    name="days_to_harvest"
                    value={formData.days_to_harvest}
                    onChange={handleChange}
                    placeholder="60-150"
                    required
                  />
                  <small className="input-help">{t.daysToHarvestHelp}</small>
                </div>
              </div>
              
              <div className="form-nav">
                <div></div> {/* Empty div for spacing */}
                <button type="button" className="btn-next" onClick={nextStep}>
                  {t.next} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="form-step">
              <h2 className="form-title">{t.environmentTitle}</h2>
              <p className="form-description">
                {t.environmentDescription}
              </p>
              
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="rainfall">
                    {t.rainfall} <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="0-500"
                    required
                  />
                  <small className="input-help">{t.rainfallHelp}</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="temperature">
                    {t.temperature} <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="10-40"
                    required
                  />
                  <small className="input-help">{t.temperatureHelp}</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="weather">
                    {t.weatherCondition} <span className="required">*</span>
                  </label>
                  <select
                    id="weather"
                    name="weather"
                    value={formData.weather}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>{t.selectWeather}</option>
                    <option value="Cloudy">{t.cloudy}</option>
                    <option value="Rainy">{t.rainy}</option>
                    <option value="Sunny">{t.sunny}</option>
                  </select>
                  <small className="input-help">{t.weatherHelp}</small>
                </div>
              </div>
              
              <div className="form-nav">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <span className="arrow">←</span> {t.back}
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  {t.next} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="form-step">
              <h2 className="form-title">{t.farmingPracticesTitle}</h2>
              <p className="form-description">
                {t.farmingPracticesDescription}
              </p>
              
              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="fertilizer">{t.fertilizerUsage}</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="fertilizer-yes"
                        name="fertilizer"
                        value="Yes"
                        checked={formData.fertilizer === "Yes"}
                        onChange={handleChange}
                      />
                      <label htmlFor="fertilizer-yes">{t.yes}</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="fertilizer-no"
                        name="fertilizer"
                        value="No"
                        checked={formData.fertilizer === "No"}
                        onChange={handleChange}
                      />
                      <label htmlFor="fertilizer-no">{t.no}</label>
                    </div>
                  </div>
                  <small className="input-help">{t.fertilizerHelp}</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="irrigation">{t.irrigationSystem}</label>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="irrigation-yes"
                        name="irrigation"
                        value="Yes"
                        checked={formData.irrigation === "Yes"}
                        onChange={handleChange}
                      />
                      <label htmlFor="irrigation-yes">{t.yes}</label>
                    </div>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="irrigation-no"
                        name="irrigation"
                        value="No"
                        checked={formData.irrigation === "No"}
                        onChange={handleChange}
                      />
                      <label htmlFor="irrigation-no">{t.no}</label>
                    </div>
                  </div>
                  <small className="input-help">{t.irrigationHelp}</small>
                </div>
              </div>
              
              <div className="form-nav">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <span className="arrow">←</span> {t.back}
                </button>
                <button 
                  type="submit"
                  className={`btn-submit ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? t.processing : t.predictYield}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step result-step">
              <h2 className="form-title">{t.resultsTitle}</h2>
              <p className="form-description">
                {t.resultsDescription}
              </p>
              
              {prediction && (
                <div className="result success">
                  <div className="result-header">
                    <h3>{t.resultComplete}</h3>
                    <span className="result-icon">✓</span>
                  </div>
                  <div className="prediction-result">
                    <div className="prediction-value">{prediction}</div>
                    <div className="prediction-unit">{t.tonsPerHectare}</div>
                  </div>
                  <div className="prediction-details">
                    <div className="detail-item">
                      <div className="detail-label">{t.crop}</div>
                      <div className="detail-value">{getLocalizedCropName(formData.crop)}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">{t.soil}</div>
                      <div className="detail-value">{formData.soil_type}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">{t.growth}</div>
                      <div className="detail-value">{formData.days_to_harvest} {t.days}</div>
                    </div>
                  </div>
                  <div className="prediction-more-details">
                    <div className="detail-row">
                      <span className="detail-key">{t.temperature}:</span>
                      <span className="detail-value">{formData.temperature}°C</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key">{t.rainfall}:</span>
                      <span className="detail-value">{formData.rainfall} mm</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key">{t.weatherCondition}:</span>
                      <span className="detail-value">{formData.weather}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key">{t.fertilizerUsage}:</span>
                      <span className="detail-value">{formData.fertilizer === "Yes" ? t.yes : t.no}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key">{t.irrigationSystem}:</span>
                      <span className="detail-value">{formData.irrigation === "Yes" ? t.yes : t.no}</span>
                    </div>
                  </div>
                  <p className="result-tip">
                    {t.resultTip.replace('{crop}', getLocalizedCropName(formData.crop))}
                  </p>
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
                </div>
              )}
              
              <div className="form-nav">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <span className="arrow">←</span> {t.back}
                </button>
                <button type="button" className="btn-restart" onClick={restartForm}>
                  {t.startNew}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="info-card">
        <h3>{t.infoTitle}</h3>
        <div className="info-item">
          <h4>{t.soilTypeInfo}</h4>
          <p>{t.soilTypeDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.weatherInfo}</h4>
          <p>{t.weatherDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.fertilizerInfo}</h4>
          <p>{t.fertilizerDescription}</p>
        </div>
        <div className="info-item">
          <h4>{t.irrigationInfo}</h4>
          <p>{t.irrigationDescription}</p>
        </div>
      </div>

      {/* Add the styling */}
      <style>{`
        .yield-form-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (min-width: 992px) {
          .yield-form-container {
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

        .debug-info {
          background-color: #f8f9fa;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        .validation-alert {
          background-color: #fffbeb;
          border: 1px solid #fbbf24;
          color: #92400e;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: shake 0.5s ease-in-out;
        }

        .alert-icon {
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        
        .form-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #e2e8f0;
          color: #a0aec0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .progress-step.active .step-number {
          background-color: #2f855a;
          color: white;
        }
        
        .step-label {
          font-size: 0.875rem;
          color: #718096;
          transition: all 0.3s ease;
        }
        
        .progress-step.active .step-label {
          color: #2f855a;
          font-weight: 500;
        }
        
        .progress-line {
          flex-grow: 1;
          height: 2px;
          background-color: #e2e8f0;
          margin: 0 0.5rem;
        }
        
        .form-title {
          font-size: 1.75rem;
          color: #2f855a;
          margin-bottom: 0.5rem;
        }
        
        .form-description {
          color: #4a5568;
          margin-bottom: 1.5rem;
        }
        
        .form-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .result-step {
          animation: fadeIn 0.5s ease-out;
        }
        
        @media (min-width: 640px) {
          .form-fields {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
        
        .form-group {
          margin-bottom: 0.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }

        .required {
          color: #e53e3e;
          margin-left: 2px;
        }
        
        input, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #f7fafc;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #2f855a;
          box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
          background-color: white;
        }
        
        .radio-group {
          display: flex;
          gap: 1rem;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
        }
        
        .radio-option input {
          width: auto;
          margin-right: 0.5rem;
        }
        
        .radio-option label {
          margin: 0;
        }
        
        .input-help {
          display: block;
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.25rem;
        }
        
        .form-nav {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        
        .btn-prev, .btn-next, .btn-submit, .btn-restart {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-prev {
          background-color: #edf2f7;
          color: #4a5568;
          border: none;
        }
        
        .btn-prev:hover {
          background-color: #e2e8f0;
        }
        
        .btn-next {
          background-color: #2f855a;
          color: white;
          border: none;
        }
        
        .btn-next:hover {
          background-color: #276749;
        }
        
        .btn-submit {
          background-color: #2f855a;
          color: white;
          border: none;
        }
        
        .btn-submit:hover {
          background-color: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn-submit.loading {
          background-color: #9ae6b4;
          cursor: not-allowed;
        }

        .btn-restart {
          background-color: #4299e1;
          color: white;
          border: none;
        }

        .btn-restart:hover {
          background-color: #3182ce;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .arrow {
          font-size: 1.25rem;
        }
        
        .result {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 1.5rem;
          border-radius: 8px;
          animation: fadeIn 0.5s ease;
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
        
        .prediction-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1.5rem 0;
        }
        
        .prediction-value {
          font-size: 3rem;
          font-weight: 700;
          color: #2f855a;
        }
        
        .prediction-unit {
          font-size: 1.25rem;
          color: #718096;
        }
        
        .prediction-details {
          display: flex;
          justify-content: space-around;
          margin: 1.5rem 0;
          background-color: #e6fffa;
          padding: 1rem;
          border-radius: 8px;
        }

        .prediction-more-details {
          background-color: #f0fff4;
          border-radius: 8px;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #c6f6d5;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-key {
          font-weight: 500;
          color: #4a5568;
        }

        .detail-item {
          text-align: center;
        }
        
        .detail-label {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          font-weight: 600;
          color: #2d3748;
        }
        
        .result-tip {
          font-size: 0.875rem;
          color: #718096;
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
          .form-progress {
            margin-bottom: 1.5rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
          
          .prediction-details {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default YieldForm
  
