import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, 
  WiFog, WiDayCloudy, WiHumidity, WiStrongWind, 
  WiBarometer, WiRaindrops, WiTime4, WiSunrise, WiSunset,
  WiDayFog, WiNightClear, WiNightCloudy, WiNightRain, WiWindy
} from 'react-icons/wi';

// Import CSS
import '../styles/Weather.css';

function Weather() {
  // Get language context
  const { language } = useContext(LanguageContext);
  
  // State for weather data
  const [forecastData, setForecastData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [cityName, setCityName] = useState('');
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [selectedDay, setSelectedDay] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [sunriseSunset, setSunriseSunset] = useState({ sunrise: null, sunset: null });

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
  
  // Process forecast data to organize by days
  const processForecastData = (forecastList, cityData) => {
    const days = [];
    const dayMap = new Map();
    
    // Save sunrise/sunset info
    setSunriseSunset({
      sunrise: cityData.sunrise,
      sunset: cityData.sunset
    });
    
    forecastList.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!dayMap.has(day)) {
        dayMap.set(day, {
          date: day,
          dayOfWeek: getDayOfWeek(date),
          dayOfMonth: date.getDate(),
          month: getMonthName(date),
          minTemp: forecast.main.temp_min,
          maxTemp: forecast.main.temp_max,
          icon: forecast.weather[0].id,
          description: forecast.weather[0].description,
          hourlyData: []
        });
        days.push(dayMap.get(day));
      }
      
      const dayData = dayMap.get(day);
      
      // Update min/max temperature
      dayData.minTemp = Math.min(dayData.minTemp, forecast.main.temp_min);
      dayData.maxTemp = Math.max(dayData.maxTemp, forecast.main.temp_max);
      
      // Add hourly data
      dayData.hourlyData.push({
        time: formatHour(date),
        hour: date.getHours(),
        temp: forecast.main.temp,
        feelsLike: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        pressure: forecast.main.pressure,
        windSpeed: forecast.wind.speed,
        windDeg: forecast.wind.deg,
        icon: forecast.weather[0].id,
        description: forecast.weather[0].description,
        pop: forecast.pop * 100, // Probability of precipitation (%)
        visibility: forecast.visibility / 1000, // Convert to km
        timestamp: forecast.dt
      });
    });
    
    return days;
  };
  
  // Format hour (e.g., "15:00")
  const formatHour = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:00`;
  };
  
  // Get day of week (e.g., "Monday")
  const getDayOfWeek = (date) => {
    if (language === 'hi') {
      const days = [
        'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
      ];
      return days[date.getDay()];
    } else {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }
  };
  
  // Get month name (e.g., "January")
  const getMonthName = (date) => {
    if (language === 'hi') {
      const months = [
        'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
        'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
      ];
      return months[date.getMonth()];
    } else {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[date.getMonth()];
    }
  };
  
  // Fetch weather data when location is available
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location.lat || !location.lon) return;
      
      try {
        setLoading(true);
        
        // API URL construction
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=c912a5db6bb06b6f5eda28c721611990`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Set current weather (first item in the list)
        setCurrentWeather(data.list[0]);
        setCityName(data.city.name);
        
        // Process forecast data
        const processedForecast = processForecastData(data.list, data.city);
        setForecastData(processedForecast);
        
        // Set hourly data for first day (today)
        if (processedForecast.length > 0) {
          setSelectedDay(processedForecast[0].date);
          setHourlyData(processedForecast[0].hourlyData);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch weather data: " + error.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, units]);
  
  // Handle day selection
  const handleDaySelect = (day) => {
    setSelectedDay(day.date);
    setHourlyData(day.hourlyData);
  };
  
  // Handle unit change
  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };
  
  // Get weather icon based on condition code and time
  const getWeatherIcon = (conditionCode, timestamp = null) => {
    // Check if it's day or night
    let isDaytime = true;
    
    if (timestamp && sunriseSunset.sunrise && sunriseSunset.sunset) {
      const time = new Date(timestamp * 1000).getHours();
      const sunrise = new Date(sunriseSunset.sunrise * 1000).getHours();
      const sunset = new Date(sunriseSunset.sunset * 1000).getHours();
      
      isDaytime = time >= sunrise && time < sunset;
    }
    
    // Map OpenWeatherMap condition codes to icons based on day/night
    if (conditionCode >= 200 && conditionCode < 300) 
      return <WiThunderstorm className="weather-icon thunderstorm-icon" />;  // Thunderstorm
    
    if (conditionCode >= 300 && conditionCode < 600) 
      return isDaytime ? <WiRain className="weather-icon rain-icon" /> : <WiNightRain className="weather-icon rain-icon" />;  // Drizzle and Rain
    
    if (conditionCode >= 600 && conditionCode < 700) 
      return <WiSnow className="weather-icon snow-icon" />;  // Snow
    
    if (conditionCode >= 700 && conditionCode < 800) 
      return isDaytime ? <WiDayFog className="weather-icon fog-icon" /> : <WiFog className="weather-icon fog-icon" />;  // Atmosphere
    
    if (conditionCode === 800) 
      return isDaytime ? <WiDaySunny className="weather-icon sun-icon" /> : <WiNightClear className="weather-icon moon-icon" />;  // Clear
    
    if (conditionCode > 800) 
      return isDaytime ? <WiDayCloudy className="weather-icon cloud-icon" /> : <WiNightCloudy className="weather-icon cloud-icon" />;  // Clouds
    
    return <WiDaySunny className="weather-icon sun-icon" />; // Default
  };
  
  // Display units
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? (language === 'hi' ? 'कि.मी./घं' : 'km/h') : (language === 'hi' ? 'मील/घं' : 'mph');
  
  // Convert wind speed for display
  const formatWindSpeed = (speed) => {
    if (units === 'metric') {
      return (speed * 3.6).toFixed(1); // Convert m/s to km/h
    }
    return speed.toFixed(1); // Already in mph for imperial
  };
  
  // Format wind direction
  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round((degree % 360) / 45) % 8];
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get time from timestamp
  const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (language === 'hi') {
      // Format time in 24-hour format for Hindi
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };
  
  // Translate weather description
  const translateWeatherDescription = (description) => {
    // Now handled by Translatable component
    return description;
  };

  return (
    <div className="weather-page">
      <div className="weather-container">
        <motion.div 
          className="weather-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="weather-nav">
            <Link to="/" className="back-link">
              &larr; <Translatable>Back to Home</Translatable>
            </Link>
            <button 
              className="unit-toggle"
              onClick={toggleUnits}
            >
              <Translatable>Switch to</Translatable> {units === 'metric' ? '°F' : '°C'}
            </button>
          </div>
          
          <h1><Translatable>Weather Forecast</Translatable></h1>
          <p className="location-display"><Translatable>Weather for</Translatable> {cityName}</p>
        </motion.div>
        
        {loading ? (
          <div className="weather-loading">
            <div className="loading-spinner"></div>
            <p><Translatable>Loading weather data...</Translatable></p>
          </div>
        ) : error ? (
          <div className="weather-error">{error}</div>
        ) : (
          <>
            {/* Current Weather */}
            <motion.div 
              className="current-weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="current-weather-header">
                <h2><Translatable>Current Weather</Translatable></h2>
                <p className="current-date">
                  {currentWeather && formatDate(currentWeather.dt)}
                </p>
              </div>
              
              <div className="current-weather-content">
                <div className="current-weather-icon">
                  {currentWeather && getWeatherIcon(currentWeather.weather[0].id, currentWeather.dt)}
                </div>
                <div className="current-weather-info">
                  <div className="current-temp">
                    {currentWeather && Math.round(currentWeather.main.temp)}{tempUnit}
                  </div>
                  <div className="current-description">
                    {currentWeather && <Translatable>{currentWeather.weather[0].description}</Translatable>}
                  </div>
                  <div className="current-feels-like">
                    <Translatable>Feels like</Translatable>: {currentWeather && Math.round(currentWeather.main.feels_like)}{tempUnit}
                  </div>
                </div>
                <div className="current-weather-details">
                  <div className="detail-item">
                    <WiHumidity className="detail-icon humidity-icon" />
                    <div className="detail-info">
                      <span className="detail-value">{currentWeather && currentWeather.main.humidity}%</span>
                      <span className="detail-label"><Translatable>Humidity</Translatable></span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiStrongWind className="detail-icon wind-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && formatWindSpeed(currentWeather.wind.speed)} {speedUnit}
                      </span>
                      <span className="detail-label">
                        <Translatable>Wind</Translatable> ({currentWeather && getWindDirection(currentWeather.wind.deg)})
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiBarometer className="detail-icon pressure-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && currentWeather.main.pressure} hPa
                      </span>
                      <span className="detail-label"><Translatable>Pressure</Translatable></span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiRaindrops className="detail-icon raindrops-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && (currentWeather.pop * 100 || 0).toFixed(0)}%
                      </span>
                      <span className="detail-label"><Translatable>Precipitation</Translatable></span>
                    </div>
                  </div>
                </div>
              </div>
              
              {sunriseSunset.sunrise && sunriseSunset.sunset && (
                <div className="sunrise-sunset">
                  <div className="sun-item">
                    <WiSunrise className="sun-icon sunrise-icon" />
                    <div className="sun-info">
                      <span className="sun-time">{getTimeFromTimestamp(sunriseSunset.sunrise)}</span>
                      <span className="sun-label"><Translatable>Sunrise</Translatable></span>
                    </div>
                  </div>
                  <div className="sun-item">
                    <WiSunset className="sun-icon sunset-icon" />
                    <div className="sun-info">
                      <span className="sun-time">{getTimeFromTimestamp(sunriseSunset.sunset)}</span>
                      <span className="sun-label"><Translatable>Sunset</Translatable></span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* 5-Day Forecast */}
            <motion.div 
              className="forecast-days-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3><Translatable>5-Day Forecast</Translatable></h3>
              <div className="forecast-days">
                {forecastData && forecastData.map((day, index) => (
                  <motion.div 
                    key={day.date}
                    className={`forecast-day-card ${selectedDay === day.date ? 'selected' : ''}`}
                    onClick={() => handleDaySelect(day)}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="day-name">
                      {index === 0 ? <Translatable>Today</Translatable> : day.dayOfWeek}
                    </div>
                    <div className="day-date">
                      {day.dayOfMonth} {day.month}
                    </div>
                    <div className="day-icon">
                      {getWeatherIcon(day.icon)}
                    </div>
                    <div className="day-temp">
                      <span className="max-temp">{Math.round(day.maxTemp)}{tempUnit}</span>
                      <span className="min-temp">{Math.round(day.minTemp)}{tempUnit}</span>
                    </div>
                    <div className="day-description">
                      <Translatable>{day.description}</Translatable>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Hourly Forecast */}
            <motion.div 
              className="hourly-forecast-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3>
                <Translatable>Hourly Forecast for</Translatable> {selectedDay && forecastData.find(d => d.date === selectedDay)?.dayOfWeek}
              </h3>
              <div className="hourly-forecast">
                {hourlyData.length > 0 ? (
                  <div className="hourly-forecast-scroll">
                    {hourlyData.map((hour, index) => (
                      <motion.div 
                        key={index}
                        className="hourly-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <div className="hour-time">{hour.time}</div>
                        <div className="hour-icon">
                          {getWeatherIcon(hour.icon, hour.timestamp)}
                        </div>
                        <div className="hour-temp">
                          {Math.round(hour.temp)}{tempUnit}
                        </div>
                        <div className="hour-details">
                          <div className="hour-detail">
                            <WiHumidity className="hour-detail-icon humidity-icon" />
                            <span>{hour.humidity}%</span>
                          </div>
                          <div className="hour-detail">
                            <WiStrongWind className="hour-detail-icon wind-icon" />
                            <span>{formatWindSpeed(hour.windSpeed)} {speedUnit}</span>
                          </div>
                          <div className="hour-detail">
                            <WiRaindrops className="hour-detail-icon raindrops-icon" />
                            <span>{hour.pop.toFixed(0)}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="no-hourly-data"><Translatable>No hourly data available for this day.</Translatable></p>
                )}
              </div>
            </motion.div>
            
            {/* Weather Info and Agricultural Tips */}
            <motion.div 
              className="weather-info-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3><Translatable>Weather Tips for Farmers</Translatable></h3>
              <div className="weather-tips">
                <div className="tip-card rainfall-card">
                  <h4><Translatable>Rainfall Planning</Translatable></h4>
                  <p><Translatable>Monitor precipitation forecasts to optimize irrigation schedules and save water resources.</Translatable></p>
                </div>
                <div className="tip-card temperature-card">
                  <h4><Translatable>Temperature Variations</Translatable></h4>
                  <p><Translatable>Track temperature trends to protect sensitive crops from unexpected cold or heat waves.</Translatable></p>
                </div>
                <div className="tip-card wind-card">
                  <h4><Translatable>Wind Conditions</Translatable></h4>
                  <p><Translatable>Be aware of strong winds that may affect crop pollination or cause physical damage to plants.</Translatable></p>
                </div>
                <div className="tip-card humidity-card">
                  <h4><Translatable>Humidity Levels</Translatable></h4>
                  <p><Translatable>High humidity can increase the risk of fungal diseases. Low humidity may require additional irrigation.</Translatable></p>
                </div>
              </div>
            </motion.div>
            
            {/* Weather Alerts and Important Information */}
            <motion.div 
              className="weather-alerts-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <h3><Translatable>Weather and Farming Calendar</Translatable></h3>
              <div className="weather-calendar">
                <div className="calendar-card spring-card">
                  <div className="calendar-header"><Translatable>May - June</Translatable></div>
                  <div className="calendar-content">
                    <p><Translatable>Ideal time for preparing soil for kharif crops like rice, maize, and pulses. Monitor pre-monsoon showers carefully.</Translatable></p>
                  </div>
                </div>
                <div className="calendar-card summer-card">
                  <div className="calendar-header"><Translatable>July - August</Translatable></div>
                  <div className="calendar-content">
                    <p><Translatable>Peak monsoon season. Ensure proper drainage systems to avoid waterlogging and monitor for pest outbreaks.</Translatable></p>
                  </div>
                </div>
                <div className="calendar-card autumn-card">
                  <div className="calendar-header"><Translatable>September - October</Translatable></div>
                  <div className="calendar-content">
                    <p><Translatable>Harvest of kharif crops and land preparation for rabi crops. Critical to monitor end-of-season rainfall.</Translatable></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Weather;
