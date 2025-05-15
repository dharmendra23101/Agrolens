

import { useState, useEffect, useContext, useRef } from 'react'
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
  const [insights, setInsights] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const insightsRef = useRef(null)

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
      irrigationDescription: "Consistent irrigation reduces dependence on rainfall and can dramatically improve yields in drier regions.",
      
      // Insights section
      insightsTitle: "Smart Yield Insights",
      loadingInsights: "Analyzing your data...",
      yieldQuality: "Yield Quality",
      profitPotential: "Profit Potential",
      resourceEfficiency: "Resource Efficiency",
      marketTiming: "Market Timing",
      riskFactors: "Risk Factors",
      optimizationTip: "Optimization Tip",
      
      // Ratings and values
      excellent: "Excellent",
      good: "Good",
      average: "Average",
      fair: "Fair",
      poor: "Poor",
      optimal: "Optimal",
      suboptimal: "Suboptimal",
      high: "High",
      medium: "Medium",
      low: "Low",
      
      // Options
      askMeAbout: "Ask me about:",
      optionIncrease: "How to increase yield?",
      optionRisks: "What are the main risks?",
      optionHarvest: "Best harvest window?",
      optionStorage: "Storage considerations",
      optionAlternatives: "Alternative crops",
      optionMarket: "Market outlook",
      backToOptions: "Back to options"
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
      irrigationDescription: "निरंतर सिंचाई वर्षा पर निर्भरता कम करती है और शुष्क क्षेत्रों में उपज में नाटकीय रूप से सुधार कर सकती है।",
      
      // Insights section
      insightsTitle: "स्मार्ट उपज अंतर्दृष्टि",
      loadingInsights: "आपका डेटा विश्लेषण किया जा रहा है...",
      yieldQuality: "उपज गुणवत्ता",
      profitPotential: "लाभ क्षमता",
      resourceEfficiency: "संसाधन दक्षता",
      marketTiming: "बाजार समय",
      riskFactors: "जोखिम कारक",
      optimizationTip: "अनुकूलन टिप",
      
      // Ratings and values
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      average: "औसत",
      fair: "उचित",
      poor: "कमज़ोर",
      optimal: "इष्टतम",
      suboptimal: "उप-इष्टतम",
      high: "उच्च",
      medium: "मध्यम",
      low: "निम्न",
      
      // Options
      askMeAbout: "मुझसे पूछें:",
      optionIncrease: "उपज कैसे बढ़ाएं?",
      optionRisks: "मुख्य जोखिम क्या हैं?",
      optionHarvest: "सर्वोत्तम कटाई अवधि?",
      optionStorage: "भंडारण विचार",
      optionAlternatives: "वैकल्पिक फसलें",
      optionMarket: "बाजार दृष्टिकोण",
      backToOptions: "विकल्पों पर वापस जाएं"
    }
  };

  const t = isHindi ? translations.hindi : translations.english;

  // Generate insights when prediction is set
  useEffect(() => {
    if (prediction) {
      generateInsights();
    }
  }, [prediction]);

  // Scroll to insights when they change
  useEffect(() => {
    if (insightsRef.current && Object.keys(insights).length > 0) {
      insightsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [insights]);

  // Generate insights for yield prediction
  const generateInsights = () => {
    setIsInsightsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate insights based on prediction and form data
      const insightsData = {
        yieldQuality: getYieldQuality(),
        profitPotential: getProfitPotential(),
        resourceEfficiency: getResourceEfficiency(),
        marketTiming: getMarketTiming(),
        riskFactors: getRiskLevel(),
        optimizationTip: getOptimizationTip()
      };
      
      setInsights(insightsData);
      setIsInsightsLoading(false);
    }, 1200);
  };
  
  // Calculate yield quality based on inputs
  const getYieldQuality = () => {
    // Logic to determine yield quality
    const predictedYield = parseFloat(prediction);
    
    if (predictedYield > 4.5) return "excellent";
    if (predictedYield > 3.5) return "good";
    if (predictedYield > 2.5) return "average";
    if (predictedYield > 1.5) return "fair";
    return "poor";
  };
  
  // Calculate profit potential
  const getProfitPotential = () => {
    // Logic to determine profit potential
    const weather = formData.weather;
    const fertilizer = formData.fertilizer === "Yes";
    const irrigation = formData.irrigation === "Yes";
    
    if ((weather === "Sunny" || weather === "Cloudy") && fertilizer && irrigation) {
      return "high";
    }
    if (fertilizer || irrigation) {
      return "medium";
    }
    return "low";
  };
  
  // Calculate resource efficiency
  const getResourceEfficiency = () => {
    // Logic to determine resource efficiency
    const rainfall = parseInt(formData.rainfall);
    const irrigation = formData.irrigation === "Yes";
    
    if (rainfall > 200 && !irrigation) return "excellent";
    if ((rainfall > 150 && !irrigation) || (rainfall < 100 && irrigation)) return "good";
    return "average";
  };
  
  // Calculate market timing
  const getMarketTiming = () => {
    // Logic to determine market timing
    const daysToHarvest = parseInt(formData.days_to_harvest);
    
    if (daysToHarvest < 60) return "optimal";
    if (daysToHarvest < 90) return "good";
    return "suboptimal";
  };
  
  // Calculate risk level
  const getRiskLevel = () => {
    // Logic to determine risk level
    const weather = formData.weather;
    const irrigation = formData.irrigation === "Yes";
    
    if (weather === "Rainy" && !irrigation) return "high";
    if (weather === "Sunny" && !irrigation) return "medium";
    return "low";
  };
  
  // Get optimization tip
  const getOptimizationTip = () => {
    // Logic to determine optimization tip
    const crop = formData.crop;
    const soil = formData.soil_type;
    const fertilizer = formData.fertilizer === "Yes";
    const irrigation = formData.irrigation === "Yes";
    
    if (!fertilizer) {
      return isHindi ? 
        "फसल के प्रकार के अनुसार उचित उर्वरक का उपयोग करके उपज 20-30% तक बढ़ाएं।" : 
        "Increase yield by 20-30% using appropriate fertilizers for your crop type.";
    }
    
    if (!irrigation) {
      return isHindi ? 
        "सूखा अवधि के दौरान उपज की सुरक्षा के लिए बारिश के पानी का संरक्षण करें या सिंचाई लागू करें।" : 
        "Conserve rainwater or implement irrigation to protect yield during dry periods.";
    }
    
    if (soil === "Sandy") {
      return isHindi ? 
        "रेतीली मिट्टी में जैविक पदार्थ जोड़ें और अधिक बार पानी दें लेकिन कम मात्रा में।" : 
        "Add organic matter to sandy soil and water more frequently but in smaller amounts.";
    }
    
    return isHindi ? 
      "फसल की निगरानी नियमित रूप से करें और मौसम के पूर्वानुमान के आधार पर अपनी खेती की गतिविधियों की योजना बनाएं।" : 
      "Monitor crops regularly and plan your farming activities based on weather forecasts.";
  };
  
  // Handle option selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsInsightsLoading(true);
    
    setTimeout(() => {
      setIsInsightsLoading(false);
    }, 800);
  };
  
  // Reset option selection
  const resetOptionSelection = () => {
    setSelectedOption(null);
  };
  
  // Get option response based on selection
  const getOptionResponse = () => {
    if (!selectedOption) return '';
    
    const optionResponses = {
      english: {
        increase: `
## How to Increase Your ${formData.crop} Yield

### Key Strategies:
• ${getKeyIncreaseStrategy1()}
• ${getKeyIncreaseStrategy2()}
• ${getKeyIncreaseStrategy3()}

### For Your Specific Conditions:
Based on your ${formData.soil_type} soil and ${formData.weather.toLowerCase()} weather conditions, focus on ${getSpecificIncreaseStrategy()}.
`,
        risks: `
## Main Risks for Your ${formData.crop} Crop

### Current Risk Level: ${getRiskLevel()}

### Top Concerns:
• ${getMainRisk1()}
• ${getMainRisk2()}
• ${getMainRisk3()}

### Mitigation Strategy:
${getRiskMitigation()}
`,
        harvest: `
## Best Harvest Window for ${formData.crop}

### Optimal Timing:
Your crop should be ready in about ${formData.days_to_harvest} days from planting.
The best harvest window is ${getHarvestWindow()}.

### Harvest Indicators:
Look for ${getHarvestIndicators()}

### Weather Consideration:
${getHarvestWeatherTip()}
`,
        storage: `
## Storage Considerations for ${formData.crop}

### Recommended Conditions:
• Temperature: ${getStorageTemp()}
• Humidity: ${getStorageHumidity()}
• Ventilation: ${getStorageVentilation()}

### Max Storage Duration:
With proper conditions: ${getStorageDuration()}

### Key Storage Tip:
${getStorageTip()}
`,
        alternatives: `
## Alternative Crops for Your Conditions

Based on your soil type (${formData.soil_type}) and climate inputs:

### Recommended Alternatives:
• ${getAlternativeCrop1()}: ${getAlternativeReason1()}
• ${getAlternativeCrop2()}: ${getAlternativeReason2()}
• ${getAlternativeCrop3()}: ${getAlternativeReason3()}

### Comparison with Current Choice:
${getAlternativeComparison()}
`,
        market: `
## Market Outlook for ${formData.crop}

### Current Trend:
${getMarketTrend()}

### Price Forecast:
${getPriceForecast()}

### Demand Drivers:
• ${getDemandDriver1()}
• ${getDemandDriver2()}

### Best Selling Window:
${getBestSellingWindow()}
`
      },
      hindi: {
        increase: `
## अपनी ${formData.crop} उपज कैसे बढ़ाएं

### प्रमुख रणनीतियां:
• ${getKeyIncreaseStrategy1(true)}
• ${getKeyIncreaseStrategy2(true)}
• ${getKeyIncreaseStrategy3(true)}

### आपकी विशिष्ट स्थितियों के लिए:
आपकी ${formData.soil_type} मिट्टी और ${formData.weather.toLowerCase()} मौसम की स्थिति के आधार पर, ${getSpecificIncreaseStrategy(true)} पर ध्यान दें।
`,
        risks: `
## आपकी ${formData.crop} फसल के लिए मुख्य जोखिम

### वर्तमान जोखिम स्तर: ${getRiskLevel(true)}

### प्रमुख चिंताएँ:
• ${getMainRisk1(true)}
• ${getMainRisk2(true)}
• ${getMainRisk3(true)}

### शमन रणनीति:
${getRiskMitigation(true)}
`,
        harvest: `
## ${formData.crop} के लिए सर्वोत्तम कटाई अवधि

### इष्टतम समय:
आपकी फसल रोपण से लगभग ${formData.days_to_harvest} दिनों में तैयार हो जानी चाहिए।
सर्वोत्तम कटाई अवधि ${getHarvestWindow(true)} है।

### कटाई संकेतक:
${getHarvestIndicators(true)} की तलाश करें

### मौसम विचार:
${getHarvestWeatherTip(true)}
`,
        storage: `
## ${formData.crop} के लिए भंडारण विचार

### अनुशंसित स्थितियां:
• तापमान: ${getStorageTemp()}
• आर्द्रता: ${getStorageHumidity()}
• वेंटिलेशन: ${getStorageVentilation(true)}

### अधिकतम भंडारण अवधि:
उचित स्थितियों के साथ: ${getStorageDuration(true)}

### प्रमुख भंडारण टिप:
${getStorageTip(true)}
`,
        alternatives: `
## आपकी स्थितियों के लिए वैकल्पिक फसलें

आपकी मिट्टी के प्रकार (${formData.soil_type}) और जलवायु इनपुट के आधार पर:

### अनुशंसित विकल्प:
• ${getAlternativeCrop1(true)}: ${getAlternativeReason1(true)}
• ${getAlternativeCrop2(true)}: ${getAlternativeReason2(true)}
• ${getAlternativeCrop3(true)}: ${getAlternativeReason3(true)}

### वर्तमान विकल्प के साथ तुलना:
${getAlternativeComparison(true)}
`,
        market: `
## ${formData.crop} के लिए बाजार दृष्टिकोण

### वर्तमान प्रवृत्ति:
${getMarketTrend(true)}

### मूल्य पूर्वानुमान:
${getPriceForecast(true)}

### मांग ड्राइवर:
• ${getDemandDriver1(true)}
• ${getDemandDriver2(true)}

### सर्वोत्तम बिक्री अवधि:
${getBestSellingWindow(true)}
`
      }
    };
    
    return isHindi ? optionResponses.hindi[selectedOption] : optionResponses.english[selectedOption];
  };
  
  // Helper functions for generating option responses
  const getKeyIncreaseStrategy1 = (hindi = false) => {
    const strategies = {
      english: [
        "Optimize plant spacing based on soil fertility",
        "Apply precision fertilization at critical growth stages",
        "Implement proper weed management early in growth cycle"
      ],
      hindi: [
        "मिट्टी की उर्वरता के आधार पर पौधे के स्थान का अनुकूलन करें",
        "महत्वपूर्ण विकास चरणों में सटीक उर्वरक का प्रयोग करें",
        "विकास चक्र के शुरुआती समय में उचित खरपतवार प्रबंधन लागू करें"
      ]
    };
    
    const options = hindi ? strategies.hindi : strategies.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getKeyIncreaseStrategy2 = (hindi = false) => {
    const strategies = {
      english: [
        "Monitor and maintain optimal soil moisture",
        "Use disease-resistant varieties suited to your region",
        "Apply foliar sprays at recommended intervals"
      ],
      hindi: [
        "मिट्टी की इष्टतम नमी की निगरानी और बनाए रखें",
        "अपने क्षेत्र के अनुकूल रोग-प्रतिरोधी किस्मों का उपयोग करें",
        "अनुशंसित अंतराल पर पत्ती स्प्रे लागू करें"
      ]
    };
    
    const options = hindi ? strategies.hindi : strategies.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getKeyIncreaseStrategy3 = (hindi = false) => {
    const strategies = {
      english: [
        "Practice crop rotation to break pest cycles",
        "Time planting according to seasonal conditions",
        "Use integrated pest management techniques"
      ],
      hindi: [
        "कीट चक्र तोड़ने के लिए फसल चक्र का अभ्यास करें",
        "मौसमी स्थितियों के अनुसार रोपण का समय निर्धारित करें",
        "एकीकृत कीट प्रबंधन तकनीकों का उपयोग करें"
      ]
    };
    
    const options = hindi ? strategies.hindi : strategies.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getSpecificIncreaseStrategy = (hindi = false) => {
    if (formData.soil_type === "Sandy") {
      return hindi ? 
        "अधिक जैविक पदार्थ जोड़ना और पानी प्रतिधारण में सुधार" : 
        "adding more organic matter and improving water retention";
    }
    
    if (formData.soil_type === "Clay") {
      return hindi ? 
        "जल निकासी में सुधार और मिट्टी की संरचना" : 
        "improving drainage and soil structure";
    }
    
    if (formData.weather === "Rainy") {
      return hindi ? 
        "अच्छी जल निकासी सुनिश्चित करना और फंगल रोगों को नियंत्रित करना" : 
        "ensuring good drainage and controlling fungal diseases";
    }
    
    if (formData.weather === "Sunny" && formData.irrigation === "No") {
      return hindi ? 
        "जल संरक्षण तकनीकों और मल्चिंग" : 
        "water conservation techniques and mulching";
    }
    
    return hindi ? 
      "समग्र मिट्टी की स्वास्थ्य और पोषक तत्व प्रबंधन" : 
      "overall soil health and nutrient management";
  };
  
  const getMainRisk1 = (hindi = false) => {
    const map = {
      "Rainy": hindi ? "अत्यधिक नमी से फंगल रोग" : "Fungal diseases due to excess moisture",
      "Sunny": hindi ? "सूखा तनाव और पानी की कमी" : "Drought stress and water scarcity",
      "Cloudy": hindi ? "अपर्याप्त प्रकाश संश्लेषण" : "Insufficient photosynthesis"
    };
    
    return map[formData.weather] || (hindi ? "मौसमी बदलाव" : "Weather variability");
  };
  
  const getMainRisk2 = (hindi = false) => {
    const map = {
      "Sandy": hindi ? "जल और पोषक तत्व का तेजी से निक्षालन" : "Rapid leaching of water and nutrients",
      "Clay": hindi ? "जल जमाव और जड़ रोग" : "Waterlogging and root diseases",
      "Loam": hindi ? "खरपतवार प्रतिस्पर्धा" : "Weed competition",
      "Silt": hindi ? "मिट्टी क्रस्टिंग और कम अंकुरण" : "Soil crusting and poor germination"
    };
    
    return map[formData.soil_type] || (hindi ? "मिट्टी की अनुकूलता" : "Soil compatibility");
  };
  
  const getMainRisk3 = (hindi = false) => {
    if (formData.fertilizer === "No") {
      return hindi ? "पोषक तत्वों की कमी और धीमा विकास" : "Nutrient deficiency and slow growth";
    }
    
    if (formData.irrigation === "No") {
      return hindi ? "सूखे की स्थिति में अनियमित वृद्धि" : "Irregular growth in dry conditions";
    }
    
    const options = hindi ? 
      ["कीट आक्रमण", "मूल्य अस्थिरता", "रोग प्रकोप"] : 
      ["Pest infestation", "Price volatility", "Disease outbreaks"];
    
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRiskMitigation = (hindi = false) => {
    if (formData.weather === "Rainy" && formData.soil_type === "Clay") {
      return hindi ? 
        "उठी हुई क्यारियों का निर्माण करें और अच्छी जल निकासी सुनिश्चित करें। नियमित रूप से फंगल रोगों की निगरानी करें और निवारक स्प्रे लागू करें।" : 
        "Create raised beds and ensure good drainage. Monitor for fungal diseases regularly and apply preventive sprays.";
    }
    
    if (formData.weather === "Sunny" && formData.irrigation === "No") {
      return hindi ? 
        "मिट्टी में नमी बनाए रखने के लिए मल्च का उपयोग करें। सूखा प्रतिरोधी किस्मों पर विचार करें और जल संरक्षण तकनीकों को लागू करें।" : 
        "Use mulch to retain soil moisture. Consider drought-resistant varieties and implement water conservation techniques.";
    }
    
    if (formData.fertilizer === "No") {
      return hindi ? 
        "फसल की विशिष्ट आवश्यकताओं के अनुसार संतुलित उर्वरक लागू करें। मिट्टी परीक्षण कराएं और पोषक तत्वों की कमी की निगरानी करें।" : 
        "Apply balanced fertilizers according to crop-specific requirements. Conduct soil tests and monitor for nutrient deficiencies.";
    }
    
    return hindi ? 
      "एकीकृत कीट प्रबंधन का अभ्यास करें। मौसम की निगरानी करें और उसके अनुसार खेती की गतिविधियों की योजना बनाएं। विविधीकरण द्वारा जोखिम को कम करें।" : 
      "Practice integrated pest management. Monitor weather and plan farming activities accordingly. Reduce risk through diversification.";
  };
  
  const getHarvestWindow = (hindi = false) => {
    const daysToHarvest = parseInt(formData.days_to_harvest);
    
    if (daysToHarvest < 70) {
      return hindi ? "रोपण के 60-70 दिन बाद" : "60-70 days after planting";
    } else if (daysToHarvest < 100) {
      return hindi ? "रोपण के 90-100 दिन बाद" : "90-100 days after planting";
    } else {
      return hindi ? "रोपण के 120-130 दिन बाद" : "120-130 days after planting";
    }
  };
  
  const getHarvestIndicators = (hindi = false) => {
    const cropMap = {
      "Rice": hindi ? "पीले-सुनहरे रंग के दाने, 80-85% परिपक्वता" : "yellow-golden grains, 80-85% maturity",
      "Wheat": hindi ? "पीले-भूरे तने, कठोर दाने" : "yellow-brown stems, hard grains",
      "Maize": hindi ? "सूखे रेशम, पूरी तरह से भरे हुए कान" : "dry silk, fully filled ears",
      "Cotton": hindi ? "खुले बोल्स, सफेद फाइबर" : "open bolls, white fiber",
      "Barley": hindi ? "पीली-पीली बालियां, सूखे दाने" : "yellow-golden spikes, dry grains",
      "Soybean": hindi ? "भूरे-पीले फली, अधिकतर पत्तियां गिर गई हों" : "brown-yellow pods, most leaves fallen"
    };
    
    return cropMap[formData.crop] || (hindi ? "परिपक्व रंग और उचित आकार" : "mature color and proper size");
  };
  
  const getHarvestWeatherTip = (hindi = false) => {
    if (formData.weather === "Rainy") {
      return hindi ? 
        "बारिश के बाद कटाई से बचें क्योंकि यह नमी को बढ़ा सकता है और भंडारण के दौरान गुणवत्ता को प्रभावित कर सकता है। शुष्क दिनों की प्रतीक्षा करें।" : 
        "Avoid harvesting after rain as it can increase moisture and affect quality during storage. Wait for dry days.";
    }
    
    if (formData.weather === "Sunny") {
      return hindi ? 
                "अत्यधिक गर्मी से बचने के लिए सुबह या शाम के समय कटाई करें। यदि संभव हो तो फसल के खराब होने से बचने के लिए शीघ्र संसाधित करें।" : 
        "Harvest during morning or evening to avoid excessive heat. Process promptly if possible to prevent crop degradation.";
    }
    
    return hindi ? 
      "सुनिश्चित करें कि फसल सूखी है और अधिमानतः सुबह के समय कटाई करें जब तापमान मध्यम होता है।" : 
      "Ensure the crop is dry and preferably harvest during morning hours when temperatures are moderate.";
  };
  
  const getStorageTemp = () => {
    const cropMap = {
      "Rice": "12-15°C",
      "Wheat": "10-15°C",
      "Maize": "10-15°C",
      "Cotton": "15-20°C",
      "Barley": "10-15°C",
      "Soybean": "8-12°C"
    };
    
    return cropMap[formData.crop] || "10-15°C";
  };
  
  const getStorageHumidity = () => {
    const cropMap = {
      "Rice": "60-70%",
      "Wheat": "55-65%",
      "Maize": "60-70%",
      "Cotton": "40-60%",
      "Barley": "55-65%",
      "Soybean": "65-70%"
    };
    
    return cropMap[formData.crop] || "60-70%";
  };
  
  const getStorageVentilation = (hindi = false) => {
    if (hindi) {
      return "अच्छा";
    }
    return "Good";
  };
  
  const getStorageDuration = (hindi = false) => {
    const cropMap = {
      "Rice": hindi ? "6-12 महीने" : "6-12 months",
      "Wheat": hindi ? "8-12 महीने" : "8-12 months",
      "Maize": hindi ? "6-8 महीने" : "6-8 months",
      "Cotton": hindi ? "8-10 महीने" : "8-10 months",
      "Barley": hindi ? "8-10 महीने" : "8-10 months",
      "Soybean": hindi ? "6-8 महीने" : "6-8 months"
    };
    
    return cropMap[formData.crop] || (hindi ? "6-8 महीने" : "6-8 months");
  };
  
  const getStorageTip = (hindi = false) => {
    if (hindi) {
      return "सूखी, हवादार जगह पर रखें और नियमित रूप से जांच करें।";
    }
    return "Keep in dry, ventilated place and check regularly.";
  };
  
  const getAlternativeCrop1 = (hindi = false) => {
    // Suggest alternative crops based on current crop and soil type
    const alternatives = {
      "Rice": hindi ? "मक्का (Maize)" : "Maize",
      "Wheat": hindi ? "जौ (Barley)" : "Barley",
      "Maize": hindi ? "सूरजमुखी (Sunflower)" : "Sunflower",
      "Cotton": hindi ? "सोयाबीन (Soybean)" : "Soybean",
      "Barley": hindi ? "गेहूं (Wheat)" : "Wheat",
      "Soybean": hindi ? "मूंग (Mung Bean)" : "Mung Bean"
    };
    
    return alternatives[formData.crop] || (hindi ? "गेहूं (Wheat)" : "Wheat");
  };
  
  const getAlternativeCrop2 = (hindi = false) => {
    const alternatives = {
      "Rice": hindi ? "उड़द (Black Gram)" : "Black Gram",
      "Wheat": hindi ? "सरसों (Mustard)" : "Mustard",
      "Maize": hindi ? "बाजरा (Millet)" : "Millet",
      "Cotton": hindi ? "मूंगफली (Groundnut)" : "Groundnut",
      "Barley": hindi ? "चना (Chickpea)" : "Chickpea",
      "Soybean": hindi ? "मसूर (Lentil)" : "Lentil"
    };
    
    return alternatives[formData.crop] || (hindi ? "चना (Chickpea)" : "Chickpea");
  };
  
  const getAlternativeCrop3 = (hindi = false) => {
    const alternatives = {
      "Rice": hindi ? "मूंग (Mung Bean)" : "Mung Bean",
      "Wheat": hindi ? "मक्का (Maize)" : "Maize",
      "Maize": hindi ? "सोयाबीन (Soybean)" : "Soybean",
      "Cotton": hindi ? "ज्वार (Sorghum)" : "Sorghum",
      "Barley": hindi ? "जई (Oats)" : "Oats",
      "Soybean": hindi ? "सूरजमुखी (Sunflower)" : "Sunflower"
    };
    
    return alternatives[formData.crop] || (hindi ? "सरसों (Mustard)" : "Mustard");
  };
  
  const getAlternativeReason1 = (hindi = false) => {
    if (formData.soil_type === "Sandy") {
      return hindi ? "सूखा प्रतिरोधी, कम पानी की आवश्यकता" : "Drought resistant, requires less water";
    }
    
    if (formData.soil_type === "Clay") {
      return hindi ? "मिट्टी संरचना में सुधार करता है" : "Improves soil structure";
    }
    
    return hindi ? "समान मौसम आवश्यकताएँ, अच्छी फसल चक्र विकल्प" : "Similar weather requirements, good rotation option";
  };
  
  const getAlternativeReason2 = (hindi = false) => {
    if (formData.weather === "Rainy") {
      return hindi ? "अधिक नमी वाली स्थितियों में अच्छा प्रदर्शन" : "Performs well in higher moisture conditions";
    }
    
    if (formData.weather === "Sunny") {
      return hindi ? "सूखा सहनशील, कम पानी की आवश्यकता" : "Drought tolerant, needs less water";
    }
    
    return hindi ? "कम इनपुट, अच्छा मार्केट मूल्य" : "Lower inputs, good market value";
  };
  
  const getAlternativeReason3 = (hindi = false) => {
    if (formData.fertilizer === "No") {
      return hindi ? "कम उर्वरक की आवश्यकता है" : "Requires less fertilizer";
    }
    
    if (formData.irrigation === "No") {
      return hindi ? "वर्षा जल पर अच्छी तरह से बढ़ता है" : "Grows well on rainfall";
    }
    
    return hindi ? "विविधीकरण के लिए अच्छा, कम जोखिम" : "Good for diversification, lower risk";
  };
  
  const getAlternativeComparison = (hindi = false) => {
    if (hindi) {
      return `${formData.crop} की तुलना में, ये विकल्प या तो कम पानी की आवश्यकता, कम इनपुट लागत, या अधिक मौसम अनुकूलता प्रदान करते हैं। आपकी स्थिति के आधार पर जोखिम को कम करने के लिए 2-3 फसलों के मिश्रण पर विचार करें।`;
    }
    
    return `Compared to ${formData.crop}, these alternatives offer either lower water requirements, reduced input costs, or better weather adaptability. Consider a mix of 2-3 crops to reduce risk based on your situation.`;
  };
  
  const getMarketTrend = (hindi = false) => {
    const trends = {
      english: [
        `${formData.crop} prices have been steadily rising over the past season due to increased demand.`,
        `${formData.crop} market has shown stability with slight upward movement.`,
        `${formData.crop} has experienced price fluctuations but maintains overall positive trend.`
      ],
      hindi: [
        `बढ़ती मांग के कारण पिछले सीजन से ${formData.crop} के दाम लगातार बढ़ रहे हैं।`,
        `${formData.crop} बाजार ने थोड़ी ऊपर की ओर गति के साथ स्थिरता दिखाई है।`,
        `${formData.crop} में मूल्य उतार-चढ़ाव का अनुभव हुआ है लेकिन समग्र सकारात्मक प्रवृत्ति बनाए रखता है।`
      ]
    };
    
    const options = hindi ? trends.hindi : trends.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getPriceForecast = (hindi = false) => {
    if (formData.fertilizer === "Yes" && formData.irrigation === "Yes") {
      return hindi ? 
        "आने वाले मौसम में 10-15% की वृद्धि की संभावना है, विशेष रूप से उच्च गुणवत्ता वाले उत्पादन के लिए" : 
        "Likely to increase 10-15% in the coming season, especially for high-quality produce";
    }
    
    return hindi ? 
      "अगले 3-6 महीनों में स्थिर रहने की उम्मीद, मौसमी उतार-चढ़ाव के साथ" : 
      "Expected to remain stable over next 3-6 months, with seasonal fluctuations";
  };
  
  const getDemandDriver1 = (hindi = false) => {
    const drivers = {
      english: [
        "Increasing consumer preference for sustainable farming products",
        "Growing export market opportunities",
        "Rising demand in food processing industries"
      ],
      hindi: [
        "टिकाऊ खेती उत्पादों के लिए बढ़ती उपभोक्ता प्राथमिकता",
        "बढ़ते निर्यात बाजार के अवसर",
        "खाद्य प्रसंस्करण उद्योगों में बढ़ती मांग"
      ]
    };
    
    const options = hindi ? drivers.hindi : drivers.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getDemandDriver2 = (hindi = false) => {
    const drivers = {
      english: [
        "Government policies supporting domestic agriculture",
        "Increasing population and food security needs",
        "Climate-induced shortages in competing regions"
      ],
      hindi: [
        "घरेलू कृषि का समर्थन करने वाली सरकारी नीतियां",
        "बढ़ती आबादी और खाद्य सुरक्षा जरूरतें",
        "प्रतिस्पर्धी क्षेत्रों में जलवायु प्रेरित कमी"
      ]
    };
    
    const options = hindi ? drivers.hindi : drivers.english;
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getBestSellingWindow = (hindi = false) => {
    // Logic to determine best selling window
    const daysToHarvest = parseInt(formData.days_to_harvest);
    let harvestMonth;
    
    // Assuming planting in May
    if (daysToHarvest < 80) {
      harvestMonth = hindi ? "जुलाई-अगस्त" : "July-August";
    } else if (daysToHarvest < 120) {
      harvestMonth = hindi ? "अगस्त-सितंबर" : "August-September";
    } else {
      harvestMonth = hindi ? "अक्टूबर-नवंबर" : "October-November";
    }
    
    if (hindi) {
      return `फसल के तुरंत बाद बिक्री न करें। ${harvestMonth} में कटाई के 3-4 सप्ताह बाद बिक्री करने पर विचार करें जब आपूर्ति कम हो और कीमतें अधिक हों।`;
    }
    
    return `Don't sell immediately after harvest. Consider selling 3-4 weeks after your ${harvestMonth} harvest when supply is lower and prices are higher.`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setValidationError(null) // Clear validation errors when user makes changes
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null) // Reset prediction before new request
    setInsights({})
    setSelectedOption(null)
    
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
    setInsights({})
    setSelectedOption(null)
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
  
  // Get visual rating for insights
  const getRatingVisual = (value) => {
    if (!value) return '—';
    
    // Map text values to numeric for visualization
    const ratingMap = {
      'excellent': 5, 'good': 4, 'average': 3, 'fair': 2, 'poor': 1,
      'उत्कृष्ट': 5, 'अच्छा': 4, 'औसत': 3, 'उचित': 2, 'कमज़ोर': 1,
      'high': 3, 'medium': 2, 'low': 1,
      'उच्च': 3, 'मध्यम': 2, 'निम्न': 1,
      'optimal': 3, 'good': 2, 'suboptimal': 1,
      'इष्टतम': 3, 'अच्छा': 2, 'उप-इष्टतम': 1
    };
    
    const rating = ratingMap[value.toLowerCase()] || 3;
    const maxRating = value.toLowerCase() === 'excellent' || value.toLowerCase() === 'उत्कृष्ट' || 
                      value.toLowerCase() === 'good' || value.toLowerCase() === 'अच्छा' || 
                      value.toLowerCase() === 'average' || value.toLowerCase() === 'औसत' || 
                      value.toLowerCase() === 'fair' || value.toLowerCase() === 'उचित' || 
                      value.toLowerCase() === 'poor' || value.toLowerCase() === 'कमज़ोर' ? 5 : 3;
    
    return (
      <div className="rating-visual">
        {[...Array(maxRating)].map((_, i) => (
          <span key={i} className={`rating-dot ${i < rating ? 'active' : ''}`}></span>
        ))}
        <span className="rating-text">{value}</span>
      </div>
    );
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
                  
                  {/* Insights Section */}
                  <div className="insights-section" ref={insightsRef}>
                    <h3 className="insights-title">{t.insightsTitle}</h3>
                    
                    {isInsightsLoading && (
                      <div className="insights-loading">
                        <div className="insights-spinner"></div>
                        <p>{t.loadingInsights}</p>
                      </div>
                    )}
                    
                    {/* Main Insights */}
                    {!isInsightsLoading && Object.keys(insights).length > 0 && !selectedOption && (
                      <div className="main-insights">
                        <div className="insights-grid">
                          <div className="insight-card">
                            <h4>{t.yieldQuality}</h4>
                            {getRatingVisual(insights.yieldQuality)}
                          </div>
                          <div className="insight-card">
                            <h4>{t.profitPotential}</h4>
                            {getRatingVisual(insights.profitPotential)}
                          </div>
                          <div className="insight-card">
                            <h4>{t.resourceEfficiency}</h4>
                            {getRatingVisual(insights.resourceEfficiency)}
                          </div>
                          <div className="insight-card">
                            <h4>{t.marketTiming}</h4>
                            {getRatingVisual(insights.marketTiming)}
                          </div>
                          <div className="insight-card">
                            <h4>{t.riskFactors}</h4>
                            {getRatingVisual(insights.riskFactors)}
                          </div>
                        </div>
                        
                        {insights.optimizationTip && (
                          <div className="optimization-tip">
                            <h4>{t.optimizationTip}</h4>
                            <p>{insights.optimizationTip}</p>
                          </div>
                        )}
                        
                        {/* Options for More Information */}
                        <div className="options-section">
                          <h4>{t.askMeAbout}</h4>
                          <div className="options-grid">
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('increase')}
                            >
                              {t.optionIncrease}
                            </button>
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('risks')}
                            >
                              {t.optionRisks}
                            </button>
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('harvest')}
                            >
                              {t.optionHarvest}
                            </button>
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('storage')}
                            >
                              {t.optionStorage}
                            </button>
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('alternatives')}
                            >
                              {t.optionAlternatives}
                            </button>
                            <button 
                              className="option-button" 
                              onClick={() => handleOptionClick('market')}
                            >
                              {t.optionMarket}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Selected Option Content */}
                    {!isInsightsLoading && selectedOption && (
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
                    {t.resultTip.replace('{crop}', getLocalizedCropName(formData.crop))}
                  </p>
                  
                  <button 
                    className="restart-button"
                    onClick={restartForm}
                  >
                    {t.startNew}
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
                    onClick={restartForm}
                  >
                    {t.tryAgain}
                  </button>
                </div>
              )}
              
              {!prediction && !error && step === 4 && (
                <div className="result-loading">
                  <div className="loading-spinner"></div>
                  <p>{t.processing}</p>
                </div>
              )}
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
          gap: 1.5rem;
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
          font-size: 0.85rem;
        }

        .alert-icon {
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
          margin-bottom: 1.5rem;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e2e8f0;
          color: #a0aec0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.4rem;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }
        
        .progress-step.active .step-number {
          background-color: #2f855a;
          color: white;
        }
        
        .step-label {
          font-size: 0.75rem;
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
          margin: 0 0.4rem;
        }
        
        .form-title {
          font-size: 1.25rem;
          color: #2f855a;
          margin-bottom: 0.4rem;
        }
        
        .form-description {
          color: #4a5568;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
        }
        
        .form-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .result-step {
          animation: fadeIn 0.5s ease-out;
        }
        
        @media (min-width: 640px) {
          .form-fields {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }
        
        .form-group {
          margin-bottom: 0.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
          color: #2d3748;
          font-size: 0.85rem;
        }

        .required {
          color: #e53e3e;
          margin-left: 2px;
        }
        
        input, select {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
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
          margin-right: 0.4rem;
        }
        
        .radio-option label {
          margin: 0;
          font-size: 0.85rem;
        }
        
        .input-help {
          display: block;
          font-size: 0.7rem;
          color: #718096;
          margin-top: 0.25rem;
        }
        
        .form-nav {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        
        .btn-prev, .btn-next, .btn-submit, .btn-restart {
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
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
          background-color: #2f855a;
          color: white;
          border: none;
        }

        .btn-restart:hover {
          background-color: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .arrow {
          font-size: 1rem;
        }
        
        .result {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 1.25rem;
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
          font-size: 0.85rem;
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
          font-size: 0.85rem;
        }
        
        .prediction-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1.25rem 0;
        }
        
        .prediction-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: #2f855a;
        }
        
        .prediction-unit {
          font-size: 1rem;
          color: #718096;
        }
        
        .prediction-details {
          display: flex;
          justify-content: space-around;
          margin: 1.25rem 0;
          background-color: #f0fff4;
          padding: 0.8rem;
          border-radius: 6px;
        }

        .prediction-more-details {
          background-color: #f0fff4;
          border-radius: 6px;
          padding: 0.8rem;
          margin: 0.5rem 0 1.25rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px dashed #c6f6d5;
          font-size: 0.85rem;
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
          font-size: 0.75rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.85rem;
        }
        
        .result-tip {
          font-size: 0.8rem;
          color: #718096;
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
        
        .result-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
        }
        
        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(47, 133, 90, 0.1);
          border-top-color: #2f855a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
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
        
        .optimization-tip {
          background-color: white;
          border-radius: 6px;
          padding: 0.6rem;
          margin-bottom: 1rem;
          border-left: 2px solid #2f855a;
        }
        
        .optimization-tip h4 {
          color: #2f855a;
          margin-top: 0;
          margin-bottom: 0.3rem;
          font-size: 0.8rem;
        }
        
        .optimization-tip p {
          margin: 0;
          color: #4a5568;
          font-size: 0.75rem;
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
            font-size: 1.1rem;
          }
          
          .form-description {
            font-size: 0.8rem;
          }
          
          .form-fields {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .form-progress {
            margin-bottom: 1rem;
          }
          
          .step-number {
            width: 24px;
            height: 24px;
            font-size: 0.75rem;
          }
          
          .step-label {
            font-size: 0.65rem;
          }
          
          .prediction-details {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .prediction-value {
            font-size: 2rem;
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
          
          .detail-label, .detail-value {
            font-size: 0.7rem;
          }
          
          .prediction-value {
            font-size: 1.75rem;
          }
          
          .prediction-unit {
            font-size: 0.85rem;
          }
          
          .form-nav {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .btn-next, .btn-submit, .btn-prev {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default YieldForm
