import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';

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

// Import CSS
import '../styles/Home.css';

function Home() {
  // Access language context
  const { language } = useContext(LanguageContext);
  
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
    const days = language === 'hi' ? 
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
            <Translatable>Welcome to</Translatable> <span className="brand-text">Agro<span>Lens</span></span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Translatable>Empowering farmers with AI-driven insights for better crop yield and recommendations</Translatable>
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/yield-prediction" className="btn btn-primary">
              <span className="btn-icon">🌾</span>
              <Translatable>Predict Yield</Translatable>
            </Link>
            <Link to="/crop-recommendation" className="btn btn-secondary">
              <span className="btn-icon">🌿</span>
              <Translatable>Recommend Crops</Translatable>
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
                <p><Translatable>Loading weather data...</Translatable></p>
              </div>
            ) : error ? (
              <div className="weather-error">{error}</div>
            ) : weatherData && (
              <div className="weather-card">
                <div className="weather-header">
                  <div className="weather-header-content">
                    <h3><Translatable>Current Weather</Translatable></h3>
                    <Link to="/weather" className="weather-details-link">
                      <Translatable>Full Forecast</Translatable> <span>→</span>
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
                        <span className="stat-label"><Translatable>Humidity</Translatable></span>
                      </div>
                    </div>

                    <div className="weather-stat">
                      <WiStrongWind className="stat-icon wind-icon" />
                      <div className="stat-data">
                        <span className="stat-value">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</span>
                        <span className="stat-label"><Translatable>Wind</Translatable></span>
                      </div>
                    </div>

                    <div className="weather-stat">
                      <WiThermometer className="stat-icon feels-like-icon" />
                      <div className="stat-data">
                        <span className="stat-value">{Math.round(weatherData.main.feels_like)}°C</span>
                        <span className="stat-label"><Translatable>Feels Like</Translatable></span>
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
          <Translatable>Our Services</Translatable>
        </motion.h2>
        <motion.p
          className="section-subtitle animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Translatable>Leverage cutting-edge AI technology to optimize your farming operations</Translatable>
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
            <h3><Translatable>Yield Prediction</Translatable></h3>
            <p><Translatable>Predict your crop yield based on soil conditions, weather patterns, and farming practices to optimize your harvest planning.</Translatable></p>
            <Link to="/yield-prediction" className="feature-link"><Translatable>Predict Now</Translatable> →</Link>
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
            <h3><Translatable>Crop Recommendation</Translatable></h3>
            <p><Translatable>Get personalized crop recommendations based on soil nutrients, climate conditions, and environmental factors.</Translatable></p>
            <Link to="/crop-recommendation" className="feature-link"><Translatable>Get Recommendations</Translatable> →</Link>
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
            <h3><Translatable>Weather Analysis</Translatable></h3>
            <p><Translatable>Stay informed about weather conditions that affect your crops with real-time data and agricultural weather insights.</Translatable></p>
            <Link to="/weather" className="feature-link"><Translatable>View Weather</Translatable> →</Link>
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
          <Translatable>How It Works</Translatable>
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
            <h3><Translatable>Input Your Data</Translatable></h3>
            <p><Translatable>Enter soil composition, climate conditions, and farming practices</Translatable></p>
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
            <h3><Translatable>AI Analysis</Translatable></h3>
            <p><Translatable>Our machine learning models analyze your data against extensive agricultural datasets</Translatable></p>
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
            <h3><Translatable>Get Results</Translatable></h3>
            <p><Translatable>Receive personalized yield predictions or crop recommendations</Translatable></p>
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
          <Translatable>Ready to optimize your farming?</Translatable>
        </motion.h2>
        <motion.p
          className="animate-on-scroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Translatable>Start using AgroLens today and see the difference in your next harvest.</Translatable>
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
            <Translatable>Predict Yield</Translatable>
          </Link>
          <Link to="/crop-recommendation" className="btn btn-primary">
            <span className="btn-icon">🌿</span>
            <Translatable>Recommend Crops</Translatable>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
