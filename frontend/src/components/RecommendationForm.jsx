import { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { LanguageContext } from '../context/LanguageContext'
import Translatable from '../components/Translatable'
import '../styles/RecommendationForm.css';

function RecommendationForm() {
  const { language } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  // Parameter ranges for validation
  const paramRanges = {
    N: { min: 0, max: 140, name: "Nitrogen" },
    P: { min: 5, max: 145, name: "Phosphorus" },
    K: { min: 5, max: 205, name: "Potassium" },
    temperature: { min: 8, max: 45, name: "Temperature" },
    humidity: { min: 14, max: 100, name: "Humidity" },
    ph: { min: 3.5, max: 10, name: "pH" },
    rainfall: { min: 20, max: 300, name: "Rainfall" }
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
        language: language === 'hi' ? 'hindi' : 'english',
        date: "2025-08-03" // Current date
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
      // Try to use your backend API - using the chatbot URL
      const baseUrl = 'https://agrochatbot.onrender.com';
      const response = await axios.post(`${baseUrl}/api/chat`, {
        prompt: prompt,
        language: promptData.language,
        responseFormat: 'json'
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (err) {
      console.error("Backend API error:", err);
      throw new Error("API request failed");
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
        chickpea: {
          mainCrop: {
            profitMargin: "medium",
            marketDemand: "medium",
            growthDifficulty: "low",
            waterNeeds: "low",
            growthTime: "medium",
            bestPractices: "Ensure good drainage and control aphids."
          },
          alternatives: [
            {name: "Lentil", reason: "Similar growing conditions"},
            {name: "Mung Bean", reason: "Faster harvest time"},
            {name: "Mustard", reason: "Good rotation crop"}
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
        chickpea: {
          mainCrop: {
            profitMargin: "मध्यम",
            marketDemand: "मध्यम",
            growthDifficulty: "निम्न",
            waterNeeds: "निम्न",
            growthTime: "मध्यम",
            bestPractices: "अच्छा जल निकास सुनिश्चित करें और एफिड्स को नियंत्रित करें।"
          },
          alternatives: [
            {name: "मसूर", reason: "समान उगाने की स्थितियां"},
            {name: "मूंग", reason: "तेज़ फसल समय"},
            {name: "सरसों", reason: "अच्छी रोटेशन फसल"}
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
    const langData = language === 'hi' ? fallbackData.hindi : fallbackData.english;
    
    // Try to find crop-specific data or use generic
    if (langData[cropLower]) {
      mainCropInsights = langData[cropLower].mainCrop;
      alternativeCrops = langData[cropLower].alternatives;
    } else {
      // Generic fallback data
      if (language === 'hi') {
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
  
  // Helper function to sanitize numeric inputs for mobile
  const sanitizeNumberInput = (value) => {
    // Remove any non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, '');
  };
  
  // Function to generate fallback prediction when API fails
  const generateFallbackPrediction = () => {
    // Based on soil parameters, determine the most suitable crop
    const N = parseFloat(formData.N);
    const P = parseFloat(formData.P);
    const K = parseFloat(formData.K);
    const temp = parseFloat(formData.temperature);
    const humidity = parseFloat(formData.humidity);
    const ph = parseFloat(formData.ph);
    const rainfall = parseFloat(formData.rainfall);
    
    // Simple decision tree for crop recommendation
    if (N > 100 && rainfall > 200) {
      return "Rice";
    } else if (N < 60 && P > 100 && ph > 7) {
      return "Chickpea";
    } else if (temp > 30 && rainfall < 100) {
      return "Millet";
    } else if (ph < 6 && rainfall > 150) {
      return "Maize";
    } else if (K > 150 && humidity > 80) {
      return "Cotton";
    } else if (P > 80 && humidity < 60) {
      return "Wheat";
    } else {
      return "Soybean"; // Default fallback
    }
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
    const responses = {
      profitability: {
        title: "Profitability Comparison",
        subtitle1: prediction + " (Recommended)",
        content1: [
          "• Current market price: Good",
          "• ROI: ~30-40% with proper management"
        ],
        subtitle2: "Alternatives",
        content2: alternatives.map(alt => `• **${alt.name}**: ${getRandomProfitability(alt.name)}`),
        subtitle3: "Most profitable: " + getMostProfitableCrop()
      },
      easier: {
        title: "Ease of Growing",
        subtitle1: prediction + " (Recommended)",
        content1: [
          "• Difficulty: " + (insights.growthDifficulty || 'Medium'),
          "• Disease resistance: Moderate",
          "• Labor needed: Average"
        ],
        subtitle2: "Alternatives",
        content2: alternatives.map(alt => `• **${alt.name}**: ${getRandomDifficulty(alt.name)}`),
        subtitle3: "Easiest for beginners: " + getEasiestCrop()
      },
      demand: {
        title: "Market Demand (August 2025)",
        subtitle1: prediction + ": " + (insights.marketDemand || 'Medium'),
        content1: [],
        subtitle2: alternatives.map(alt => alt.name + ": " + getRandomDemand(alt.name)).join("\n"),
        content2: [],
        subtitle3: "Local markets favor: " + getBestMarketCrop()
      },
      diseases: {
        title: "Common Diseases & Prevention",
        subtitle1: prediction,
        content1: [getDiseaseInfo(prediction)],
        subtitle2: "Prevention Tips",
        content2: [
          "• Use resistant varieties",
          "• Follow crop rotation",
          "• Spray preventively during risky periods"
        ]
      },
      harvesting: {
        title: "Harvesting Tips for " + prediction,
        content1: [
          "• Harvest in morning hours when cooler",
          "• Look for: " + getHarvestSigns(prediction),
          "• Store promptly after harvesting",
          "• Use proper tools to minimize damage"
        ]
      },
      storage: {
        title: "Storage Requirements for " + prediction,
        content1: [
          "• Temperature: " + getStorageTemp(prediction),
          "• Humidity: " + getStorageHumidity(prediction),
          "• Duration: Can store for " + getStorageDuration(prediction) + " with proper conditions",
          "• Key tip: " + getStorageTip(prediction)
        ]
      }
    };
    
    return responses[selectedOption];
  };
  
  // Helper functions for generating concise responses
  const getRandomProfitability = (crop) => {
    const options = language === 'hi' 
      ? ["उच्च लाभ-कम जोखिम", "मध्यम निवेश-मध्यम रिटर्न", "कम निवेश-कम देखभाल"] 
      : ["High profit-low risk", "Medium investment-medium return", "Low investment-low maintenance"];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRandomDifficulty = (crop) => {
    const options = language === 'hi' 
      ? ["कम देखभाल चाहिए", "विशेषज्ञ प्रबंधन चाहिए", "शुरुआती के लिए अच्छा"] 
      : ["Low maintenance required", "Expert management needed", "Good for beginners"];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const getRandomDemand = (crop) => {
    const options = language === 'hi' 
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
    if (language === 'hi') {
      return `पत्ती धब्बा, फफूंदी और जड़ सड़न सबसे आम बीमारियां हैं। फसल निगरानी और नियमित रूप से स्वच्छता बनाए रखें।`;
    } else {
      return `Leaf spot, powdery mildew and root rot are most common. Monitor crops and maintain regular sanitation.`;
    }
  };
  
  const getHarvestSigns = (crop) => {
    if (language === 'hi') {
      return `परिपक्व रंग, सही आकार, पत्ती संकेत`;
    } else {
      return `mature color, proper size, leaf signs`;
    }
  };
  
  const getStorageTemp = (crop) => {
    return "12-15°C";
  };
  
  const getStorageHumidity = (crop) => {
    return "60-70%";
  };
  
  const getStorageDuration = (crop) => {
    return language === 'hi' ? "3-6 महीने" : "3-6 months";
  };
  
  const getStorageTip = (crop) => {
    if (language === 'hi') {
      return `सूखी, हवादार जगह पर रखें और नियमित रूप से जांचें`;
    } else {
      return `Keep in dry, ventilated place and check regularly`;
    }
  };

  // Reset validation errors when form changes
  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Special handling for numeric inputs on mobile
    if (
      isMobile && 
      ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].includes(name)
    ) {
      value = sanitizeNumberInput(value);
    }
    
    setFormData({ ...formData, [name]: value });
    
    // Clear the specific validation error when field is changed
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {}
    
    Object.entries(formData).forEach(([key, value]) => {
      const range = paramRanges[key]
      
      // Check if field is empty
      if (!value) {
        errors[key] = language === 'hi'
          ? `${range.name} आवश्यक है` 
          : `${range.name} is required`
        return
      }
      
      // Check if value is within valid range
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        errors[key] = language === 'hi'
          ? `${range.name} एक संख्या होनी चाहिए` 
          : `${range.name} must be a number`
      } else if (numValue < range.min || numValue > range.max) {
        errors[key] = language === 'hi'
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
      // Get the base URL dynamically
      const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5002' 
        : 'https://crop-recommendation-api-393g.onrender.com';
      
      console.log("Using API URL:", baseUrl);
      
      const response = await axios.post(`${baseUrl}/predict_crop`, formData, {
        // Add timeout to prevent hanging requests
        timeout: 20000,
        // Ensure proper headers for cross-origin requests
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("API response:", response.data);
      
      if (response.data && response.data.crop) {
        setPrediction(response.data.crop)
        setShowResults(true)
        // Insights will be auto-generated via useEffect
      } else {
        throw new Error("Invalid response format from API")
      }
    } catch (err) {
      console.error("API Error:", err);
      
      // Check if user is offline or if there's a timeout
      if (!navigator.onLine || (err.code && err.code === 'ECONNABORTED')) {
        // Provide a fallback prediction
        const fallbackPrediction = generateFallbackPrediction();
        console.log("Using fallback prediction:", fallbackPrediction);
        setPrediction(fallbackPrediction);
        setShowResults(true);
        setError("Using estimated recommendation. We couldn't connect to our prediction server. This is an approximate result.");
      } else {
        // Provide more detailed error messages for debugging
        let errorMessage = 'An error occurred while connecting to the server';
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Server error: ${err.response.status} - ${err.response.data?.error || err.message}`;
          console.log("Response error:", err.response);
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage = 'No response received from server. Please check your connection or try again later.';
          console.log("Request error:", err.request);
          
          // If the request was made but no response received, it might be a CORS issue or server unavailability
          // Provide a fallback prediction after 3 seconds
          setTimeout(() => {
            if (!prediction && !showResults) {
              const fallbackPrediction = generateFallbackPrediction();
              console.log("Using delayed fallback prediction:", fallbackPrediction);
              setPrediction(fallbackPrediction);
              setShowResults(true);
              setError("Using estimated recommendation due to server timeout. This is an approximate result.");
            }
          }, 3000);
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
    if (!cropName) return '';
    
    // Instead of hardcoding translations, use Translatable
    return <Translatable>{cropName}</Translatable>;
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
  
  // Render the option response content
  const renderOptionResponse = () => {
    const response = getOptionResponse();
    if (!response) return null;
    
    return (
      <div className="option-response">
        <h3><Translatable>{response.title}</Translatable></h3>
        
        {response.subtitle1 && (
          <h4><Translatable>{response.subtitle1}</Translatable></h4>
        )}
        
        {response.content1 && response.content1.map((line, index) => (
          <p key={index}><Translatable>{line}</Translatable></p>
        ))}
        
        {response.subtitle2 && (
          <h4><Translatable>{response.subtitle2}</Translatable></h4>
        )}
        
        {response.content2 && response.content2.map((line, index) => (
          <p key={index}><Translatable>{line}</Translatable></p>
        ))}
        
        {response.subtitle3 && (
          <h4><Translatable>{response.subtitle3}</Translatable></h4>
        )}
      </div>
    );
  };

  return (
    <div className="recommendation-form-container">
      <div className="form-card">
        <h2 className="form-title"><Translatable>Crop Recommendation</Translatable></h2>
        <p className="form-description">
          <Translatable>Enter your soil and climate data to get AI-powered crop recommendations.</Translatable>
        </p>
        
        {Object.keys(validationErrors).length > 0 && (
          <div className="validation-summary">
            <div className="validation-header">
              <span className="validation-icon">!</span>
              <h4><Translatable>Please fix the following errors:</Translatable></h4>
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
                  <Translatable>Nitrogen (N)</Translatable> <span className="required">*</span> <span className="unit"><Translatable>mg/kg</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 0-140 mg/kg</Translatable></small>
                {validationErrors.N && <div className="field-error">{validationErrors.N}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="P">
                  <Translatable>Phosphorus (P)</Translatable> <span className="required">*</span> <span className="unit"><Translatable>mg/kg</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 5-145 mg/kg</Translatable></small>
                {validationErrors.P && <div className="field-error">{validationErrors.P}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="K">
                  <Translatable>Potassium (K)</Translatable> <span className="required">*</span> <span className="unit"><Translatable>mg/kg</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 5-205 mg/kg</Translatable></small>
                {validationErrors.K && <div className="field-error">{validationErrors.K}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="temperature">
                  <Translatable>Temperature</Translatable> <span className="required">*</span> <span className="unit"><Translatable>°C</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 8-45 °C</Translatable></small>
                {validationErrors.temperature && <div className="field-error">{validationErrors.temperature}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="humidity">
                  <Translatable>Humidity</Translatable> <span className="required">*</span> <span className="unit"><Translatable>%</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 14-100%</Translatable></small>
                {validationErrors.humidity && <div className="field-error">{validationErrors.humidity}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="ph">
                  <Translatable>pH</Translatable> <span className="required">*</span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 3.5-10</Translatable></small>
                {validationErrors.ph && <div className="field-error">{validationErrors.ph}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="rainfall">
                  <Translatable>Rainfall</Translatable> <span className="required">*</span> <span className="unit"><Translatable>mm</Translatable></span>
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
                  inputMode="numeric" // Better for mobile numeric input
                />
                <small className="input-help"><Translatable>Typical range: 20-300 mm</Translatable></small>
                {validationErrors.rainfall && <div className="field-error">{validationErrors.rainfall}</div>}
              </div>
            </div>
            
            <button
              type="submit"
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? <Translatable>Processing...</Translatable> : <Translatable>Get Recommendation</Translatable>}
            </button>
          </form>
        ) : (
          <div className="results-container">
            {prediction && (
              <div className="result success">
                <div className="result-header">
                  <h3><Translatable>Recommendation</Translatable></h3>
                  <span className="result-icon">✓</span>
                </div>
                
                {error && (
                  <div className="prediction-warning">
                    <p>{error}</p>
                  </div>
                )}
                
                <p className="result-message"><Translatable>Based on your input, we recommend growing:</Translatable></p>
                <div className="crop-result">{getLocalizedCropName(prediction)}</div>
                
                <div className="parameters-summary">
                  <h4><Translatable>Your Soil & Climate Parameters:</Translatable></h4>
                  <div className="params-grid">
                    <div className="param-item">
                      <span className="param-label"><Translatable>Nitrogen:</Translatable></span>
                      <span className="param-value">{formData.N} <Translatable>mg/kg</Translatable></span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>Phosphorus:</Translatable></span>
                      <span className="param-value">{formData.P} <Translatable>mg/kg</Translatable></span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>Potassium:</Translatable></span>
                      <span className="param-value">{formData.K} <Translatable>mg/kg</Translatable></span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>Temperature:</Translatable></span>
                      <span className="param-value">{formData.temperature}<Translatable>°C</Translatable></span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>Humidity:</Translatable></span>
                      <span className="param-value">{formData.humidity}<Translatable>%</Translatable></span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>pH Level:</Translatable></span>
                      <span className="param-value">{formData.ph}</span>
                    </div>
                    <div className="param-item">
                      <span className="param-label"><Translatable>Rainfall:</Translatable></span>
                      <span className="param-value">{formData.rainfall} <Translatable>mm</Translatable></span>
                    </div>
                  </div>
                </div>
                
                {/* AI Insights Section */}
                <div className="insights-section" ref={insightsRef}>
                  <h3 className="insights-title">
                    <Translatable>Smart Insights for {prediction}</Translatable>
                  </h3>
                  
                  {isChatbotLoading && (
                    <div className="insights-loading">
                      <div className="insights-spinner"></div>
                      <p><Translatable>Analyzing your data...</Translatable></p>
                    </div>
                  )}
                  
                  {/* Main Crop Insights */}
                  {!isChatbotLoading && Object.keys(insights).length > 0 && !selectedOption && (
                    <div className="main-crop-insights">
                      <div className="insights-grid">
                        <div className="insight-card">
                          <h4><Translatable>Profit</Translatable></h4>
                          {getRatingVisual(insights.profitMargin)}
                        </div>
                        <div className="insight-card">
                          <h4><Translatable>Demand</Translatable></h4>
                          {getRatingVisual(insights.marketDemand)}
                        </div>
                        <div className="insight-card">
                          <h4><Translatable>Difficulty</Translatable></h4>
                          {getRatingVisual(insights.growthDifficulty)}
                        </div>
                        <div className="insight-card">
                          <h4><Translatable>Water Needs</Translatable></h4>
                          {getRatingVisual(insights.waterNeeds)}
                        </div>
                        <div className="insight-card">
                          <h4><Translatable>Growth Time</Translatable></h4>
                          {getRatingVisual(insights.growthTime)}
                        </div>
                      </div>
                      
                      {insights.bestPractices && (
                        <div className="best-practices">
                          <h4><Translatable>Best Practices</Translatable></h4>
                          <p><Translatable>{insights.bestPractices}</Translatable></p>
                        </div>
                      )}
                      
                      {/* Alternative Crops */}
                      {alternatives.length > 0 && (
                        <div className="alternatives-section">
                          <h4><Translatable>Alternative Crops</Translatable></h4>
                          <div className="alternatives-grid">
                            {alternatives.map((alt, index) => (
                              <div className="alternative-card" key={index}>
                                <div className="alternative-name"><Translatable>{alt.name}</Translatable></div>
                                <div className="alternative-reason"><Translatable>{alt.reason}</Translatable></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Options for More Information */}
                      <div className="options-section">
                        <h4><Translatable>Ask me about:</Translatable></h4>
                        <div className="options-grid">
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('profitability')}
                          >
                            <Translatable>Which is more profitable?</Translatable>
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('easier')}
                          >
                            <Translatable>Which is easier to grow?</Translatable>
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('demand')}
                          >
                            <Translatable>Market demand comparison</Translatable>
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('diseases')}
                          >
                            <Translatable>Common diseases & prevention</Translatable>
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('harvesting')}
                          >
                            <Translatable>Harvesting techniques</Translatable>
                          </button>
                          <button 
                            className="option-button" 
                            onClick={() => handleOptionClick('storage')}
                          >
                            <Translatable>Storage requirements</Translatable>
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
                        ← <Translatable>Back to options</Translatable>
                      </button>
                      
                      {renderOptionResponse()}
                    </div>
                  )}
                </div>
                
                <p className="result-tip">
                  <Translatable>This crop is well-suited to your soil nutrients and climate conditions. For optimal results, follow recommended agricultural practices for {prediction}.</Translatable>
                </p>
                
                <button 
                  className="restart-button"
                  onClick={resetForm}
                >
                  <Translatable>Start New Recommendation</Translatable>
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
                  <Translatable>Please check your inputs and try again. If the problem persists, our server may be experiencing issues.</Translatable>
                </p>
                <button 
                  className="restart-button error-restart"
                  onClick={resetForm}
                >
                  <Translatable>Try Again</Translatable>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="info-card">
        <h3><Translatable>Understanding Soil Parameters</Translatable></h3>
        <div className="info-item">
          <h4><Translatable>Nitrogen (N)</Translatable></h4>
          <p><Translatable>Essential for leaf growth and protein formation. Deficiency causes yellowing of leaves and stunted growth.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Phosphorus (P)</Translatable></h4>
          <p><Translatable>Important for root development, flowering, and seed formation. Deficiency stunts growth and reduces yields.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Potassium (K)</Translatable></h4>
          <p><Translatable>Helps in overall health of the plant by strengthening cell walls. Deficiency causes weak stems and poor disease resistance.</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>pH Level</Translatable></h4>
          <p><Translatable>Measures soil acidity or alkalinity on a scale of 0-14. Most crops prefer a slightly acidic to neutral pH (6.0-7.0).</Translatable></p>
        </div>
        <div className="info-item">
          <h4><Translatable>Climate Factors</Translatable></h4>
          <p><Translatable>Temperature, humidity, and rainfall significantly impact crop growth cycles and productivity. Different crops have different optimal conditions.</Translatable></p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationForm
