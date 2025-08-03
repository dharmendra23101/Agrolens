import { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { LanguageContext } from '../context/LanguageContext'
import Translatable from '../components/Translatable'
import '../styles/YieldForm.css';

function YieldForm() {
  const { language } = useContext(LanguageContext)
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      console.log("Is mobile device:", mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

    if (predictedYield > 4.5) return language === 'hi' ? "उत्कृष्ट" : "excellent";
    if (predictedYield > 3.5) return language === 'hi' ? "अच्छा" : "good";
    if (predictedYield > 2.5) return language === 'hi' ? "औसत" : "average";
    if (predictedYield > 1.5) return language === 'hi' ? "उचित" : "fair";
    return language === 'hi' ? "कमज़ोर" : "poor";
  };

  // Calculate profit potential
  const getProfitPotential = () => {
    // Logic to determine profit potential
    const weather = formData.weather;
    const fertilizer = formData.fertilizer === "Yes";
    const irrigation = formData.irrigation === "Yes";

    if ((weather === "Sunny" || weather === "Cloudy") && fertilizer && irrigation) {
      return language === 'hi' ? "उच्च" : "high";
    }
    if (fertilizer || irrigation) {
      return language === 'hi' ? "मध्यम" : "medium";
    }
    return language === 'hi' ? "निम्न" : "low";
  };

  // Calculate resource efficiency
  const getResourceEfficiency = () => {
    // Logic to determine resource efficiency
    const rainfall = parseInt(formData.rainfall);
    const irrigation = formData.irrigation === "Yes";

    if (rainfall > 200 && !irrigation) return language === 'hi' ? "उत्कृष्ट" : "excellent";
    if ((rainfall > 150 && !irrigation) || (rainfall < 100 && irrigation)) return language === 'hi' ? "अच्छा" : "good";
    return language === 'hi' ? "औसत" : "average";
  };

  // Calculate market timing
  const getMarketTiming = () => {
    // Logic to determine market timing
    const daysToHarvest = parseInt(formData.days_to_harvest);

    if (daysToHarvest < 60) return language === 'hi' ? "इष्टतम" : "optimal";
    if (daysToHarvest < 90) return language === 'hi' ? "अच्छा" : "good";
    return language === 'hi' ? "उप-इष्टतम" : "suboptimal";
  };

  // Calculate risk level
  const getRiskLevel = () => {
    // Logic to determine risk level
    const weather = formData.weather;
    const irrigation = formData.irrigation === "Yes";

    if (weather === "Rainy" && !irrigation) return language === 'hi' ? "उच्च" : "high";
    if (weather === "Sunny" && !irrigation) return language === 'hi' ? "मध्यम" : "medium";
    return language === 'hi' ? "निम्न" : "low";
  };

  // Get optimization tip
  const getOptimizationTip = () => {
    // Logic to determine optimization tip
    const fertilizer = formData.fertilizer === "Yes";
    const irrigation = formData.irrigation === "Yes";
    const soil = formData.soil_type;

    if (!fertilizer) {
      return language === 'hi' ?
        "फसल के प्रकार के अनुसार उचित उर्वरक का उपयोग करके उपज 20-30% तक बढ़ाएं।" :
        "Increase yield by 20-30% using appropriate fertilizers for your crop type.";
    }

    if (!irrigation) {
      return language === 'hi' ?
        "सूखा अवधि के दौरान उपज की सुरक्षा के लिए बारिश के पानी का संरक्षण करें या सिंचाई लागू करें।" :
        "Conserve rainwater or implement irrigation to protect yield during dry periods.";
    }

    if (soil === "Sandy") {
      return language === 'hi' ?
        "रेतीली मिट्टी में जैविक पदार्थ जोड़ें और अधिक बार पानी दें लेकिन कम मात्रा में।" :
        "Add organic matter to sandy soil and water more frequently but in smaller amounts.";
    }

    return language === 'hi' ?
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

    // Define all responses for all options
    const responses = {
      increase: {
        title: "How to Increase Your " + formData.crop + " Yield",
        subtitle: "Key Strategies:",
        bullets: [
          getKeyIncreaseStrategy1(),
          getKeyIncreaseStrategy2(),
          getKeyIncreaseStrategy3()
        ],
        subtitle2: "For Your Specific Conditions:",
        content: `Based on your ${formData.soil_type} soil and ${formData.weather.toLowerCase()} weather conditions, focus on ${getSpecificIncreaseStrategy()}.`
      },
      risks: {
        title: "Main Risks for Your " + formData.crop + " Crop",
        subtitle: "Current Risk Level: " + getRiskLevel(),
        subtitle2: "Top Concerns:",
        bullets: [
          getMainRisk1(),
          getMainRisk2(),
          getMainRisk3()
        ],
        subtitle3: "Mitigation Strategy:",
        content: getRiskMitigation()
      },
      harvest: {
        title: "Best Harvest Window for " + formData.crop,
        subtitle: "Optimal Timing:",
        content: `Your crop should be ready in about ${formData.days_to_harvest} days from planting.
The best harvest window is ${getHarvestWindow()}.`,
        subtitle2: "Harvest Indicators:",
        content2: `Look for ${getHarvestIndicators()}`,
        subtitle3: "Weather Consideration:",
        content3: getHarvestWeatherTip()
      },
      storage: {
        title: "Storage Considerations for " + formData.crop,
        subtitle: "Recommended Conditions:",
        bullets: [
          "Temperature: " + getStorageTemp(),
          "Humidity: " + getStorageHumidity(),
          "Ventilation: " + getStorageVentilation()
        ],
        subtitle2: "Max Storage Duration:",
        content: "With proper conditions: " + getStorageDuration(),
        subtitle3: "Key Storage Tip:",
        content2: getStorageTip()
      },
      alternatives: {
        title: "Alternative Crops for Your Conditions",
        content: `Based on your soil type (${formData.soil_type}) and climate inputs:`,
        subtitle: "Recommended Alternatives:",
        bullets: [
          getAlternativeCrop1() + ": " + getAlternativeReason1(),
          getAlternativeCrop2() + ": " + getAlternativeReason2(),
          getAlternativeCrop3() + ": " + getAlternativeReason3()
        ],
        subtitle2: "Comparison with Current Choice:",
        content2: getAlternativeComparison()
      },
      market: {
        title: "Market Outlook for " + formData.crop,
        subtitle: "Current Trend:",
        content: getMarketTrend(),
        subtitle2: "Price Forecast:",
        content2: getPriceForecast(),
        subtitle3: "Demand Drivers:",
        bullets: [
          getDemandDriver1(),
          getDemandDriver2()
        ],
        subtitle4: "Best Selling Window:",
        content3: getBestSellingWindow()
      }
    };

    return responses[selectedOption];
  };

  // Helper functions for generating option responses
  const getKeyIncreaseStrategy1 = () => {
    const strategies = [
      "Optimize plant spacing based on soil fertility",
      "Apply precision fertilization at critical growth stages",
      "Implement proper weed management early in growth cycle"
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const getKeyIncreaseStrategy2 = () => {
    const strategies = [
      "Monitor and maintain optimal soil moisture",
      "Use disease-resistant varieties suited to your region",
      "Apply foliar sprays at recommended intervals"
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const getKeyIncreaseStrategy3 = () => {
    const strategies = [
      "Practice crop rotation to break pest cycles",
      "Time planting according to seasonal conditions",
      "Use integrated pest management techniques"
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const getSpecificIncreaseStrategy = () => {
    if (formData.soil_type === "Sandy") {
      return "adding more organic matter and improving water retention";
    }

    if (formData.soil_type === "Clay") {
      return "improving drainage and soil structure";
    }

    if (formData.weather === "Rainy") {
      return "ensuring good drainage and controlling fungal diseases";
    }

    if (formData.weather === "Sunny" && formData.irrigation === "No") {
      return "water conservation techniques and mulching";
    }

    return "overall soil health and nutrient management";
  };

  const getMainRisk1 = () => {
    const map = {
      "Rainy": "Fungal diseases due to excess moisture",
      "Sunny": "Drought stress and water scarcity",
      "Cloudy": "Insufficient photosynthesis"
    };

    return map[formData.weather] || "Weather variability";
  };

  const getMainRisk2 = () => {
    const map = {
      "Sandy": "Rapid leaching of water and nutrients",
      "Clay": "Waterlogging and root diseases",
      "Loam": "Weed competition",
      "Silt": "Soil crusting and poor germination"
    };

    return map[formData.soil_type] || "Soil compatibility";
  };

  const getMainRisk3 = () => {
    if (formData.fertilizer === "No") {
      return "Nutrient deficiency and slow growth";
    }

    if (formData.irrigation === "No") {
      return "Irregular growth in dry conditions";
    }

    const options = ["Pest infestation", "Price volatility", "Disease outbreaks"];

    return options[Math.floor(Math.random() * options.length)];
  };

  const getRiskMitigation = () => {
    if (formData.weather === "Rainy" && formData.soil_type === "Clay") {
      return "Create raised beds and ensure good drainage. Monitor for fungal diseases regularly and apply preventive sprays.";
    }

    if (formData.weather === "Sunny" && formData.irrigation === "No") {
      return "Use mulch to retain soil moisture. Consider drought-resistant varieties and implement water conservation techniques.";
    }

    if (formData.fertilizer === "No") {
      return "Apply balanced fertilizers according to crop-specific requirements. Conduct soil tests and monitor for nutrient deficiencies.";
    }

    return "Practice integrated pest management. Monitor weather and plan farming activities accordingly. Reduce risk through diversification.";
  };

  const getHarvestWindow = () => {
    const daysToHarvest = parseInt(formData.days_to_harvest);

    if (daysToHarvest < 70) {
      return "60-70 days after planting";
    } else if (daysToHarvest < 100) {
      return "90-100 days after planting";
    } else {
      return "120-130 days after planting";
    }
  };

  const getHarvestIndicators = () => {
    const cropMap = {
      "Rice": "yellow-golden grains, 80-85% maturity",
      "Wheat": "yellow-brown stems, hard grains",
      "Maize": "dry silk, fully filled ears",
      "Cotton": "open bolls, white fiber",
      "Barley": "yellow-golden spikes, dry grains",
      "Soybean": "brown-yellow pods, most leaves fallen"
    };

    return cropMap[formData.crop] || "mature color and proper size";
  };

  const getHarvestWeatherTip = () => {
    if (formData.weather === "Rainy") {
      return "Avoid harvesting after rain as it can increase moisture and affect quality during storage. Wait for dry days.";
    }

    if (formData.weather === "Sunny") {
      return "Harvest during morning or evening to avoid excessive heat. Process promptly if possible to prevent crop degradation.";
    }

    return "Ensure the crop is dry and preferably harvest during morning hours when temperatures are moderate.";
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

  const getStorageVentilation = () => {
    return "Good";
  };

  const getStorageDuration = () => {
    const cropMap = {
      "Rice": "6-12 months",
      "Wheat": "8-12 months",
      "Maize": "6-8 months",
      "Cotton": "8-10 months",
      "Barley": "8-10 months",
      "Soybean": "6-8 months"
    };

    return cropMap[formData.crop] || "6-8 months";
  };

  const getStorageTip = () => {
    return "Keep in dry, ventilated place and check regularly.";
  };

  const getAlternativeCrop1 = () => {
    // Suggest alternative crops based on current crop and soil type
    const alternatives = {
      "Rice": "Maize",
      "Wheat": "Barley",
      "Maize": "Sunflower",
      "Cotton": "Soybean",
      "Barley": "Wheat",
      "Soybean": "Mung Bean"
    };

    return alternatives[formData.crop] || "Wheat";
  };

  const getAlternativeCrop2 = () => {
    const alternatives = {
      "Rice": "Black Gram",
      "Wheat": "Mustard",
      "Maize": "Millet",
      "Cotton": "Groundnut",
      "Barley": "Chickpea",
      "Soybean": "Lentil"
    };

    return alternatives[formData.crop] || "Chickpea";
  };

  const getAlternativeCrop3 = () => {
    const alternatives = {
      "Rice": "Mung Bean",
      "Wheat": "Maize",
      "Maize": "Soybean",
      "Cotton": "Sorghum",
      "Barley": "Oats",
      "Soybean": "Sunflower"
    };

    return alternatives[formData.crop] || "Mustard";
  };

  const getAlternativeReason1 = () => {
    if (formData.soil_type === "Sandy") {
      return "Drought resistant, requires less water";
    }

    if (formData.soil_type === "Clay") {
      return "Improves soil structure";
    }

    return "Similar weather requirements, good rotation option";
  };

  const getAlternativeReason2 = () => {
    if (formData.weather === "Rainy") {
      return "Performs well in higher moisture conditions";
    }

    if (formData.weather === "Sunny") {
      return "Drought tolerant, needs less water";
    }

    return "Lower inputs, good market value";
  };

  const getAlternativeReason3 = () => {
    if (formData.fertilizer === "No") {
      return "Requires less fertilizer";
    }

    if (formData.irrigation === "No") {
      return "Grows well on rainfall";
    }

    return "Good for diversification, lower risk";
  };

  const getAlternativeComparison = () => {
    return `Compared to ${formData.crop}, these alternatives offer either lower water requirements, reduced input costs, or better weather adaptability. Consider a mix of 2-3 crops to reduce risk based on your situation.`;
  };

  const getMarketTrend = () => {
    const trends = [
      `${formData.crop} prices have been steadily rising over the past season due to increased demand.`,
      `${formData.crop} market has shown stability with slight upward movement.`,
      `${formData.crop} has experienced price fluctuations but maintains overall positive trend.`
    ];

    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getPriceForecast = () => {
    if (formData.fertilizer === "Yes" && formData.irrigation === "Yes") {
      return "Likely to increase 10-15% in the coming season, especially for high-quality produce";
    }

    return "Expected to remain stable over next 3-6 months, with seasonal fluctuations";
  };

  const getDemandDriver1 = () => {
    const drivers = [
      "Increasing consumer preference for sustainable farming products",
      "Growing export market opportunities",
      "Rising demand in food processing industries"
    ];

    return drivers[Math.floor(Math.random() * drivers.length)];
  };

  const getDemandDriver2 = () => {
    const drivers = [
      "Government policies supporting domestic agriculture",
      "Increasing population and food security needs",
      "Climate-induced shortages in competing regions"
    ];

    return drivers[Math.floor(Math.random() * drivers.length)];
  };

  const getBestSellingWindow = () => {
    // Logic to determine best selling window
    const daysToHarvest = parseInt(formData.days_to_harvest);
    let harvestMonth;

    // Assuming planting in May
    if (daysToHarvest < 80) {
      harvestMonth = "July-August";
    } else if (daysToHarvest < 120) {
      harvestMonth = "August-September";
    } else {
      harvestMonth = "October-November";
    }

    return `Don't sell immediately after harvest. Consider selling 3-4 weeks after your ${harvestMonth} harvest when supply is lower and prices are higher.`;
  };

  // Helper function to sanitize numeric inputs for mobile
  const sanitizeNumberInput = (value) => {
    // Remove any non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, '');
  };

  // Handle form input changes
  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Special handling for numeric inputs on mobile
    if (
      isMobile && 
      (name === 'rainfall' || 
       name === 'temperature' || 
       name === 'days_to_harvest')
    ) {
      value = sanitizeNumberInput(value);
    }
    
    setFormData({ ...formData, [name]: value });
    setValidationError(null); // Clear validation errors when user makes changes
  }

  // Function to generate fallback prediction when API fails
  const generateFallbackPrediction = () => {
    // Generate a reasonable prediction based on inputs
    const baseYield = {
      'Rice': 3.5,
      'Wheat': 3.2,
      'Maize': 4.1,
      'Cotton': 2.8,
      'Barley': 3.0,
      'Soybean': 2.5
    }[formData.crop] || 3.0;
    
    // Adjust for soil type
    const soilFactor = {
      'Sandy': 0.8,
      'Clay': 1.1,
      'Loam': 1.2,
      'Silt': 1.0,
      'Peaty': 0.9,
      'Chalky': 0.85
    }[formData.soil_type] || 1.0;
    
    // Adjust for other factors
    const fertilizerFactor = formData.fertilizer === 'Yes' ? 1.15 : 0.9;
    const irrigationFactor = formData.irrigation === 'Yes' ? 1.2 : 0.85;
    
    // Calculate final yield
    const finalYield = (baseYield * soilFactor * fertilizerFactor * irrigationFactor).toFixed(2);
    
    return finalYield;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null) // Reset prediction before new request
    setInsights({})
    setSelectedOption(null)

    try {
      console.log("Submitting form data:", formData);
      
      // Get the base URL dynamically
      const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5001' 
        : 'https://your-production-api-url.com'; // Update with your actual production API URL
      
      const response = await axios.post(`${baseUrl}/predict_yield`, formData, {
        // Add timeout to prevent hanging requests
        timeout: 15000,
        // Ensure proper headers for cross-origin requests
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
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
      
      // Check if user is offline
      if (navigator.onLine === false) {
        // User is offline - provide a fallback
        const fallbackPrediction = generateFallbackPrediction();
        console.log("Using fallback prediction:", fallbackPrediction);
        setPrediction(fallbackPrediction);
        setStep(4);
        setError("Using estimated prediction. You appear to be offline.");
      } else {
        // Provide more detailed error messages for debugging
        let errorMessage = 'An error occurred while connecting to the server';
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Server error: ${err.response.status} - ${err.response.data?.error || err.message}`;
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = 'No response received from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Request error: ${err.message}`;
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.soil_type || !formData.crop || !formData.days_to_harvest) {
          setValidationError(<Translatable>Please fill in all required fields before proceeding.</Translatable>)
          return false
        }
        break
      case 2:
        if (!formData.rainfall || !formData.temperature || !formData.weather) {
          setValidationError(<Translatable>Please fill in all required fields before proceeding.</Translatable>)
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
    return <Translatable>{cropName}</Translatable>;
  };

  // Get visual rating for insights
  // Fix for the getRatingVisual function to eliminate duplicate keys
  const getRatingVisual = (value) => {
    if (!value) return '—';

    // Map text values to numeric for visualization - fixed to avoid duplicate keys
    const ratingMap = {
      // English quality ratings (5-point scale)
      'excellent': 5,
      'good': 4,
      'average': 3,
      'fair': 2,
      'poor': 1,

      // Hindi quality ratings (5-point scale)
      'उत्कृष्ट': 5,
      'अच्छा': 4,
      'औसत': 3,
      'उचित': 2,
      'कमज़ोर': 1,

      // English intensity ratings (3-point scale)
      'high': 3,
      'medium': 2,
      'low': 1,

      // Hindi intensity ratings (3-point scale)
      'उच्च': 3,
      'मध्यम': 2,
      'निम्न': 1,

      // English status ratings (3-point scale)
      'optimal': 3,
      'suboptimal': 1,

      // Hindi status ratings (3-point scale)
      'इष्टतम': 3,
      'उप-इष्टतम': 1
    };

    const rating = ratingMap[value.toLowerCase()] || 3;

    // Determine the max rating based on the type of value
    let maxRating = 3; // Default to 3-point scale

    // Check if it's a quality rating (5-point scale)
    const qualityRatings = ['excellent', 'good', 'average', 'fair', 'poor',
      'उत्कृष्ट', 'अच्छा', 'औसत', 'उचित', 'कमज़ोर'];

    if (qualityRatings.includes(value.toLowerCase())) {
      maxRating = 5;
    }

    return (
      <div className="rating-visual">
        {[...Array(maxRating)].map((_, i) => (
          <span key={i} className={`rating-dot ${i < rating ? 'active' : ''}`}></span>
        ))}
        <span className="rating-text">{value}</span>
      </div>
    );
  };

  // Render the option response
  const renderOptionResponse = () => {
    const response = getOptionResponse();
    if (!response) return null;

    return (
      <div className="option-response">
        <h3><Translatable>{response.title}</Translatable></h3>

        {response.subtitle && (
          <h4><Translatable>{response.subtitle}</Translatable></h4>
        )}

        {response.bullets && (
          <ul>
            {response.bullets.map((bullet, index) => (
              <li key={index}><Translatable>{bullet}</Translatable></li>
            ))}
          </ul>
        )}

        {response.content && (
          <p><Translatable>{response.content}</Translatable></p>
        )}

        {response.subtitle2 && (
          <h4><Translatable>{response.subtitle2}</Translatable></h4>
        )}

        {response.content2 && (
          <p><Translatable>{response.content2}</Translatable></p>
        )}

        {response.subtitle3 && (
          <h4><Translatable>{response.subtitle3}</Translatable></h4>
        )}

        {response.content3 && (
          <p><Translatable>{response.content3}</Translatable></p>
        )}

        {response.subtitle4 && (
          <h4><Translatable>{response.subtitle4}</Translatable></h4>
        )}
      </div>
    );
  };

  return (
    <div className="yield-form-container">
      <div className="form-card">
        <div className="form-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label"><Translatable>Crop Information</Translatable></div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label"><Translatable>Environment</Translatable></div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label"><Translatable>Farming Practices</Translatable></div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label"><Translatable>Results</Translatable></div>
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
              <h2 className="form-title"><Translatable>Tell us about your crop</Translatable></h2>
              <p className="form-description">
                <Translatable>Provide information about your soil type and crop selection to help us make accurate predictions.</Translatable>
              </p>

              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="soil_type">
                    <Translatable>Soil Type</Translatable> <span className="required">*</span>
                  </label>
                  <select
                    id="soil_type"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled><Translatable>Select soil type</Translatable></option>
                    <option value="Sandy"><Translatable>Sandy</Translatable></option>
                    <option value="Clay"><Translatable>Clay</Translatable></option>
                    <option value="Loam"><Translatable>Loam</Translatable></option>
                    <option value="Silt"><Translatable>Silt</Translatable></option>
                    <option value="Peaty"><Translatable>Peaty</Translatable></option>
                    <option value="Chalky"><Translatable>Chalky</Translatable></option>
                  </select>
                  <small className="input-help"><Translatable>Different soil types affect water retention and nutrient availability</Translatable></small>
                </div>

                <div className="form-group">
                  <label htmlFor="crop">
                    <Translatable>Crop Type</Translatable> <span className="required">*</span>
                  </label>
                  <select
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled><Translatable>Select crop</Translatable></option>
                    <option value="Cotton"><Translatable>Cotton</Translatable></option>
                    <option value="Rice"><Translatable>Rice</Translatable></option>
                    <option value="Barley"><Translatable>Barley</Translatable></option>
                    <option value="Soybean"><Translatable>Soybean</Translatable></option>
                    <option value="Wheat"><Translatable>Wheat</Translatable></option>
                    <option value="Maize"><Translatable>Maize</Translatable></option>
                  </select>
                  <small className="input-help"><Translatable>Select the crop for which you want to predict yield</Translatable></small>
                </div>

                <div className="form-group">
                  <label htmlFor="days_to_harvest">
                    <Translatable>Days to Harvest</Translatable> <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="days_to_harvest"
                    name="days_to_harvest"
                    value={formData.days_to_harvest}
                    onChange={handleChange}
                    placeholder="60-150"
                    required
                    inputMode="numeric" // Better for mobile numeric input
                  />
                  <small className="input-help"><Translatable>Estimated number of days from planting to harvest</Translatable></small>
                </div>
              </div>

              <div className="form-nav">
                <div></div> {/* Empty div for spacing */}
                <button type="button" className="btn-next" onClick={nextStep}>
                  <Translatable>Next</Translatable> <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2 className="form-title"><Translatable>Environmental conditions</Translatable></h2>
              <p className="form-description">
                <Translatable>Climate and weather factors greatly influence crop growth and yield potential.</Translatable>
              </p>

              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="rainfall">
                    <Translatable>Rainfall</Translatable> <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="0-500"
                    required
                    inputMode="numeric" // Better for mobile numeric input
                  />
                  <small className="input-help"><Translatable>Average rainfall in millimeters</Translatable></small>
                </div>

                <div className="form-group">
                  <label htmlFor="temperature">
                    <Translatable>Temperature</Translatable> <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="10-40"
                    required
                    inputMode="numeric" // Better for mobile numeric input
                  />
                  <small className="input-help"><Translatable>Average temperature in degrees Celsius</Translatable></small>
                </div>

                <div className="form-group">
                  <label htmlFor="weather">
                    <Translatable>Weather Condition</Translatable> <span className="required">*</span>
                  </label>
                  <select
                    id="weather"
                    name="weather"
                    value={formData.weather}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled><Translatable>Select weather</Translatable></option>
                    <option value="Cloudy"><Translatable>Cloudy</Translatable></option>
                    <option value="Rainy"><Translatable>Rainy</Translatable></option>
                    <option value="Sunny"><Translatable>Sunny</Translatable></option>
                  </select>
                  <small className="input-help"><Translatable>Predominant weather condition during growing season</Translatable></small>
                </div>
              </div>

              <div className="form-nav">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <span className="arrow">←</span> <Translatable>Back</Translatable>
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  <Translatable>Next</Translatable> <span className="arrow">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2 className="form-title"><Translatable>Farming practices</Translatable></h2>
              <p className="form-description">
                <Translatable>Agricultural practices significantly affect crop yields and sustainability.</Translatable>
              </p>

              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="fertilizer"><Translatable>Fertilizer Usage</Translatable></label>
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
                      <label htmlFor="fertilizer-yes"><Translatable>Yes</Translatable></label>
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
                      <label htmlFor="fertilizer-no"><Translatable>No</Translatable></label>
                    </div>
                  </div>
                  <small className="input-help"><Translatable>Whether you use chemical or organic fertilizers</Translatable></small>
                </div>

                <div className="form-group">
                  <label htmlFor="irrigation"><Translatable>Irrigation System</Translatable></label>
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
                      <label htmlFor="irrigation-yes"><Translatable>Yes</Translatable></label>
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
                      <label htmlFor="irrigation-no"><Translatable>No</Translatable></label>
                    </div>
                  </div>
                  <small className="input-help"><Translatable>Whether artificial irrigation is used</Translatable></small>
                </div>
              </div>

              <div className="form-nav">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <span className="arrow">←</span> <Translatable>Back</Translatable>
                </button>
                <button
                  type="submit"
                  className={`btn-submit ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? <Translatable>Processing...</Translatable> : <Translatable>Predict Yield</Translatable>}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step result-step">
              <h2 className="form-title"><Translatable>Your yield prediction results</Translatable></h2>
              <p className="form-description">
                <Translatable>Based on your inputs, here's our prediction for your crop yield.</Translatable>
              </p>

              {prediction && (
                <div className="result success">
                  <div className="result-header">
                    <h3><Translatable>Prediction Complete</Translatable></h3>
                    <span className="result-icon">✓</span>
                  </div>
                  
                  {error && (
                    <div className="prediction-warning">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="prediction-result">
                    <div className="prediction-value">{prediction}</div>
                    <div className="prediction-unit"><Translatable>tons per hectare</Translatable></div>
                  </div>
                  <div className="prediction-details">
                    <div className="detail-item">
                      <div className="detail-label"><Translatable>Crop</Translatable></div>
                      <div className="detail-value">{getLocalizedCropName(formData.crop)}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label"><Translatable>Soil</Translatable></div>
                      <div className="detail-value"><Translatable>{formData.soil_type}</Translatable></div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label"><Translatable>Growth Period</Translatable></div>
                      <div className="detail-value">{formData.days_to_harvest} <Translatable>days</Translatable></div>
                    </div>
                  </div>
                  <div className="prediction-more-details">
                    <div className="detail-row">
                      <span className="detail-key"><Translatable>Temperature</Translatable>:</span>
                      <span className="detail-value">{formData.temperature}°C</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key"><Translatable>Rainfall</Translatable>:</span>
                      <span className="detail-value">{formData.rainfall} mm</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key"><Translatable>Weather Condition</Translatable>:</span>
                      <span className="detail-value"><Translatable>{formData.weather}</Translatable></span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key"><Translatable>Fertilizer Usage</Translatable>:</span>
                      <span className="detail-value">{formData.fertilizer === "Yes" ? <Translatable>Yes</Translatable> : <Translatable>No</Translatable>}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-key"><Translatable>Irrigation System</Translatable>:</span>
                      <span className="detail-value">{formData.irrigation === "Yes" ? <Translatable>Yes</Translatable> : <Translatable>No</Translatable>}</span>
                    </div>
                  </div>

                  {/* Insights Section */}
                  <div className="insights-section" ref={insightsRef}>
                    <h3 className="insights-title"><Translatable>Yield Insights</Translatable></h3>

                    {isInsightsLoading && (
                      <div className="insights-loading">
                        <div className="insights-spinner"></div>
                        <p><Translatable>Generating insights...</Translatable></p>
                      </div>
                    )}

                    {/* Main Insights */}
                    {!isInsightsLoading && Object.keys(insights).length > 0 && !selectedOption && (
                      <div className="main-insights">
                        <div className="insights-grid">
                          <div className="insight-card">
                            <h4><Translatable>Yield Quality</Translatable></h4>
                            {getRatingVisual(insights.yieldQuality)}
                          </div>
                          <div className="insight-card">
                            <h4><Translatable>Profit Potential</Translatable></h4>
                            {getRatingVisual(insights.profitPotential)}
                          </div>
                          <div className="insight-card">
                            <h4><Translatable>Resource Efficiency</Translatable></h4>
                            {getRatingVisual(insights.resourceEfficiency)}
                          </div>
                          <div className="insight-card">
                            <h4><Translatable>Market Timing</Translatable></h4>
                            {getRatingVisual(insights.marketTiming)}
                          </div>
                          <div className="insight-card">
                            <h4><Translatable>Risk Factors</Translatable></h4>
                            {getRatingVisual(insights.riskFactors)}
                          </div>
                        </div>

                        {insights.optimizationTip && (
                          <div className="optimization-tip">
                            <h4><Translatable>Optimization Tip</Translatable></h4>
                            <p><Translatable>{insights.optimizationTip}</Translatable></p>
                          </div>
                        )}

                        {/* Options for More Information */}
                        <div className="options-section">
                          <h4><Translatable>Ask me about:</Translatable></h4>
                          <div className="options-grid">
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('increase')}
                            >
                              <Translatable>How to increase yield</Translatable>
                            </button>
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('risks')}
                            >
                              <Translatable>Potential risks</Translatable>
                            </button>
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('harvest')}
                            >
                              <Translatable>Harvesting tips</Translatable>
                            </button>
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('storage')}
                            >
                              <Translatable>Storage conditions</Translatable>
                            </button>
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('alternatives')}
                            >
                              <Translatable>Alternative crops</Translatable>
                            </button>
                            <button
                              className="option-button"
                              onClick={() => handleOptionClick('market')}
                            >
                              <Translatable>Market outlook</Translatable>
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
                          ← <Translatable>Back to all options</Translatable>
                        </button>

                        {renderOptionResponse()}
                      </div>
                    )}
                  </div>

                  <p className="result-tip">
                    <Translatable>Remember that these predictions are estimates based on your inputs. Actual yield may vary based on many factors including exact weather conditions, pests, and specific agricultural practices.</Translatable>
                  </p>

                  <button
                    className="restart-button"
                    onClick={restartForm}
                  >
                    <Translatable>Start a new prediction</Translatable>
                  </button>
                </div>
              )}

              {error && !prediction && (
                <div className="result error">
                  <div className="result-header">
                    <h3><Translatable>Error</Translatable></h3>
                    <span className="result-icon">!</span>
                  </div>
                  <p className="result-message">{error}</p>
                  <p className="result-tip">
                    <Translatable>There was a problem processing your request. Please check your inputs and try again. If the problem persists, our servers might be experiencing issues.</Translatable>
                  </p>
                  <button
                    className="restart-button error-restart"
                    onClick={restartForm}
                  >
                    <Translatable>Try again</Translatable>
                  </button>
                </div>
              )}

              {!prediction && !error && step === 4 && (
                <div className="result-loading">
                  <div className="loading-spinner"></div>
                  <p><Translatable>Processing your request...</Translatable></p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="info-card">
        <h3><Translatable>Helpful Information</Translatable></h3>
        <div className="info-item">
          <h4><Translatable>Soil Types</Translatable></h4>
          <p><Translatable>Different soil types have varying water retention and nutrient profiles that impact crop growth. Sandy soils drain quickly, while clay soils retain water longer.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Weather Impact</Translatable></h4>
          <p><Translatable>Weather conditions during the growing season significantly affect yield. Temperature extremes, rainfall patterns, and sunlight exposure all play crucial roles in crop development.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Fertilizer Benefits</Translatable></h4>
          <p><Translatable>Proper fertilization provides essential nutrients that may be lacking in soil. Balanced fertilizer application can substantially increase yields and improve crop quality.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Irrigation Systems</Translatable></h4>
          <p><Translatable>Irrigation ensures consistent water supply during dry periods. Modern irrigation systems can improve water use efficiency and help maintain optimal soil moisture levels.</Translatable></p>
        </div>
      </div>
    </div>
  )
}

export default YieldForm
