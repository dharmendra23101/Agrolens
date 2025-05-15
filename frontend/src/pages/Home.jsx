import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';

// Import multiple images for the carousel
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';

// Weather icons
import {
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm,
  WiFog, WiDayCloudy, WiHumidity, WiStrongWind,
  WiBarometer, WiThermometer, WiNightClear, WiNightRain
} from 'react-icons/wi';

function Home() {
  // Access language context
  const { language, isHindi } = useContext(LanguageContext);
  
  // State for the image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [img1, img2, img3, img4, img5];

  // State for tracking if the page is loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // State for weather data
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [cityName, setCityName] = useState('');

  // Refs for scroll animation elements
  const scrollElementsRef = useRef([]);

  // Translations
  const translations = {
    english: {
      welcome: "Welcome to",
      heroSubtitle: "Empowering farmers with AI-driven insights for better crop yield and recommendations",
      predictYield: "Predict Yield",
      recommendCrops: "Recommend Crops",
      currentWeather: "Current Weather",
      fullForecast: "Full Forecast",
      humidity: "Humidity",
      wind: "Wind",
      feelsLike: "Feels Like",
      loadingWeather: "Loading weather data...",
      
      ourServices: "Our Services",
      servicesSubtitle: "Leverage cutting-edge AI technology to optimize your farming operations",
      
      yieldPrediction: "Yield Prediction",
      yieldPredictionDesc: "Predict your crop yield based on soil conditions, weather patterns, and farming practices to optimize your harvest planning.",
      predictNow: "Predict Now",
      
      cropRecommendation: "Crop Recommendation",
      cropRecommendationDesc: "Get personalized crop recommendations based on soil nutrients, climate conditions, and environmental factors.",
      getRecommendations: "Get Recommendations",
      
      weatherAnalysis: "Weather Analysis",
      weatherAnalysisDesc: "Stay informed about weather conditions that affect your crops with real-time data and agricultural weather insights.",
      viewWeather: "View Weather",
      
      howItWorks: "How It Works",
      
      step1Title: "Input Your Data",
      step1Desc: "Enter soil composition, climate conditions, and farming practices",
      
      step2Title: "AI Analysis",
      step2Desc: "Our machine learning models analyze your data against extensive agricultural datasets",
      
      step3Title: "Get Results",
      step3Desc: "Receive personalized yield predictions or crop recommendations",
      
      ctaTitle: "Ready to optimize your farming?",
      ctaSubtitle: "Start using AgroLens today and see the difference in your next harvest."
    },
    hindi: {
      welcome: "आपका स्वागत है",
      heroSubtitle: "कृषि उपज और सिफारिशों के लिए AI-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना",
      predictYield: "उपज का अनुमान",
      recommendCrops: "फसल अनुशंसा",
      currentWeather: "वर्तमान मौसम",
      fullForecast: "पूर्ण पूर्वानुमान",
      humidity: "आर्द्रता",
      wind: "हवा",
      feelsLike: "अनुभूति",
      loadingWeather: "मौसम डेटा लोड हो रहा है...",
      
      ourServices: "हमारी सेवाएँ",
      servicesSubtitle: "अपने कृषि कार्यों को अनुकूलित करने के लिए अत्याधुनिक AI तकनीक का लाभ उठाएं",
      
      yieldPrediction: "उपज का अनुमान",
      yieldPredictionDesc: "मिट्टी की स्थिति, मौसम पैटर्न और कृषि प्रथाओं के आधार पर अपनी फसल की उपज का अनुमान लगाएं और अपनी फसल योजना को अनुकूलित करें।",
      predictNow: "अभी अनुमान लगाएं",
      
      cropRecommendation: "फसल अनुशंसा",
      cropRecommendationDesc: "मिट्टी के पोषक तत्वों, जलवायु परिस्थितियों और पर्यावरणीय कारकों के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें।",
      getRecommendations: "सिफारिशें प्राप्त करें",
      
      weatherAnalysis: "मौसम विश्लेषण",
      weatherAnalysisDesc: "वास्तविक समय के डेटा और कृषि मौसम अंतर्दृष्टि के साथ मौसम की स्थिति से अवगत रहें जो आपकी फसलों को प्रभावित करती हैं।",
      viewWeather: "मौसम देखें",
      
      howItWorks: "यह कैसे काम करता है",
      
      step1Title: "अपना डेटा दर्ज करें",
      step1Desc: "मिट्टी की संरचना, जलवायु परिस्थितियों और कृषि प्रथाओं को दर्ज करें",
      
      step2Title: "AI विश्लेषण",
      step2Desc: "हमारे मशीन लर्निंग मॉडल व्यापक कृषि डेटासेट के विरुद्ध आपके डेटा का विश्लेषण करते हैं",
      
      step3Title: "परिणाम प्राप्त करें",
      step3Desc: "व्यक्तिगत उपज अनुमान या फसल सिफारिशें प्राप्त करें",
      
      ctaTitle: "अपनी खेती को अनुकूलित करने के लिए तैयार हैं?",
      ctaSubtitle: "आज ही AgroLens का उपयोग शुरू करें और अपनी अगली फसल में अंतर देखें।"
    }
  };

  const t = isHindi ? translations.hindi : translations.english;

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Set page as loaded after a small delay
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError("Failed to get location: " + err.message);
          setLoading(false);
          // Default to Delhi if geolocation fails
          setLocation({ lat: 28.6139, lon: 77.209 });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      // Default location - Delhi
      setLocation({ lat: 28.6139, lon: 77.209 });
    }
  }, []);

  // Fetch weather data when location is available
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);

      // Using OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=c912a5db6bb06b6f5eda28c721611990`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Set current weather (first item in the list)
      setWeatherData(data.list[0]);
      setCityName(data.city.name);

      // Process forecast data - get one forecast per day (noon time) for the next 3 days
      const processedForecast = [];
      const today = new Date().setHours(0, 0, 0, 0);
      const uniqueDays = {};

      data.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
        const forecastDay = new Date(forecast.dt * 1000).getDate();

        // Skip today's forecasts
        if (forecastDate === today) return;

        // Try to get forecast around noon (12-15) for each day
        const hour = new Date(forecast.dt * 1000).getHours();

        if (!uniqueDays[forecastDay] && hour >= 12 && hour <= 15) {
          uniqueDays[forecastDay] = true;
          processedForecast.push(forecast);
        }
      });

      setForecastData(processedForecast.slice(0, 3)); // Take next 3 days
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch weather data: " + error.message);
      setLoading(false);
    }
  };

  // Get weather icon based on condition code
  const getWeatherIcon = (conditionCode, isDayTime = true) => {
    // Map OpenWeatherMap condition codes to icons
    if (conditionCode >= 200 && conditionCode < 300)
      return <WiThunderstorm className="weather-icon-svg thunderstorm-icon" />;  // Thunderstorm

    if (conditionCode >= 300 && conditionCode < 600)
      return isDayTime ?
        <WiRain className="weather-icon-svg rain-icon" /> :
        <WiNightRain className="weather-icon-svg rain-icon" />;  // Drizzle and Rain

    if (conditionCode >= 600 && conditionCode < 700)
      return <WiSnow className="weather-icon-svg snow-icon" />;  // Snow

    if (conditionCode >= 700 && conditionCode < 800)
      return <WiFog className="weather-icon-svg fog-icon" />;  // Atmosphere (fog, mist, etc.)

    if (conditionCode === 800)
      return isDayTime ?
        <WiDaySunny className="weather-icon-svg sun-icon" /> :
        <WiNightClear className="weather-icon-svg moon-icon" />;  // Clear

    if (conditionCode > 800)
      return <WiDayCloudy className="weather-icon-svg cloud-icon" />;  // Clouds

    return <WiDaySunny className="weather-icon-svg sun-icon" />; // Default
  };

  // Format date to day name
  const formatDayName = (timestamp) => {
    const days = isHindi ? 
      ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'] :
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000);
    return days[date.getDay()];
  };

  // Handle scroll animations with Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Get all elements with animate-on-scroll class
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElementsRef.current = scrollElements;

    scrollElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      if (scrollElementsRef.current) {
        scrollElementsRef.current.forEach(element => {
          observer.unobserve(element);
        });
      }
    };
  }, [isLoaded]);

  return (
    <div className={`home-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fade-in">
          <motion.h1
            className="animate-slide-up"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t.welcome} <span className="brand-text">Agro<span>Lens</span></span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/yield-prediction" className="btn btn-primary">
              <span className="btn-icon">🌾</span>
              {t.predictYield}
            </Link>
            <Link to="/crop-recommendation" className="btn btn-secondary">
              <span className="btn-icon">🌿</span>
              {t.recommendCrops}
            </Link>
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            className="weather-widget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {loading ? (
              <div className="weather-loading">
                <div className="loading-spinner"></div>
                <p>{t.loadingWeather}</p>
              </div>
            ) : error ? (
              <div className="weather-error">{error}</div>
            ) : weatherData && (
              <div className="weather-card">
                <div className="weather-header">
                  <div className="weather-header-content">
                    <h3>{t.currentWeather}</h3>
                    <Link to="/weather" className="weather-details-link">
                      {t.fullForecast} <span>→</span>
                    </Link>
                  </div>
                  <p className="weather-location">{cityName}</p>
                </div>

                <div className="weather-content">
                  <div className="current-weather-main">
                    <div className="weather-icon">
                      {getWeatherIcon(weatherData.weather[0].id)}
                    </div>
                    <div className="weather-main-details">
                      <div className="weather-temp">{Math.round(weatherData.main.temp)}°C</div>
                      <div className="weather-condition">{weatherData.weather[0].description}</div>
                    </div>
                  </div>

                  <div className="weather-stats-row">
                    <div className="weather-stat">
                      <WiHumidity className="stat-icon humidity-icon" />
                      <div className="stat-data">
                        <span className="stat-value">{weatherData.main.humidity}%</span>
                        <span className="stat-label">{t.humidity}</span>
                      </div>
                    </div>

                    <div className="weather-stat">
                      <WiStrongWind className="stat-icon wind-icon" />
                      <div className="stat-data">
                        <span className="stat-value">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</span>
                        <span className="stat-label">{t.wind}</span>
                      </div>
                    </div>

                    <div className="weather-stat">
                      <WiThermometer className="stat-icon feels-like-icon" />
                      <div className="stat-data">
                        <span className="stat-value">{Math.round(weatherData.main.feels_like)}°C</span>
                        <span className="stat-label">{t.feelsLike}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {forecastData.length > 0 && (
                  <div className="forecast-preview">
                    <div className="forecast-days-preview">
                      {forecastData.map((day, index) => (
                        <div key={index} className="forecast-day-preview">
                          <div className="day-name-preview">{formatDayName(day.dt).slice(0, 3)}</div>
                          <div className="day-icon-preview">
                            {getWeatherIcon(day.weather[0].id)}
                          </div>
                          <div className="day-temp-preview">
                            {Math.round(day.main.temp)}°C
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut"
          }}
          whileInView={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
          }}
          viewport={{ once: true }}
        >
          <motion.div
            className="image-carousel"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {images.map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Agricultural field ${index + 1}`}
                className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
                initial={{
                  opacity: index === 0 ? 1 : 0,
                  scale: index === currentImageIndex ? 1.05 : 1,
                  rotate: index === currentImageIndex ? 0 : 1
                }}
                animate={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.05,
                  rotate: index === currentImageIndex ? 0 : 1
                }}
                transition={{
                  opacity: { duration: 0.7, ease: "easeInOut" },
                  scale: { duration: 1.2, ease: "easeOut" },
                  rotate: { duration: 1.0, ease: "easeInOut" }
                }}
                style={{
                  filter: index === currentImageIndex ? "brightness(1)" : "brightness(0.8)",
                  zIndex: index === currentImageIndex ? 2 : 1
                }}
              />
            ))}

            {/* Overlay gradient for better text contrast if needed */}
            <motion.div
              className="carousel-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))",
                zIndex: 3,
                pointerEvents: "none"
              }}
            />

            <motion.div
              className="carousel-indicators"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Slide ${index + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: index === currentImageIndex ? 1.2 : 1,
                    backgroundColor: index === currentImageIndex
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.5)"
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>

            {/* Optional: Navigation arrows for better UX */}
            <motion.button
              className="carousel-nav prev"
              onClick={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(5px)",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 4
              }}
            >
              ←
            </motion.button>

            <motion.button
              className="carousel-nav next"
              onClick={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(5px)",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 4
              }}
            >
              →
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <motion.h2
          className="section-title animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {t.ourServices}
        </motion.h2>
        <motion.p
          className="section-subtitle animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t.servicesSubtitle}
        </motion.p>

        <div className="features-grid">
          <motion.div
            className="feature-card yield-card animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="feature-icon yield-icon">🌾</div>
            <h3>{t.yieldPrediction}</h3>
            <p>{t.yieldPredictionDesc}</p>
            <Link to="/yield-prediction" className="feature-link">{t.predictNow} →</Link>
          </motion.div>

          <motion.div
            className="feature-card crop-card animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="feature-icon crop-icon">🌿</div>
            <h3>{t.cropRecommendation}</h3>
            <p>{t.cropRecommendationDesc}</p>
            <Link to="/crop-recommendation" className="feature-link">{t.getRecommendations} →</Link>
          </motion.div>

          <motion.div
            className="feature-card weather-card animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="feature-icon weather-icon">☁️</div>
            <h3>{t.weatherAnalysis}</h3>
            <p>{t.weatherAnalysisDesc}</p>
            <Link to="/weather" className="feature-link">{t.viewWeather} →</Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <motion.h2
          className="section-title animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {t.howItWorks}
        </motion.h2>
        <div className="steps">
          <motion.div
            className="step animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="step-number">1</div>
            <h3>{t.step1Title}</h3>
            <p>{t.step1Desc}</p>
          </motion.div>
          <motion.div
            className="step animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="step-number">2</div>
            <h3>{t.step2Title}</h3>
            <p>{t.step2Desc}</p>
          </motion.div>
          <motion.div
            className="step animate-on-scroll"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="step-number">3</div>
            <h3>{t.step3Title}</h3>
            <p>{t.step3Desc}</p>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <motion.h2
          className="animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {t.ctaTitle}
        </motion.h2>
        <motion.p
          className="animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t.ctaSubtitle}
        </motion.p>
        <motion.div
          className="cta-buttons animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link to="/yield-prediction" className="btn btn-primary">
            <span className="btn-icon">🌾</span>
            {t.predictYield}
          </Link>
          <Link to="/crop-recommendation" className="btn btn-outline">
            <span className="btn-icon">🌿</span>
            {t.recommendCrops}
          </Link>
        </motion.div>
      </section>

      {/* Add the styling - include all your original CSS here */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          /* Main color palette */
          --primary-color: #2f855a;
          --primary-dark: #276749;
          --primary-light: #c6f6d5;
          --secondary-color: #38a169;
          --accent-color: #4299e1;
          --text-color: #2d3748;
          --text-light: #4a5568;
          --background-light: #f8faf9;
          --background-card: #ffffff;
          
          /* Weather icon colors */
          --sunny-color: #ff9900;
          --sunset-color: #ff6b35;
          --cloud-color: #5e7184;
          --rain-color: #4299e1;
          --thunder-color: #805ad5;
          --snow-color: #a0aec0;
          --fog-color: #718096;
          --humidity-color: #0bc5ea;
          --wind-color: #48bb78;
          --pressure-color: #7c689b;
          --moon-color: #4a5568;
          
          /* Feature card colors */
          --yield-color: #f6ad55;
          --crop-color: #48bb78;
          --weather-color: #4299e1;
          
          /* Shadow variables */
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
          --shadow-lg: 0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05);
          --shadow-hover: 0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12);
          
          /* Border radius */
          --border-radius-sm: 6px;
          --border-radius-md: 12px;
          --border-radius-lg: 20px;
          
          /* Transitions */
          --transition-fast: 0.2s ease;
          --transition-normal: 0.3s ease;
          --transition-slow: 0.5s ease;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        }
        
        .home-page {
          width: 100%;
          overflow-x: hidden;
          background: linear-gradient(to bottom, #f9fafb, #f1f5f9);
        }
        
        /* Hero Section */
        .hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 4rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
          min-height: 60vh;
          gap: 2rem;
        }
        
        .hero-content {
          flex: 1;
          min-width: 300px;
        }
        
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          color: #222;
          background: linear-gradient(to right, var(--text-color), var(--primary-dark));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .brand-text {
          font-weight: 900;
          letter-spacing: -1px;
        }
        
        .brand-text span {
          color: var(--primary-color);
          -webkit-text-fill-color: var(--primary-color);
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-light);
          margin-bottom: 2rem;
          max-width: 540px;
          line-height: 1.5;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          margin-bottom: 2rem;
        }
        
        /* Enhanced Weather Widget Styles */
        .weather-widget {
          margin-top: 2rem;
          width: 100%;
          max-width: 400px;
        }
        
        .weather-loading {
          padding: 1.5rem;
          border-radius: var(--border-radius-md);
          background: var(--background-light);
          text-align: center;
          color: var(--text-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-md);
        }
        
        .loading-spinner {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid #f8faf9;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .weather-error {
          padding: 1rem;
          border-radius: var(--border-radius-md);
          background: #fee2e2;
          color: #b91c1c;
          text-align: center;
          box-shadow: var(--shadow-md);
        }
        
        .weather-card {
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .weather-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }
        
        .weather-header {
          background: linear-gradient(135deg, var(--primary-dark), var(--secondary-color));
          color: white;
          padding: 1rem 1.2rem;
        }
        
        .weather-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }
        
        .weather-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .weather-details-link {
          color: white;
          font-size: 0.85rem;
          text-decoration: none;
          opacity: 0.9;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .weather-details-link:hover {
          opacity: 1;
          text-decoration: underline;
        }
        
        .weather-details-link span {
          transition: var(--transition-fast);
        }
        
        .weather-details-link:hover span {
          transform: translateX(3px);
        }
        
                .weather-location {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .weather-content {
          padding: 1.2rem;
          background-color: var(--background-light);
        }
        
        .current-weather-main {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .weather-icon {
          display: flex;
          justify-content: center;
          width: 80px;
          margin-right: 1rem;
        }
        
        /* Weather icon styling */
        .weather-icon-svg {
          width: 64px;
          height: 64px;
          animation: pulse 3s ease-in-out infinite;
        }
        
        .sun-icon {
          color: var(--sunny-color);
        }
        
        .cloud-icon {
          color: var(--cloud-color);
        }
        
        .rain-icon {
          color: var(--rain-color);
        }
        
        .snow-icon {
          color: var(--snow-color);
        }
        
        .thunderstorm-icon {
          color: var(--thunder-color);
        }
        
        .fog-icon {
          color: var(--fog-color);
        }
        
        .moon-icon {
          color: var(--moon-color);
        }
        
        .weather-main-details {
          flex: 1;
        }
        
        .weather-temp {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 0.3rem;
        }
        
        .weather-condition {
          font-size: 1rem;
          color: var(--text-light);
          text-transform: capitalize;
        }
        
        .weather-stats-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.8rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        
        .weather-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 110px;
        }
        
        .stat-icon {
          font-size: 1.5rem;
        }
        
        .humidity-icon {
          color: var(--humidity-color);
        }
        
        .wind-icon {
          color: var(--wind-color);
        }
        
        .feels-like-icon {
          color: var(--primary-color);
        }
        
        .stat-data {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-color);
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-light);
        }
        
        /* Forecast Preview */
        .forecast-preview {
          padding: 1rem;
          background: white;
        }
        
        .forecast-days-preview {
          display: flex;
          justify-content: space-around;
        }
        
        .forecast-day-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          flex: 1;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        
        .forecast-day-preview:hover {
          background: var(--background-light);
          transform: translateY(-2px);
        }
        
        .day-name-preview {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.3rem;
        }
        
        .day-icon-preview {
          margin-bottom: 0.3rem;
        }
        
        .day-icon-preview .weather-icon-svg {
          width: 35px;
          height: 35px;
        }
        
        .day-temp-preview {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-color);
        }
        
        /* Image Carousel Styles */
        .hero-image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          min-width: 300px;
        }
        
        .image-carousel {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease;
          border-radius: var(--border-radius-md);
        }
        
        .hero-image.active {
          opacity: 1;
        }
        
        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 2;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        /* Animation Classes */
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        .animate-fade-in-delay-1 {
          animation: fadeIn 1s ease-in-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-in-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up-delay-1 {
          animation: slideUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.8s ease-out;
        }
        
        /* Animation Keyframes */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        /* Enhanced Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        
        .btn:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        
        .btn:hover:after {
          animation: ripple 1s ease-out;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          100% {
            transform: scale(100, 100);
            opacity: 0;
          }
        }
        
        .btn-icon {
          font-size: 1.1rem;
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .btn-secondary {
          background-color: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }
        
        .btn-secondary:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .btn-outline {
          background-color: transparent;
          border: 2px solid white;
          color: white;
        }
        
        .btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        /* Enhanced Features Section */
        .features {
          padding: 5rem 2rem;
          background-color: white;
          text-align: center;
        }
        
        .section-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(to right, var(--primary-light), var(--primary-color));
          border-radius: 2px;
        }
        
        .section-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          max-width: 700px;
          margin: 1.5rem auto 3rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
          text-align: left;
          border-top: 4px solid var(--primary-color);
        }
        
        .yield-card {
          border-top-color: var(--yield-color);
        }
        
        .crop-card {
          border-top-color: var(--crop-color);
        }
        
        .weather-card {
          border-top-color: var(--weather-color);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary-dark);
          animation: pulse 3s infinite;
          transition: var(--transition-normal);
        }
        
        .yield-icon {
          background: #fff3e0;
          color: var(--yield-color);
        }
        
        .crop-icon {
          background: #e6fffa;
          color: var(--crop-color);
        }
        
        .weather-icon {
          background: #e6f7ff;
          color: var(--weather-color);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .feature-card h3 {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 0.75rem;
        }
        
        .yield-card h3 {
          color: var(--yield-color);
        }
        
        .crop-card h3 {
          color: var(--crop-color);
        }
        
        .weather-card h3 {
          color: var(--weather-color);
        }
        
        .feature-card p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        .feature-link {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
        }
        
        .feature-link:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        
        .feature-link:hover {
          color: var(--primary-dark);
        }
        
        .feature-link:hover:after {
          width: 100%;
        }
        
        .yield-card .feature-link {
          color: var(--yield-color);
        }
        
        .yield-card .feature-link:after {
          background-color: var(--yield-color);
        }
        
        .crop-card .feature-link {
          color: var(--crop-color);
        }
        
        .crop-card .feature-link:after {
          background-color: var(--crop-color);
        }
        
        .weather-card .feature-link {
          color: var(--weather-color);
        }
        
        .weather-card .feature-link:after {
          background-color: var(--weather-color);
        }

        /* Enhanced How It Works Section */
        .how-it-works {
          padding: 5rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
          background: white;
        }
        
        .steps {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .step {
          flex: 1;
          position: relative;
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          transition: var(--transition-normal);
        }
        
        .step:not(:last-child):after {
          content: '';
          position: absolute;
          top: 25px;
          right: -25px;
          width: 50px;
          height: 2px;
          background: linear-gradient(to right, var(--primary-color), transparent);
          z-index: 1;
        }
        
        .step-number {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .step:hover .step-number {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(47, 133, 90, 0.5);
        }
        
        .step h3 {
          color: var(--primary-dark);
          margin-bottom: 0.75rem;
          font-size: 1.3rem;
        }
        
        .step p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Enhanced CTA Section */
        .cta-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, var(--primary-dark), var(--secondary-color));
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .cta-section:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          z-index: 1;
        }
        
        .cta-section > * {
          position: relative;
          z-index: 2;
        }
        
        .cta-section h2 {
          font-size: 2.25rem;
          margin-bottom: 1rem;
          color: white;
        }
        
        .cta-section p {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto 2rem;
          opacity: 0.9;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        /* Improved Mobile Responsiveness */
        @media (max-width: 1024px) {
          .steps {
            flex-direction: column;
            max-width: 600px;
            margin: 3rem auto 0;
          }
          
          .step:not(:last-child):after {
            display: none;
          }
          
          .step-number {
            margin-bottom: 1rem;
          }
          
          .hero {
            padding: 3rem 1.5rem;
            min-height: auto;
          }
          
          .image-carousel {
            height: 350px;
          }
        }
        
        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            padding: 2.5rem 1.5rem;
            text-align: center;
            gap: 2.5rem;
            min-height: auto;
          }
          
          .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            padding: 0 1rem;
          }
          
          .hero-buttons, .cta-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .weather-widget {
            margin: 1.5rem auto;
            max-width: 100%;
          }
          
          .image-carousel {
            height: 250px;
            margin-top: 0;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .section-subtitle {
            font-size: 1rem;
            margin: 1.5rem auto 2rem;
            padding: 0 0.5rem;
          }
          
          .features, .how-it-works, .cta-section {
            padding: 3rem 1.5rem;
          }
          
          .feature-card {
            padding: 1.5rem;
          }
          
          .feature-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          
          .feature-card h3 {
            font-size: 1.3rem;
          }
          
          .feature-card p {
            font-size: 0.95rem;
            margin-bottom: 1.2rem;
          }
          
          .step {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .step h3 {
            font-size: 1.2rem;
          }
          
          .step p {
            font-size: 0.95rem;
          }
          
          .cta-section h2 {
            font-size: 1.8rem;
          }
          
          .cta-section p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .hero {
            padding: 2rem 1rem;
            gap: 2rem;
          }
          
          .hero h1 {
            font-size: 2rem;
            line-height: 1.2;
          }
          
          .hero-subtitle {
            font-size: 0.95rem;
            padding: 0;
            margin-bottom: 1.2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
          }
          
          .btn {
            width: 100%;
            padding: 0.6rem 1.2rem;
            font-size: 0.95rem;
          }
          
          .weather-widget {
            margin-top: 1rem;
          }
          
          .weather-header h3 {
            font-size: 1rem;
          }
          
          .weather-details-link {
            font-size: 0.75rem;
          }
          
          .weather-location {
            font-size: 0.8rem;
          }
          
          .weather-content {
            padding: 1rem;
          }
          
          .weather-icon {
            width: 60px;
            margin-right: 0.8rem;
          }
          
          .weather-icon-svg {
            width: 50px;
            height: 50px;
          }
          
          .weather-temp {
            font-size: 1.5rem;
          }
          
          .weather-condition {
            font-size: 0.85rem;
          }
          
          .weather-stats-row {
            flex-wrap: wrap;
            gap: 0.6rem;
          }
          
          .weather-stat {
            min-width: auto;
            width: 100%;
            justify-content: flex-start;
          }
          
          .stat-icon {
            font-size: 1.2rem;
          }
          
          .stat-value {
            font-size: 0.85rem;
          }
          
          .stat-label {
            font-size: 0.7rem;
          }
          
          .forecast-preview {
            padding: 0.8rem 0.5rem;
          }
          
          .day-name-preview {
            font-size: 0.7rem;
          }
          
          .day-icon-preview .weather-icon-svg {
            width: 28px;
            height: 28px;
          }
          
          .day-temp-preview {
            font-size: 0.8rem;
          }
          
          .image-carousel {
            height: 200px;
          }
          
          .carousel-indicators {
            bottom: 10px;
            gap: 8px;
          }
          
          .indicator {
            width: 8px;
            height: 8px;
          }
          
          .features, .how-it-works, .cta-section {
            padding: 2.5rem 1rem;
          }
          
          .section-title {
            font-size: 1.6rem;
          }
          
          .section-title::after {
            width: 40px;
            height: 2px;
            bottom: -7px;
          }
          
          .section-subtitle {
            font-size: 0.9rem;
            margin: 1.2rem auto 1.8rem;
          }
          
          .features-grid {
            gap: 1.5rem;
          }
          
          .feature-card {
            padding: 1.2rem;
          }
          
          .feature-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
            margin-bottom: 0.8rem;
          }
          
          .feature-card h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }
          
          .feature-card p {
            font-size: 0.85rem;
            margin-bottom: 1rem;
            line-height: 1.5;
          }
          
          .feature-link {
            font-size: 0.9rem;
          }
          
          .step {
            padding: 1.2rem;
            margin-bottom: 1.2rem;
          }
          
          .step-number {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }
          
          .step h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }
          
          .step p {
            font-size: 0.85rem;
            line-height: 1.5;
          }
          
          .cta-section {
            padding: 2.5rem 1rem;
          }
          
          .cta-section h2 {
            font-size: 1.6rem;
            margin-bottom: 0.8rem;
          }
          
          .cta-section p {
            font-size: 0.9rem;
            margin-bottom: 1.2rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 260px;
            margin: 0 auto;
            gap: 0.8rem;
          }
          
          /* Prevent touch callout & highlight on mobile */
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
        }
        
        /* For very small screens - additional optimization */
        @media (max-width: 350px) {
          .hero h1 {
            font-size: 1.8rem;
          }
          
          .hero-subtitle {
            font-size: 0.85rem;
          }
          
          .weather-widget {
            transform: scale(0.95);
            transform-origin: top center;
          }
          
          .image-carousel {
            height: 180px;
          }
          
          .btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          
          .btn-icon {
            font-size: 0.9rem;
          }
          
          .feature-card {
            padding: 1rem;
          }
          
          .feature-icon {
            width: 45px;
            height: 45px;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
          
          .section-subtitle {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;