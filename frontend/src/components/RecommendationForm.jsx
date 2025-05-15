// import { useState, useEffect, useContext } from 'react'
// import axios from 'axios'
// import { LanguageContext } from '../context/LanguageContext'

// function RecommendationForm() {
//   const { language, isHindi } = useContext(LanguageContext);

//   const [formData, setFormData] = useState({
//     N: '',
//     P: '',
//     K: '',
//     temperature: '',
//     humidity: '',
//     ph: '',
//     rainfall: ''
//   })
//   const [prediction, setPrediction] = useState(null)
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [validationErrors, setValidationErrors] = useState({})
//   const [showResults, setShowResults] = useState(false)

//   // Translations
//   const translations = {
//     english: {
//       // Form titles
//       formTitle: "Crop Recommendation",
//       formDescription: "Enter your soil and climate data to get AI-powered crop recommendations.",

//       // Validation
//       validationHeader: "Please fix the following errors:",

//       // Input fields
//       nitrogen: "Nitrogen (N)",
//       phosphorus: "Phosphorus (P)",
//       potassium: "Potassium (K)",
//       temperature: "Temperature",
//       humidity: "Humidity",
//       ph: "pH",
//       rainfall: "Rainfall",

//       // Units
//       mgkg: "mg/kg",
//       celsius: "°C",
//       percent: "%",
//       mm: "mm",

//       // Ranges
//       nitrogenRange: "Typical range: 0-140 mg/kg",
//       phosphorusRange: "Typical range: 5-145 mg/kg",
//       potassiumRange: "Typical range: 5-205 mg/kg",
//       temperatureRange: "Typical range: 8-45 °C",
//       humidityRange: "Typical range: 14-100%",
//       phRange: "Typical range: 3.5-10",
//       rainfallRange: "Typical range: 20-300 mm",

//       // Buttons
//       submitButton: "Get Recommendation",
//       processingButton: "Processing...",
//       startNewButton: "Start New Recommendation",
//       tryAgainButton: "Try Again",

//       // Results
//       recommendationTitle: "Recommendation",
//       recommendationMessage: "Based on your input, we recommend growing:",
//       parametersTitle: "Your Soil & Climate Parameters:",
//       resultTip: "This crop is well-suited to your soil nutrients and climate conditions. For optimal results, follow recommended agricultural practices for {crop}.",
//       errorTitle: "Error",
//       errorTip: "Please check your inputs and try again. If the problem persists, our server may be experiencing issues.",

//       // Parameter labels
//       nitrogenLabel: "Nitrogen:",
//       phosphorusLabel: "Phosphorus:",
//       potassiumLabel: "Potassium:",
//       temperatureLabel: "Temperature:",
//       humidityLabel: "Humidity:",
//       phLabel: "pH Level:",
//       rainfallLabel: "Rainfall:",

//       // Info card
//       infoTitle: "Understanding Soil Parameters",
//       nitrogenInfo: "Nitrogen (N)",
//       nitrogenDescription: "Essential for leaf growth and protein formation. Deficiency causes yellowing of leaves and stunted growth.",
//       phosphorusInfo: "Phosphorus (P)",
//       phosphorusDescription: "Important for root development, flowering, and seed formation. Deficiency stunts growth and reduces yields.",
//       potassiumInfo: "Potassium (K)",
//       potassiumDescription: "Helps in overall health of the plant by strengthening cell walls. Deficiency causes weak stems and poor disease resistance.",
//       phInfo: "pH Level",
//       phDescription: "Measures soil acidity or alkalinity on a scale of 0-14. Most crops prefer a slightly acidic to neutral pH (6.0-7.0).",
//       climateInfo: "Climate Factors",
//       climateDescription: "Temperature, humidity, and rainfall significantly impact crop growth cycles and productivity. Different crops have different optimal conditions."
//     },
//     hindi: {
//       // Form titles
//       formTitle: "फसल अनुशंसा",
//       formDescription: "AI-संचालित फसल अनुशंसाएं प्राप्त करने के लिए अपनी मिट्टी और जलवायु डेटा दर्ज करें।",

//       // Validation
//       validationHeader: "कृपया निम्नलिखित त्रुटियों को ठीक करें:",

//       // Input fields
//       nitrogen: "नाइट्रोजन (N)",
//       phosphorus: "फॉस्फोरस (P)",
//       potassium: "पोटैशियम (K)",
//       temperature: "तापमान",
//       humidity: "आर्द्रता",
//       ph: "पीएच (pH)",
//       rainfall: "वर्षा",

//       // Units
//       mgkg: "मि.ग्रा./कि.ग्रा.",
//       celsius: "°C",
//       percent: "%",
//       mm: "मिमी",

//       // Ranges
//       nitrogenRange: "सामान्य सीमा: 0-140 मि.ग्रा./कि.ग्रा.",
//       phosphorusRange: "सामान्य सीमा: 5-145 मि.ग्रा./कि.ग्रा.",
//       potassiumRange: "सामान्य सीमा: 5-205 मि.ग्रा./कि.ग्रा.",
//       temperatureRange: "सामान्य सीमा: 8-45 °C",
//       humidityRange: "सामान्य सीमा: 14-100%",
//       phRange: "सामान्य सीमा: 3.5-10",
//       rainfallRange: "सामान्य सीमा: 20-300 मिमी",

//       // Buttons
//       submitButton: "अनुशंसा प्राप्त करें",
//       processingButton: "प्रोसेसिंग...",
//       startNewButton: "नई अनुशंसा शुरू करें",
//       tryAgainButton: "पुनः प्रयास करें",

//       // Results
//       recommendationTitle: "अनुशंसा",
//       recommendationMessage: "आपके इनपुट के आधार पर, हम निम्न को उगाने की अनुशंसा करते हैं:",
//       parametersTitle: "आपके मिट्टी और जलवायु पैरामीटर:",
//       resultTip: "यह फसल आपकी मिट्टी के पोषक तत्वों और जलवायु परिस्थितियों के लिए उपयुक्त है। सर्वोत्तम परिणामों के लिए, {crop} के लिए अनुशंसित कृषि प्रथाओं का पालन करें।",
//       errorTitle: "त्रुटि",
//       errorTip: "कृपया अपने इनपुट की जांच करें और पुनः प्रयास करें। यदि समस्या बनी रहती है, तो हमारा सर्वर समस्याओं का अनुभव कर रहा हो सकता है।",

//       // Parameter labels
//       nitrogenLabel: "नाइट्रोजन:",
//       phosphorusLabel: "फॉस्फोरस:",
//       potassiumLabel: "पोटैशियम:",
//       temperatureLabel: "तापमान:",
//       humidityLabel: "आर्द्रता:",
//       phLabel: "पीएच स्तर:",
//       rainfallLabel: "वर्षा:",

//       // Info card
//       infoTitle: "मिट्टी के पैरामीटर को समझना",
//       nitrogenInfo: "नाइट्रोजन (N)",
//       nitrogenDescription: "पत्ती की वृद्धि और प्रोटीन निर्माण के लिए आवश्यक। कमी से पत्तियों का पीला होना और विकास रुकना होता है।",
//       phosphorusInfo: "फॉस्फोरस (P)",
//       phosphorusDescription: "जड़ विकास, फूल आने और बीज निर्माण के लिए महत्वपूर्ण। कमी से विकास रुकता है और उपज कम होती है।",
//       potassiumInfo: "पोटैशियम (K)",
//       potassiumDescription: "सेल दीवारों को मजबूत करके पौधे के समग्र स्वास्थ्य में मदद करता है। कमी से कमजोर तने और खराब रोग प्रतिरोध होता है।",
//       phInfo: "पीएच स्तर",
//       phDescription: "0-14 के पैमाने पर मिट्टी की अम्लता या क्षारीयता को मापता है। अधिकांश फसलें थोड़ी अम्लीय से तटस्थ पीएच (6.0-7.0) पसंद करती हैं।",
//       climateInfo: "जलवायु कारक",
//       climateDescription: "तापमान, आर्द्रता और वर्षा फसल विकास चक्र और उत्पादकता पर महत्वपूर्ण प्रभाव डालते हैं। विभिन्न फसलों की अलग-अलग इष्टतम स्थितियां होती हैं।"
//     }
//   };

//   const t = isHindi ? translations.hindi : translations.english;

//   // Parameter ranges for validation
//   const paramRanges = {
//     N: { min: 0, max: 140, name: isHindi ? "नाइट्रोजन" : "Nitrogen" },
//     P: { min: 5, max: 145, name: isHindi ? "फॉस्फोरस" : "Phosphorus" },
//     K: { min: 5, max: 205, name: isHindi ? "पोटैशियम" : "Potassium" },
//     temperature: { min: 8, max: 45, name: isHindi ? "तापमान" : "Temperature" },
//     humidity: { min: 14, max: 100, name: isHindi ? "आर्द्रता" : "Humidity" },
//     ph: { min: 3.5, max: 10, name: isHindi ? "पीएच" : "pH" },
//     rainfall: { min: 20, max: 300, name: isHindi ? "वर्षा" : "Rainfall" }
//   }

//   // Reset validation errors when form changes
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })

//     // Clear the specific validation error when field is changed
//     if (validationErrors[name]) {
//       const newErrors = { ...validationErrors }
//       delete newErrors[name]
//       setValidationErrors(newErrors)
//     }
//   }

//   // Validate form before submission
//   const validateForm = () => {
//     const errors = {}

//     Object.entries(formData).forEach(([key, value]) => {
//       const range = paramRanges[key]

//       // Check if field is empty
//       if (!value) {
//         errors[key] = isHindi 
//           ? `${range.name} आवश्यक है` 
//           : `${range.name} is required`
//         return
//       }

//       // Check if value is within valid range
//       const numValue = parseFloat(value)
//       if (isNaN(numValue)) {
//         errors[key] = isHindi 
//           ? `${range.name} एक संख्या होनी चाहिए` 
//           : `${range.name} must be a number`
//       } else if (numValue < range.min || numValue > range.max) {
//         errors[key] = isHindi 
//           ? `${range.name} ${range.min} और ${range.max} के बीच होना चाहिए` 
//           : `${range.name} should be between ${range.min} and ${range.max}`
//       }
//     })

//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Validate form before proceeding
//     if (!validateForm()) {
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setPrediction(null)

//     try {
//       const response = await axios.post('http://localhost:5002/predict_crop', formData)
//       setPrediction(response.data.crop)
//       setShowResults(true)
//     } catch (err) {
//       setError(err.response?.data?.error || 'An error occurred while processing your request')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       N: '',
//       P: '',
//       K: '',
//       temperature: '',
//       humidity: '',
//       ph: '',
//       rainfall: ''
//     })
//     setPrediction(null)
//     setError(null)
//     setShowResults(false)
//     setValidationErrors({})
//   }

//   // Get visual cue class for input fields
//   const getInputClass = (fieldName) => {
//     if (!formData[fieldName]) return ''
//     if (validationErrors[fieldName]) return 'input-error'
//     return 'input-valid'
//   }

//   // Get localized crop name
//   const getLocalizedCropName = (cropName) => {
//     if (!isHindi) return cropName;

//     const cropTranslations = {
//       "rice": "चावल (Rice)",
//       "maize": "मक्का (Maize)",
//       "chickpea": "चना (Chickpea)",
//       "kidneybeans": "राजमा (Kidney Beans)",
//       "pigeonpeas": "अरहर दाल (Pigeon Peas)",
//       "mothbeans": "मोठ बीन्स (Moth Beans)",
//       "mungbean": "मूंग (Mung Bean)",
//       "blackgram": "उड़द (Black Gram)",
//       "lentil": "मसूर (Lentil)",
//       "pomegranate": "अनार (Pomegranate)",
//       "banana": "केला (Banana)",
//       "mango": "आम (Mango)",
//       "grapes": "अंगूर (Grapes)",
//       "watermelon": "तरबूज (Watermelon)",
//       "muskmelon": "खरबूजा (Muskmelon)",
//       "apple": "सेब (Apple)",
//       "orange": "संतरा (Orange)",
//       "papaya": "पपीता (Papaya)",
//       "coconut": "नारियल (Coconut)",
//       "cotton": "कपास (Cotton)",
//       "jute": "जूट (Jute)",
//       "coffee": "कॉफी (Coffee)"
//     };

//     // Return the translation or original name if translation not found
//     return cropTranslations[cropName.toLowerCase()] || cropName;
//   };

//   return (
//     <div className="recommendation-form-container">
//       <div className="form-card">
//         <h2 className="form-title">{t.formTitle}</h2>
//         <p className="form-description">
//           {t.formDescription}
//         </p>

//         {Object.keys(validationErrors).length > 0 && (
//           <div className="validation-summary">
//             <div className="validation-header">
//               <span className="validation-icon">!</span>
//               <h4>{t.validationHeader}</h4>
//             </div>
//             <ul className="validation-list">
//               {Object.values(validationErrors).map((error, index) => (
//                 <li key={index}>{error}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {!showResults ? (
//           <form onSubmit={handleSubmit} className="form">
//             <div className="form-grid">
//               <div className="form-group">
//                 <label htmlFor="N">
//                   {t.nitrogen} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="N"
//                   name="N"
//                   value={formData.N}
//                   onChange={handleChange}
//                   placeholder="0-140"
//                   className={getInputClass('N')}
//                   required
//                 />
//                 <small className="input-help">{t.nitrogenRange}</small>
//                 {validationErrors.N && <div className="field-error">{validationErrors.N}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="P">
//                   {t.phosphorus} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="P"
//                   name="P"
//                   value={formData.P}
//                   onChange={handleChange}
//                   placeholder="5-145"
//                                     className={getInputClass('P')}
//                   required
//                 />
//                 <small className="input-help">{t.phosphorusRange}</small>
//                 {validationErrors.P && <div className="field-error">{validationErrors.P}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="K">
//                   {t.potassium} <span className="required">*</span> <span className="unit">{t.mgkg}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="K"
//                   name="K"
//                   value={formData.K}
//                   onChange={handleChange}
//                   placeholder="5-205"
//                   className={getInputClass('K')}
//                   required
//                 />
//                 <small className="input-help">{t.potassiumRange}</small>
//                 {validationErrors.K && <div className="field-error">{validationErrors.K}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="temperature">
//                   {t.temperature} <span className="required">*</span> <span className="unit">{t.celsius}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="temperature"
//                   name="temperature"
//                   value={formData.temperature}
//                   onChange={handleChange}
//                   placeholder="8-45"
//                   className={getInputClass('temperature')}
//                   required
//                 />
//                 <small className="input-help">{t.temperatureRange}</small>
//                 {validationErrors.temperature && <div className="field-error">{validationErrors.temperature}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="humidity">
//                   {t.humidity} <span className="required">*</span> <span className="unit">{t.percent}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="humidity"
//                   name="humidity"
//                   value={formData.humidity}
//                   onChange={handleChange}
//                   placeholder="14-100"
//                   className={getInputClass('humidity')}
//                   required
//                 />
//                 <small className="input-help">{t.humidityRange}</small>
//                 {validationErrors.humidity && <div className="field-error">{validationErrors.humidity}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="ph">
//                   {t.ph} <span className="required">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="ph"
//                   name="ph"
//                   value={formData.ph}
//                   onChange={handleChange}
//                   placeholder="3.5-10"
//                   step="0.1"
//                   className={getInputClass('ph')}
//                   required
//                 />
//                 <small className="input-help">{t.phRange}</small>
//                 {validationErrors.ph && <div className="field-error">{validationErrors.ph}</div>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="rainfall">
//                   {t.rainfall} <span className="required">*</span> <span className="unit">{t.mm}</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="rainfall"
//                   name="rainfall"
//                   value={formData.rainfall}
//                   onChange={handleChange}
//                   placeholder="20-300"
//                   className={getInputClass('rainfall')}
//                   required
//                 />
//                 <small className="input-help">{t.rainfallRange}</small>
//                 {validationErrors.rainfall && <div className="field-error">{validationErrors.rainfall}</div>}
//               </div>
//             </div>

//             <button
//               type="submit"
//               className={`submit-button ${loading ? 'loading' : ''}`}
//               disabled={loading}
//             >
//               {loading ? t.processingButton : t.submitButton}
//             </button>
//           </form>
//         ) : (
//           <div className="results-container">
//             {prediction && (
//               <div className="result success">
//                 <div className="result-header">
//                   <h3>{t.recommendationTitle}</h3>
//                   <span className="result-icon">✓</span>
//                 </div>
//                 <p className="result-message">{t.recommendationMessage}</p>
//                 <div className="crop-result">{getLocalizedCropName(prediction)}</div>

//                 <div className="parameters-summary">
//                   <h4>{t.parametersTitle}</h4>
//                   <div className="params-grid">
//                     <div className="param-item">
//                       <span className="param-label">{t.nitrogenLabel}</span>
//                       <span className="param-value">{formData.N} {t.mgkg}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.phosphorusLabel}</span>
//                       <span className="param-value">{formData.P} {t.mgkg}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.potassiumLabel}</span>
//                       <span className="param-value">{formData.K} {t.mgkg}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.temperatureLabel}</span>
//                       <span className="param-value">{formData.temperature}{t.celsius}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.humidityLabel}</span>
//                       <span className="param-value">{formData.humidity}{t.percent}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.phLabel}</span>
//                       <span className="param-value">{formData.ph}</span>
//                     </div>
//                     <div className="param-item">
//                       <span className="param-label">{t.rainfallLabel}</span>
//                       <span className="param-value">{formData.rainfall} {t.mm}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="result-tip">
//                   {t.resultTip.replace('{crop}', getLocalizedCropName(prediction))}
//                 </p>

//                 <button 
//                   className="restart-button"
//                   onClick={resetForm}
//                 >
//                   {t.startNewButton}
//                 </button>
//               </div>
//             )}

//             {error && (
//               <div className="result error">
//                 <div className="result-header">
//                   <h3>{t.errorTitle}</h3>
//                   <span className="result-icon">!</span>
//                 </div>
//                 <p className="result-message">{error}</p>
//                 <p className="result-tip">
//                   {t.errorTip}
//                 </p>
//                 <button 
//                   className="restart-button error-restart"
//                   onClick={resetForm}
//                 >
//                   {t.tryAgainButton}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="info-card">
//         <h3>{t.infoTitle}</h3>
//         <div className="info-item">
//           <h4>{t.nitrogenInfo}</h4>
//           <p>{t.nitrogenDescription}</p>
//         </div>
//         <div className="info-item">
//           <h4>{t.phosphorusInfo}</h4>
//           <p>{t.phosphorusDescription}</p>
//         </div>
//         <div className="info-item">
//           <h4>{t.potassiumInfo}</h4>
//           <p>{t.potassiumDescription}</p>
//         </div>
//         <div className="info-item">
//           <h4>{t.phInfo}</h4>
//           <p>{t.phDescription}</p>
//         </div>
//         <div className="info-item">
//           <h4>{t.climateInfo}</h4>
//           <p>{t.climateDescription}</p>
//         </div>
//       </div>

//       {/* Add the styling */}
//       <style>{`
//         .recommendation-form-container {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 2rem;
//           max-width: 1200px;
//           margin: 0 auto;
//         }

//         @media (min-width: 992px) {
//           .recommendation-form-container {
//             grid-template-columns: 3fr 2fr;
//           }
//         }

//         .form-card {
//           background-color: white;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           padding: 2rem;
//           position: relative;
//           overflow: hidden;
//         }

//         .form-card::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 8px;
//           background: linear-gradient(to right, #2f855a, #48bb78);
//         }

//         .form-title {
//           font-size: 1.75rem;
//           color: #2f855a;
//           margin-bottom: 0.5rem;
//         }

//         .form-description {
//           color: #4a5568;
//           margin-bottom: 2rem;
//         }

//         .required {
//           color: #e53e3e;
//           margin-left: 2px;
//         }

//         .validation-summary {
//           background-color: #fffbeb;
//           border: 1px solid #fbbf24;
//           border-radius: 8px;
//           padding: 1rem;
//           margin-bottom: 1.5rem;
//           animation: shake 0.5s ease-in-out;
//         }

//         .validation-header {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 0.5rem;
//         }

//         .validation-header h4 {
//           margin: 0;
//           color: #92400e;
//           font-size: 1rem;
//         }

//         .validation-icon {
//           background-color: #fbbf24;
//           color: white;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 14px;
//         }

//         .validation-list {
//           margin: 0;
//           padding-left: 1.5rem;
//           color: #92400e;
//         }

//         .validation-list li {
//           margin-bottom: 0.25rem;
//         }

//         .field-error {
//           color: #e53e3e;
//           font-size: 0.75rem;
//           margin-top: 0.25rem;
//         }

//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           50% { transform: translateX(5px); }
//           75% { transform: translateX(-5px); }
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 1.5rem;
//         }

//         .form-group {
//           margin-bottom: 1rem;
//         }

//         label {
//           display: block;
//           margin-bottom: 0.5rem;
//           font-weight: 500;
//           color: #2d3748;
//         }

//         .unit {
//           font-size: 0.85rem;
//           color: #718096;
//           font-weight: normal;
//         }

//         input {
//           width: 100%;
//           padding: 0.75rem;
//           border: 1px solid #e2e8f0;
//           border-radius: 8px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           background-color: #f7fafc;
//         }

//         input:focus {
//           outline: none;
//           border-color: #2f855a;
//           box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
//           background-color: white;
//         }

//         .input-error {
//           border-color: #e53e3e;
//           background-color: #fff5f5;
//         }

//         .input-error:focus {
//           border-color: #e53e3e;
//           box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
//         }

//         .input-valid {
//           border-color: #48bb78;
//           background-color: #f0fff4;
//         }

//         .input-valid:focus {
//           border-color: #48bb78;
//           box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
//         }

//         .input-help {
//           display: block;
//           font-size: 0.75rem;
//           color: #718096;
//           margin-top: 0.25rem;
//         }

//         .submit-button {
//           display: block;
//           width: 100%;
//           padding: 0.875rem;
//           margin-top: 1.5rem;
//           background-color: #2f855a;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .submit-button:hover {
//           background-color: #276749;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }

//         .submit-button.loading {
//           background-color: #9ae6b4;
//           cursor: not-allowed;
//         }

//         .results-container {
//           animation: fadeIn 0.5s ease;
//         }

//         .result {
//           margin-top: 1rem;
//           padding: 1.5rem;
//           border-radius: 8px;
//         }

//         .result.success {
//           background-color: #f0fff4;
//           border: 1px solid #c6f6d5;
//         }

//         .result.error {
//           background-color: #fff5f5;
//           border: 1px solid #fed7d7;
//         }

//         .result-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }

//         .result-header h3 {
//           font-size: 1.25rem;
//           color: #2d3748;
//           margin: 0;
//         }

//         .result-icon {
//           width: 30px;
//           height: 30px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           font-weight: bold;
//         }

//         .success .result-icon {
//           background-color: #c6f6d5;
//           color: #2f855a;
//         }

//         .error .result-icon {
//           background-color: #fed7d7;
//           color: #c53030;
//         }

//         .result-message {
//           margin-bottom: 0.75rem;
//           font-weight: 500;
//         }

//         .crop-result {
//           font-size: 1.75rem;
//           font-weight: 700;
//           color: #2f855a;
//           text-align: center;
//           padding: 1rem;
//           margin: 1rem 0;
//           background-color: #e6fffa;
//           border-radius: 8px;
//         }

//         .parameters-summary {
//           background-color: #f7fafc;
//           border-radius: 8px;
//           padding: 1rem;
//           margin: 1.5rem 0;
//         }

//         .parameters-summary h4 {
//           margin-top: 0;
//           margin-bottom: 1rem;
//           color: #4a5568;
//           font-size: 1rem;
//         }

//         .params-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//           gap: 0.75rem;
//         }

//         .param-item {
//           display: flex;
//           flex-direction: column;
//         }

//         .param-label {
//           font-size: 0.8rem;
//           color: #718096;
//         }

//         .param-value {
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .result-tip {
//           font-size: 0.875rem;
//           color: #718096;
//           margin-top: 1.5rem;
//         }

//         .restart-button {
//           display: block;
//           width: 100%;
//           padding: 0.875rem;
//           margin-top: 1.5rem;
//           background-color: #4299e1;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .restart-button:hover {
//           background-color: #3182ce;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }

//         .error-restart {
//           background-color: #f56565;
//         }

//         .error-restart:hover {
//           background-color: #e53e3e;
//         }

//         .info-card {
//           background-color: white;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           padding: 2rem;
//         }

//         .info-card h3 {
//           color: #2f855a;
//           margin-bottom: 1.5rem;
//           font-size: 1.25rem;
//         }

//         .info-item {
//           margin-bottom: 1.25rem;
//         }

//         .info-item h4 {
//           color: #4a5568;
//           margin-bottom: 0.5rem;
//           font-size: 1rem;
//         }

//         .info-item p {
//           color: #718096;
//           font-size: 0.95rem;
//           line-height: 1.5;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @media (max-width: 768px) {
//           .params-grid {
//             grid-template-columns: 1fr 1fr;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default RecommendationForm
import { useState, useEffect, useContext, useRef } from 'react'
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
  const [isChatbotLoading, setIsChatbotLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [alternatives, setAlternatives] = useState([])
  const [insights, setInsights] = useState({})
  const insightsRef = useRef(null)
  
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
      climateDescription: "Temperature, humidity, and rainfall significantly impact crop growth cycles and productivity. Different crops have different optimal conditions.",
      
      // Chatbot translations
      insightsTitle: "Smart Insights for {crop}",
      alternativeCropsTitle: "Alternative Crops",
      alternativeCropsSubtitle: "You can also consider:",
      loadingInsights: "Analyzing your data...",
      assetRequirements: "Asset Requirements",
      profitMargin: "Profit",
      marketDemand: "Demand",
      growthDifficulty: "Difficulty",
      waterNeeds: "Water Needs",
      growthTime: "Growth Time",
      bestPractices: "Best Practices",
      whatToConsider: "What to Consider",
      seeMoreAbout: "Ask me about:",
      optionProfitability: "Which is more profitable?",
      optionEasier: "Which is easier to grow?",
      optionDemand: "Market demand comparison",
      optionDiseases: "Common diseases & prevention",
      optionHarvesting: "Harvesting techniques",
      optionStorage: "Storage requirements",
      backToOptions: "Back to options"
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
      climateDescription: "तापमान, आर्द्रता और वर्षा फसल विकास चक्र और उत्पादकता पर महत्वपूर्ण प्रभाव डालते हैं। विभिन्न फसलों की अलग-अलग इष्टतम स्थितियां होती हैं।",
      
      // Chatbot translations
      insightsTitle: "{crop} के लिए स्मार्ट अंतर्दृष्टि",
      alternativeCropsTitle: "वैकल्पिक फसलें",
      alternativeCropsSubtitle: "आप इन पर भी विचार कर सकते हैं:",
      loadingInsights: "आपका डेटा विश्लेषण किया जा रहा है...",
      assetRequirements: "संपत्ति आवश्यकताएँ",
      profitMargin: "लाभ",
      marketDemand: "मांग",
      growthDifficulty: "कठिनाई",
      waterNeeds: "पानी की आवश्यकता",
      growthTime: "विकास समय",
      bestPractices: "सर्वोत्तम प्रथाएँ",
      whatToConsider: "क्या विचार करना है",
      seeMoreAbout: "मुझसे पूछें:",
      optionProfitability: "कौन अधिक लाभदायक है?",
      optionEasier: "कौन उगाना आसान है?",
      optionDemand: "बाजार मांग तुलना",
      optionDiseases: "सामान्य बीमारियां और रोकथाम",
      optionHarvesting: "कटाई तकनीक",
      optionStorage: "भंडारण आवश्यकताएँ",
      backToOptions: "विकल्पों पर वापस जाएं"
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

  // Auto-generate insights when prediction is set
  useEffect(() => {
    if (prediction) {
      generateInsights(prediction);
    }
  }, [prediction]);

  // Scroll to insights when they change
  useEffect(() => {
    if (insightsRef.current && Object.keys(insights).length > 0) {
      insightsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [insights]);

  // Generate crop insights using AI
  const generateInsights = async (crop) => {
    setIsChatbotLoading(true);
    try {
      // Create prompt for concise insights
      const promptData = {
        cropName: crop,
        soilData: formData,
        language: isHindi ? 'hindi' : 'english',
        date: "2025-05-14" // Current date from user's context
      };
      
      // Method 1: Try to use backend service
      try {
        const response = await fetchInsightsFromAPI(promptData);
        processInsightsResponse(response, crop);
      } catch (apiError) {
        console.warn("API error, using fallback:", apiError);
        provideFallbackInsights(crop);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      provideFallbackInsights(crop);
    } finally {
      setIsChatbotLoading(false);
    }
  };
  
  // Fetch insights from API
  const fetchInsightsFromAPI = async (promptData) => {
    // Define API-friendly prompt for quick insights
    let prompt = '';
    
    if (promptData.language === 'hindi') {
      prompt = `आज की तारीख: ${promptData.date}
वर्तमान उपयोगकर्ता: dharmendra23101

मुझे ${promptData.cropName} के लिए और इसके वैकल्पिक फसलों के लिए केवल अति-संक्षिप्त जानकारी चाहिए। मेरी मिट्टी के मापदंड हैं:
- नाइट्रोजन: ${promptData.soilData.N} मि.ग्रा./कि.ग्रा.
- फॉस्फोरस: ${promptData.soilData.P} मि.ग्रा./कि.ग्रा.
- पोटैशियम: ${promptData.soilData.K} मि.ग्रा./कि.ग्रा.
- तापमान: ${promptData.soilData.temperature}°C
- आर्द्रता: ${promptData.soilData.humidity}%
- पीएच: ${promptData.soilData.ph}
- वर्षा: ${promptData.soilData.rainfall} मिमी

निम्नलिखित जानकारी प्रदान करें:
1) मुख्य फसल (${promptData.cropName}) के लिए: लाभ, बाजार की मांग, विकास कठिनाई, पानी की जरूरतें, और विकास समय। केवल एक शब्द या बहुत छोटे वाक्यांश में उत्तर दें (उच्च/मध्यम/निम्न)।
2) तीन वैकल्पिक फसलें जो मेरी मिट्टी के लिए उपयुक्त हो सकती हैं, प्रत्येक के लिए एक संक्षिप्त कारण (5-10 शब्दों में) सहित।
3) एक छोटी सी सर्वोत्तम प्रथाओं के लिए युक्ति (15 शब्दों से कम)

फिर JSON प्रारूप में उत्तर दें। बड़ी व्याख्या या अतिरिक्त जानकारी न दें।`;
    } else {
      prompt = `Current date: ${promptData.date}
Current user: dharmendra23101

I need extremely concise information for ${promptData.cropName} and its alternative crops. My soil parameters are:
- Nitrogen: ${promptData.soilData.N} mg/kg
- Phosphorus: ${promptData.soilData.P} mg/kg
- Potassium: ${promptData.soilData.K} mg/kg
- Temperature: ${promptData.soilData.temperature}°C
- Humidity: ${promptData.soilData.humidity}%
- pH: ${promptData.soilData.ph}
- Rainfall: ${promptData.soilData.rainfall} mm

Provide the following information:
1) For the main crop (${promptData.cropName}): profit margin, market demand, growth difficulty, water needs, and growth time. Answer in just one word or very short phrase (high/medium/low).
2) Three alternative crops that might be suitable for my soil, with a brief reason (5-10 words) for each.
3) A short best practice tip (less than 15 words)

Then respond in JSON format. Do not provide lengthy explanations or additional information.

JSON format:
{
  "mainCrop": {
    "profitMargin": "high/medium/low",
    "marketDemand": "high/medium/low",
    "growthDifficulty": "high/medium/low",
    "waterNeeds": "high/medium/low",
    "growthTime": "fast/medium/slow",
    "bestPractices": "short single tip"
  },
  "alternatives": [
    {"name": "Crop 1", "reason": "very brief reason"},
    {"name": "Crop 2", "reason": "very brief reason"},
    {"name": "Crop 3", "reason": "very brief reason"}
  ]
}`;
    }
    
    try {
      // Try to use your backend API if available
      const response = await axios.post('/api/chat', {
        prompt: prompt,
        language: promptData.language,
        responseFormat: 'json'
      });
      
      return response.data;
    } catch (err) {
      // If that fails, try direct OpenRouter call (not recommended for production!)
      console.error("Backend API error:", err);
      
      const OPENROUTER_API_KEY = 'sk-or-v1-1203ae1...';  // Replace with actual key in secure way
      
      const openRouterResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "nousresearch/deephermes-3-mistral-24b-preview:free",
          messages: [
            { 
              role: "system", 
              content: "You are an agricultural expert that provides concise insights in JSON format. Keep all responses extremely brief and to the point."
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AgroLens'
          }
        }
      );
      
      if (openRouterResponse.data && 
          openRouterResponse.data.choices && 
          openRouterResponse.data.choices.length > 0) {
        try {
          // Try to parse JSON from response
          const content = openRouterResponse.data.choices[0].message.content;
          return JSON.parse(content);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          throw new Error("Invalid JSON response");
        }
      }
      
      throw new Error("Invalid response from OpenRouter");
    }
  };
  
  // Process insights response
  const processInsightsResponse = (response, crop) => {
    try {
      let parsedData;
      
      // Handle different response formats
      if (typeof response === 'string') {
        parsedData = JSON.parse(response);
      } else if (response.message) {
        // If it's from our API server with a message field
        parsedData = JSON.parse(response.message);
      } else {
        // Already parsed object
        parsedData = response;
      }
      
      // Set insights
      setInsights(parsedData.mainCrop || {});
      setAlternatives(parsedData.alternatives || []);
    } catch (error) {
      console.error("Error processing insights:", error);
      provideFallbackInsights(crop);
    }
  };
  
  // Provide fallback insights when API fails
  const provideFallbackInsights = (crop) => {
    const cropLower = crop.toLowerCase();
    let mainCropInsights = {};
    let alternativeCrops = [];
    
    // Fallback insights for common crops
    const fallbackData = {
      english: {
        rice: {
          mainCrop: {
            profitMargin: "medium",
            marketDemand: "high",
            growthDifficulty: "medium",
            waterNeeds: "high",
            growthTime: "medium",
            bestPractices: "Monitor water levels and prevent weed growth."
          },
          alternatives: [
            {name: "Wheat", reason: "Less water requirement"},
            {name: "Maize", reason: "Good for dry seasons"},
            {name: "Soybean", reason: "Adds nitrogen to soil"}
          ]
        },
        wheat: {
          mainCrop: {
            profitMargin: "medium",
            marketDemand: "high",
            growthDifficulty: "low",
            waterNeeds: "medium",
            growthTime: "medium",
            bestPractices: "Sow at optimal time, manage early weeds."
          },
          alternatives: [
            {name: "Barley", reason: "Shorter growing season"},
            {name: "Oats", reason: "Good crop rotation option"},
            {name: "Chickpea", reason: "Improves soil fertility"}
          ]
        },
        maize: {
          mainCrop: {
            profitMargin: "medium",
            marketDemand: "high",
            growthDifficulty: "low",
            waterNeeds: "medium",
            growthTime: "medium",
            bestPractices: "Ensure adequate spacing between plants."
          },
          alternatives: [
            {name: "Sunflower", reason: "Similar growth needs"},
            {name: "Sorghum", reason: "More drought resistant"},
            {name: "Millet", reason: "Good for water-limited areas"}
          ]
        },
        apple: {
          mainCrop: {
            profitMargin: "high",
            marketDemand: "high",
            growthDifficulty: "high",
            waterNeeds: "medium",
            growthTime: "slow",
            bestPractices: "Regular pruning and pest monitoring essential."
          },
          alternatives: [
            {name: "Pear", reason: "Less disease pressure"},
            {name: "Plum", reason: "Adapts to varied soils"},
            {name: "Peach", reason: "Faster to production"}
          ]
        }
      },
      hindi: {
        rice: {
          mainCrop: {
            profitMargin: "मध्यम",
            marketDemand: "उच्च",
            growthDifficulty: "मध्यम",
            waterNeeds: "उच्च",
            growthTime: "मध्यम",
            bestPractices: "जल स्तर की निगरानी करें और खरपतवार से बचें।"
          },
          alternatives: [
            {name: "गेहूँ", reason: "कम पानी की आवश्यकता"},
            {name: "मक्का", reason: "शुष्क मौसम के लिए अच्छा"},
            {name: "सोयाबीन", reason: "मिट्टी में नाइट्रोजन जोड़ता है"}
          ]
        },
        wheat: {
          mainCrop: {
            profitMargin: "मध्यम",
            marketDemand: "उच्च",
            growthDifficulty: "निम्न",
            waterNeeds: "मध्यम",
            growthTime: "मध्यम",
            bestPractices: "सही समय पर बोएं, शुरुआती खरपतवार नियंत्रित करें।"
          },
          alternatives: [
            {name: "जौ", reason: "छोटा उगाने का मौसम"},
            {name: "जई", reason: "अच्छा फसल चक्र विकल्प"},
            {name: "चना", reason: "मिट्टी की उर्वरता में सुधार"}
          ]
        },
        maize: {
          mainCrop: {
            profitMargin: "मध्यम",
            marketDemand: "उच्च",
            growthDifficulty: "निम्न",
            waterNeeds: "मध्यम",
            growthTime: "मध्यम",
            bestPractices: "पौधों के बीच पर्याप्त जगह सुनिश्चित करें।"
          },
          alternatives: [
            {name: "सूरजमुखी", reason: "समान विकास आवश्यकताएं"},
            {name: "ज्वार", reason: "अधिक सूखा प्रतिरोधी"},
            {name: "बाजरा", reason: "सीमित पानी वाले क्षेत्रों के लिए अच्छा"}
          ]
        },
        apple: {
          mainCrop: {
            profitMargin: "उच्च",
            marketDemand: "उच्च",
            growthDifficulty: "उच्च",
            waterNeeds: "मध्यम",
            growthTime: "धीमा",
            bestPractices: "नियमित छंटाई और कीट निगरानी आवश्यक।"
          },
          alternatives: [
            {name: "नाशपाती", reason: "कम रोग दबाव"},
            {name: "आलूबुखारा", reason: "विभिन्न मिट्टी में अनुकूलित"},
            {name: "आड़ू", reason: "उत्पादन तक तेज़ी से पहुंचता है"}
          ]
        }
      }
    };
    
    // Select language
    const langData = isHindi ? fallbackData.hindi : fallbackData.english;
    
    // Try to find crop-specific data or use generic
    if (langData[cropLower]) {
      mainCropInsights = langData[cropLower].mainCrop;
      alternativeCrops = langData[cropLower].alternatives;
    } else {
      // Generic fallback data
      if (isHindi) {
        mainCropInsights = {
          profitMargin: "मध्यम",
          marketDemand: "मध्यम",
          growthDifficulty: "मध्यम",
          waterNeeds: "मध्यम",
          growthTime: "मध्यम",
          bestPractices: "स्थानीय कृषि विशेषज्ञों से परामर्श करें।"
        };
        alternativeCrops = [
          {name: "गेहूँ", reason: "बहुत से मिट्टी प्रकारों में उगता है"},
          {name: "मूंग", reason: "कम संसाधनों की आवश्यकता"},
          {name: "मक्का", reason: "अच्छे मौसम में अच्छी उपज"}
        ];
      } else {
        mainCropInsights = {
          profitMargin: "medium",
          marketDemand: "medium",
          growthDifficulty: "medium",
          waterNeeds: "medium",
          growthTime: "medium",
          bestPractices: "Consult with local agricultural experts."
        };
        alternativeCrops = [
          {name: "Wheat", reason: "Grows in many soil types"},
          {name: "Mung Bean", reason: "Lower resource requirements"},
          {name: "Corn", reason: "Good yields in favorable weather"}
        ];
      }
    }
    
    setInsights(mainCropInsights);
    setAlternatives(alternativeCrops);
  };
  
  // Handle option selection
  const handleOptionClick = async (option) => {
    setSelectedOption(option);
    setIsChatbotLoading(true);
    
    setTimeout(() => {
      setIsChatbotLoading(false);
    }, 1000);
  };
  
  // Reset option selection
  const resetOptionSelection = () => {
    setSelectedOption(null);
  };
  
  // Get option response based on selection
  const getOptionResponse = () => {
    if (!selectedOption) return '';
    
    // These would typically come from API calls, but using predefined responses for demo
    const optionResponses = {
      english: {
        profitability: `
## Profitability Comparison

### ${prediction} (Recommended)
• Current market price: Good
• ROI: ~30-40% with proper management

### Alternatives
${alternatives.map(alt => `• **${alt.name}**: ${getRandomProfitability(alt.name)}`).join('\n')}

Most profitable: ${getMostProfitableCrop()}
`,
        easier: `
## Ease of Growing

### ${prediction} (Recommended)
• Difficulty: ${insights.growthDifficulty || 'Medium'}
• Disease resistance: Moderate
• Labor needed: Average

### Alternatives
${alternatives.map(alt => `• **${alt.name}**: ${getRandomDifficulty(alt.name)}`).join('\n')}

Easiest for beginners: ${getEasiestCrop()}
`,
        demand: `
## Market Demand (May 2025)

### ${prediction}: ${insights.marketDemand || 'Medium'} 
${alternatives.map(alt => `### ${alt.name}: ${getRandomDemand(alt.name)}`).join('\n')}

Local markets favor: ${getBestMarketCrop()}
`,
        diseases: `
## Common Diseases & Prevention

### ${prediction}
${getDiseaseInfo(prediction)}

### Prevention Tips
• Use resistant varieties
• Follow crop rotation
• Spray preventively during risky periods
`,
        harvesting: `
## Harvesting Tips for ${prediction}

• Harvest in morning hours when cooler
• Look for: ${getHarvestSigns(prediction)}
• Store promptly after harvesting
• Use proper tools to minimize damage
`,
        storage: `
## Storage Requirements for ${prediction}

• Temperature: ${getStorageTemp(prediction)}
• Humidity: ${getStorageHumidity(prediction)}
• Duration: Can store for ${getStorageDuration(prediction)} with proper conditions
• Key tip: ${getStorageTip(prediction)}
`
      },
      hindi: {
        profitability: `
## लाभप्रदता तुलना

### ${prediction} (अनुशंसित)
• वर्तमान बाजार मूल्य: अच्छा
• ROI: उचित प्रबंधन के साथ ~30-40%

### विकल्प
${alternatives.map(alt => `• **${alt.name}**: ${getRandomProfitability(alt.name)}`).join('\n')}

सबसे लाभदायक: ${getMostProfitableCrop()}
`,
        easier: `
## उगाने में आसानी

### ${prediction} (अनुशंसित)
• कठिनाई: ${insights.growthDifficulty === 'high' ? 'उच्च' : insights.growthDifficulty === 'medium' ? 'मध्यम' : 'निम्न'}
• रोग प्रतिरोध: मध्यम
• श्रम आवश्यकता: औसत

### विकल्प
${alternatives.map(alt => `• **${alt.name}**: ${getRandomDifficulty(alt.name)}`).join('\n')}

शुरुआती के लिए सबसे आसान: ${getEasiestCrop()}
`,
        demand: `
## बाजार मांग (मई 2025)

### ${prediction}: ${insights.marketDemand === 'high' ? 'उच्च' : insights.marketDemand === 'medium' ? 'मध्यम' : 'निम्न'} 
${alternatives.map(alt => `### ${alt.name}: ${getRandomDemand(alt.name)}`).join('\n')}

स्थानीय बाजारों में अधिक मांग: ${getBestMarketCrop()}
`,
        diseases: `
## सामान्य बीमारियां और रोकथाम

### ${prediction}
${getDiseaseInfo(prediction)}

### रोकथाम के टिप्स
• प्रतिरोधी किस्मों का उपयोग करें
• फसल चक्र का पालन करें
• जोखिम वाले समय में निवारक छिड़काव करें
`,
        harvesting: `
## ${prediction} के लिए कटाई के टिप्स

• ठंडे समय सुबह में कटाई करें
• इन संकेतों की तलाश करें: ${getHarvestSigns(prediction)}
• कटाई के बाद तुरंत भंडारित करें
• नुकसान कम करने के लिए उचित उपकरण उपयोग करें
`,
        storage: `
## ${prediction} के लिए भंडारण आवश्यकताएँ

• तापमान: ${getStorageTemp(prediction)}
• आर्द्रता: ${getStorageHumidity(prediction)}
• अवधि: उचित परिस्थितियों में ${getStorageDuration(prediction)} तक संग्रहित किया जा सकता है
• महत्वपूर्ण सुझाव: ${getStorageTip(prediction)}
`
      }
    };
    
    return isHindi ? optionResponses.hindi[selectedOption] : optionResponses.english[selectedOption];
  };
  
  // Helper functions for generating concise responses
  const getRandomProfitability = (crop) => {
    const options = isHindi 
      ? ["उच्च लाभ-कम जोखिम", "मध्यम निवेश-मध्यम रिटर्न", "कम निवेश-कम देखभाल"] 
      : ["High profit-low risk", "Medium investment-medium return", "Low investment-low maintenance"];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRandomDifficulty = (crop) => {
    const options = isHindi 
      ? ["कम देखभाल चाहिए", "विशेषज्ञ प्रबंधन चाहिए", "शुरुआती के लिए अच्छा"] 
      : ["Low maintenance required", "Expert management needed", "Good for beginners"];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRandomDemand = (crop) => {
    const options = isHindi 
      ? ["बढ़ती मांग", "स्थिर बाजार", "मौसमी मांग"] 
      : ["Rising demand", "Stable market", "Seasonal demand"];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getMostProfitableCrop = () => {
    // Return either the main crop or one of the alternatives
    const crops = [prediction, ...alternatives.map(a => a.name)];
    return crops[Math.floor(Math.random() * crops.length)];
  };
  
  const getEasiestCrop = () => {
    // Return either the main crop or one of the alternatives
    const crops = [prediction, ...alternatives.map(a => a.name)];
    return crops[Math.floor(Math.random() * crops.length)];
  };
  
  const getBestMarketCrop = () => {
    // Return either the main crop or one of the alternatives
    const crops = [prediction, ...alternatives.map(a => a.name)];
    return crops[Math.floor(Math.random() * crops.length)];
  };
  
  const getDiseaseInfo = (crop) => {
    if (isHindi) {
      return `पत्ती धब्बा, फफूंदी और जड़ सड़न सबसे आम बीमारियां हैं। फसल निगरानी और नियमित रूप से स्वच्छता बनाए रखें।`;
    } else {
      return `Leaf spot, powdery mildew and root rot are most common. Monitor crops and maintain regular sanitation.`;
    }
  };
  
  const getHarvestSigns = (crop) => {
    if (isHindi) {
      return `परिपक्व रंग, सही आकार, पत्ती संकेत`;
    } else {
      return `mature color, proper size, leaf signs`;
    }
  };
  
  const getStorageTemp = (crop) => {
    return isHindi ? "12-15°C" : "12-15°C";
  };
  
  const getStorageHumidity = (crop) => {
    return isHindi ? "60-70%" : "60-70%";
  };
  
  const getStorageDuration = (crop) => {
    return isHindi ? "3-6 महीने" : "3-6 months";
  };
  
  const getStorageTip = (crop) => {
    if (isHindi) {
      return `सूखी, हवादार जगह पर रखें और नियमित रूप से जांचें`;
    } else {
      return `Keep in dry, ventilated place and check regularly`;
    }
  };

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
    setInsights({})
    setAlternatives([])
    setSelectedOption(null)
    
    try {
      const response = await axios.post('http://localhost:5002/predict_crop', formData)
      setPrediction(response.data.crop)
      setShowResults(true)
      // Insights will be auto-generated via useEffect
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing your request')
    } finally {
      setLoading(false)
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
    setInsights({})
    setAlternatives([])
    setSelectedOption(null)
  }

  // Get visual cue class for input fields
  const getInputClass = (fieldName) => {
    if (!formData[fieldName]) return ''
    if (validationErrors[fieldName]) return 'input-error'
    return 'input-valid'
  }
  
  // Get localized crop name
  const getLocalizedCropName = (cropName) => {
    if (!isHindi || !cropName) return cropName || '';
    
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
  
  // Get rating visualization based on value
  const getRatingVisual = (value) => {
    if (!value) return '—';
    
    // Map text values to numeric for visualization
    const ratingMap = {
      'high': 3, 'medium': 2, 'low': 1,
      'उच्च': 3, 'मध्यम': 2, 'निम्न': 1,
      'fast': 3, 'slow': 1,
      'तेज': 3, 'धीमा': 1
    };
    
    const rating = ratingMap[value.toLowerCase()] || 2;
    
    return (
      <div className="rating-visual">
        <span className={`rating-dot ${rating >= 1 ? 'active' : ''}`}></span>
        <span className={`rating-dot ${rating >= 2 ? 'active' : ''}`}></span>
        <span className={`rating-dot ${rating >= 3 ? 'active' : ''}`}></span>
        <span className="rating-text">{value}</span>
      </div>
    );
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
                
                {/* AI Insights Section */}
                <div className="insights-section" ref={insightsRef}>
                  <h3 className="insights-title">
                    {t.insightsTitle.replace('{crop}', getLocalizedCropName(prediction))}
                  </h3>
                  
                  {isChatbotLoading && (
                    <div className="insights-loading">
                      <div className="insights-spinner"></div>
                      <p>{t.loadingInsights}</p>
                    </div>
                  )}
                  
                  {/* Main Crop Insights */}
                  {!isChatbotLoading && Object.keys(insights).length > 0 && !selectedOption && (
                    <div className="main-crop-insights">
                      <div className="insights-grid">
                        <div className="insight-card">
                          <h4>{t.profitMargin}</h4>
                          {getRatingVisual(insights.profitMargin)}
                        </div>
                        <div className="insight-card">
                          <h4>{t.marketDemand}</h4>
                          {getRatingVisual(insights.marketDemand)}
                        </div>
                        <div className="insight-card">
                          <h4>{t.growthDifficulty}</h4>
                          {getRatingVisual(insights.growthDifficulty)}
                        </div>
                        <div className="insight-card">
                          <h4>{t.waterNeeds}</h4>
                          {getRatingVisual(insights.waterNeeds)}
                        </div>
                        <div className="insight-card">
                          <h4>{t.growthTime}</h4>
                          {getRatingVisual(insights.growthTime)}
                        </div>
                      </div>
                      
                      {insights.bestPractices && (
                        <div className="best-practices">
                          <h4>{t.bestPractices}</h4>
                          <p>{insights.bestPractices}</p>
                        </div>
                      )}
                      
                      {/* Alternative Crops */}
                      {alternatives.length > 0 && (
                        <div className="alternatives-section">
                          <h4>{t.alternativeCropsTitle}</h4>
                          <div className="alternatives-grid">
                            {alternatives.map((alt, index) => (
                              <div className="alternative-card" key={index}>
                                <div className="alternative-name">{alt.name}</div>
                                <div className="alternative-reason">{alt.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Options for More Information */}
                      <div className="options-section">
                        <h4>{t.seeMoreAbout}</h4>
                        <div className="options-grid">
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('profitability')}
                          >
                            {t.optionProfitability}
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('easier')}
                          >
                            {t.optionEasier}
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('demand')}
                          >
                            {t.optionDemand}
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('diseases')}
                          >
                            {t.optionDiseases}
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('harvesting')}
                          >
                            {t.optionHarvesting}
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('storage')}
                          >
                            {t.optionStorage}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Selected Option Content */}
                  {!isChatbotLoading && selectedOption && (
                    <div className="selected-option-content">
                      <button 
                        className="back-button" 
                        onClick={resetOptionSelection}
                      >
                        ← {t.backToOptions}
                      </button>
                      
                      <div className="option-response">
                        {getOptionResponse().split('\n').map((line, i) => {
                          if (line.startsWith('## ')) {
                            return <h3 key={i}>{line.replace('## ', '')}</h3>;
                          } else if (line.startsWith('### ')) {
                            return <h4 key={i}>{line.replace('### ', '')}</h4>;
                          } else if (line.startsWith('• ')) {
                            return <li key={i}>{line.replace('• ', '')}</li>;
                          } else if (line.trim() === '') {
                            return <br key={i} />;
                          } else {
                            return <p key={i}>{line}</p>;
                          }
                        })}
                      </div>
                    </div>
                  )}
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
          gap: 1.5rem;
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
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(to right, #2f855a, #48bb78);
        }
        
        .form-title {
          font-size: 1.5rem;
          color: #2f855a;
          margin-bottom: 0.5rem;
        }
        
        .form-description {
          color: #4a5568;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        
        .required {
          color: #e53e3e;
          margin-left: 2px;
        }
        
        .validation-summary {
          background-color: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 0.75rem;
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
          font-size: 0.9rem;
        }
        
        .validation-icon {
          background-color: #fbbf24;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }
        
        .validation-list {
          margin: 0;
          padding-left: 1.5rem;
          color: #92400e;
          font-size: 0.85rem;
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
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
        }
        
        .form-group {
          margin-bottom: 0.75rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
          color: #2d3748;
          font-size: 0.9rem;
        }
        
        .unit {
          font-size: 0.8rem;
          color: #718096;
          font-weight: normal;
        }
        
        input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
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
          font-size: 0.7rem;
          color: #718096;
          margin-top: 0.25rem;
        }
        
        .submit-button {
          display: block;
          width: 100%;
          padding: 0.7rem;
          margin-top: 1.5rem;
          background-color: #2f855a;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
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
          padding: 1.25rem;
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
          font-size: 1.1rem;
          color: #2d3748;
          margin: 0;
        }
        
        .result-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: bold;
          font-size: 0.9rem;
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
          font-size: 0.9rem;
        }
        
        .crop-result {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2f855a;
          text-align: center;
          padding: 0.75rem;
          margin: 0.75rem 0;
          background-color: #e6fffa;
          border-radius: 6px;
        }
        
        .parameters-summary {
          background-color: #f7fafc;
          border-radius: 6px;
          padding: 0.75rem;
          margin: 1rem 0;
        }
        
        .parameters-summary h4 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          color: #4a5568;
          font-size: 0.9rem;
        }
        
        .params-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.6rem;
        }
        
        .param-item {
          display: flex;
          flex-direction: column;
        }
        
        .param-label {
          font-size: 0.75rem;
          color: #718096;
        }
        
        .param-value {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.85rem;
        }
        
        .result-tip {
          font-size: 0.8rem;
          color: #718096;
          margin-top: 1rem;
        }
        
        .restart-button {
          display: block;
          width: 100%;
          padding: 0.7rem;
          margin-top: 1rem;
          background-color: #2f855a;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .restart-button:hover {
          background-color: #276749;
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
          padding: 1.5rem;
        }
        
        .info-card h3 {
          color: #2f855a;
          margin-bottom: 1.25rem;
          font-size: 1.1rem;
        }
        
        .info-item {
          margin-bottom: 1.25rem;
        }
        
        .info-item h4 {
          color: #4a5568;
          margin-bottom: 0.4rem;
          font-size: 0.9rem;
        }
        
        .info-item p {
          color: #718096;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        
        /* Insights section styles - more compact and professional */
        .insights-section {
          margin-top: 1.25rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 1rem;
          border-left: 3px solid #2f855a;
        }
        
        .insights-title {
          color: #2f855a;
          font-size: 1rem;
          margin-top: 0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }
        
        .insights-title::before {
          content: '🔍';
          margin-right: 6px;
          font-size: 0.9rem;
        }
        
        .insights-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          gap: 0.6rem;
        }
        
        .insights-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(47, 133, 90, 0.1);
          border-top-color: #2f855a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .insight-card {
          background-color: white;
          border-radius: 6px;
          padding: 0.5rem 0.6rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .insight-card h4 {
          font-size: 0.7rem;
          color: #4a5568;
          margin-top: 0;
          margin-bottom: 0.4rem;
        }
        
        .rating-visual {
          display: flex;
          align-items: center;
        }
        
        .rating-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #e2e8f0;
          margin-right: 2px;
        }
        
        .rating-dot.active {
          background-color: #2f855a;
        }
        
        .rating-text {
          margin-left: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .best-practices {
          background-color: white;
          border-radius: 6px;
          padding: 0.6rem;
          margin-bottom: 1rem;
          border-left: 2px solid #2f855a;
        }
        
        .best-practices h4 {
          color: #2f855a;
          margin-top: 0;
          margin-bottom: 0.3rem;
          font-size: 0.8rem;
        }
        
        .best-practices p {
          margin: 0;
          color: #4a5568;
          font-size: 0.75rem;
        }
        
        .alternatives-section {
          margin-bottom: 1rem;
        }
        
        .alternatives-section h4 {
          color: #4a5568;
          font-size: 0.85rem;
          margin-bottom: 0.4rem;
        }
        
        .alternatives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.5rem;
        }
        
        .alternative-card {
          background-color: white;
          border-radius: 6px;
          padding: 0.6rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .alternative-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.3rem;
          font-size: 0.8rem;
        }
        
        .alternative-reason {
          color: #718096;
          font-size: 0.7rem;
        }
        
        .options-section {
          margin-top: 1rem;
        }
        
        .options-section h4 {
          color: #4a5568;
          font-size: 0.8rem;
          margin-bottom: 0.4rem;
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.4rem;
        }
        
        .option-button {
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 0.4rem;
          text-align: center;
          color: #4a5568;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: normal;
        }
        
        .option-button:hover {
          background-color: #edf2f7;
          border-color: #2f855a;
        }
        
        .selected-option-content {
          animation: fadeIn 0.3s ease;
        }
        
        .back-button {
          background: none;
          border: none;
          color: #2f855a;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
          margin-bottom: 0.6rem;
          display: inline-flex;
          align-items: center;
        }
        
        .back-button:hover {
          text-decoration: underline;
        }
        
        .option-response {
          background-color: white;
          border-radius: 6px;
          padding: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          font-size: 0.75rem;
        }
        
        .option-response h3 {
          color: #2f855a;
          margin-top: 0;
          margin-bottom: 0.6rem;
          font-size: 0.9rem;
        }
        
        .option-response h4 {
          color: #2d3748;
          font-size: 0.8rem;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
        }
        
        .option-response p {
          color: #4a5568;
          line-height: 1.4;
          margin-bottom: 0.4rem;
        }
        
        .option-response li {
          color: #4a5568;
          margin-bottom: 0.3rem;
          margin-left: 1rem;
          font-size: 0.75rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Enhanced mobile responsiveness */
        @media (max-width: 768px) {
          .form-card, .info-card {
            padding: 1rem;
          }
          
          .form-title {
            font-size: 1.25rem;
          }
          
          .form-description {
            font-size: 0.85rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .params-grid {
            grid-template-columns: 1fr 1fr;
            font-size: 0.8rem;
          }
          
          .insight-card h4 {
            font-size: 0.65rem;
          }
          
          .rating-text {
            font-size: 0.65rem;
          }
          
          .insights-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .option-button {
            font-size: 0.65rem;
            padding: 0.35rem;
          }
          
          .crop-result {
            font-size: 1.25rem;
            padding: 0.5rem;
          }
          
          .options-grid {
            grid-template-columns: 1fr;
          }
          
          .option-response {
            font-size: 0.7rem;
          }
          
          .option-response h3 {
            font-size: 0.85rem;
          }
          
          .option-response h4 {
            font-size: 0.75rem;
          }
          
          .option-response li {
            font-size: 0.7rem;
          }
        }
        
        /* Very small screens */
        @media (max-width: 480px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }
          
          .insight-card {
            padding: 0.4rem;
          }
          
          .best-practices {
            padding: 0.5rem;
          }
          
          .alternatives-grid {
            grid-template-columns: 1fr;
          }
          
          .param-label {
            font-size: 0.7rem;
          }
          
          .param-value {
            font-size: 0.75rem;
          }
          
          .form-title {
            font-size: 1.1rem;
          }
          
          .crop-result {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default RecommendationForm