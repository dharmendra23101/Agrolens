import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import { 
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, 
  WiFog, WiDayCloudy, WiHumidity, WiStrongWind, 
  WiBarometer, WiRaindrops, WiTime4, WiSunrise, WiSunset,
  WiDayFog, WiNightClear, WiNightCloudy, WiNightRain, WiWindy
} from 'react-icons/wi';

function Weather() {
  // Get language context
  const { language, isHindi } = useContext(LanguageContext);
  
  // Translations
  const translations = {
    english: {
      // Navigation and header
      backToHome: "Back to Home",
      switchTo: "Switch to",
      weatherForecast: "Weather Forecast",
      weatherFor: "Weather for",
      loadingWeather: "Loading weather data...",
      
      // Current weather
      currentWeather: "Current Weather",
      feelsLike: "Feels like",
      humidity: "Humidity",
      wind: "Wind",
      pressure: "Pressure",
      precipitation: "Precipitation",
      sunrise: "Sunrise",
      sunset: "Sunset",
      
      // Forecast
      fiveDayForecast: "5-Day Forecast",
      today: "Today",
      hourlyForecast: "Hourly Forecast for",
      noHourlyData: "No hourly data available for this day.",
      
      // Days of week
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      
      // Months
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December",
      
      // Weather tips section
      weatherTips: "Weather Tips for Farmers",
      rainfallPlanning: "Rainfall Planning",
      rainfallTip: "Monitor precipitation forecasts to optimize irrigation schedules and save water resources.",
      temperatureVariations: "Temperature Variations",
      temperatureTip: "Track temperature trends to protect sensitive crops from unexpected cold or heat waves.",
      windConditions: "Wind Conditions",
      windTip: "Be aware of strong winds that may affect crop pollination or cause physical damage to plants.",
      humidityLevels: "Humidity Levels",
      humidityTip: "High humidity can increase the risk of fungal diseases. Low humidity may require additional irrigation.",
      
      // Calendar section
      weatherCalendar: "Weather and Farming Calendar",
      mayJune: "May - June",
      mayJuneTip: "Ideal time for preparing soil for kharif crops like rice, maize, and pulses. Monitor pre-monsoon showers carefully.",
      julyAugust: "July - August",
      julyAugustTip: "Peak monsoon season. Ensure proper drainage systems to avoid waterlogging and monitor for pest outbreaks.",
      septemberOctober: "September - October",
      septemberOctoberTip: "Harvest of kharif crops and land preparation for rabi crops. Critical to monitor end-of-season rainfall."
    },
    hindi: {
      // Navigation and header
      backToHome: "होम पर वापस जाएं",
      switchTo: "बदलें",
      weatherForecast: "मौसम का पूर्वानुमान",
      weatherFor: "के लिए मौसम",
      loadingWeather: "मौसम डेटा लोड हो रहा है...",
      
      // Current weather
      currentWeather: "वर्तमान मौसम",
      feelsLike: "महसूस होता है",
      humidity: "आर्द्रता",
      wind: "हवा",
      pressure: "दबाव",
      precipitation: "वर्षा की संभावना",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      
      // Forecast
      fiveDayForecast: "5-दिन का पूर्वानुमान",
      today: "आज",
      hourlyForecast: "के लिए घंटेवार पूर्वानुमान",
      noHourlyData: "इस दिन के लिए कोई घंटेवार डेटा उपलब्ध नहीं है।",
      
      // Days of week
      sunday: "रविवार",
      monday: "सोमवार",
      tuesday: "मंगलवार",
      wednesday: "बुधवार",
      thursday: "गुरुवार",
      friday: "शुक्रवार",
      saturday: "शनिवार",
      
      // Months
      january: "जनवरी",
      february: "फरवरी",
      march: "मार्च",
      april: "अप्रैल",
      may: "मई",
      june: "जून",
      july: "जुलाई",
      august: "अगस्त",
      september: "सितंबर",
      october: "अक्टूबर",
      november: "नवंबर",
      december: "दिसंबर",
      
      // Weather tips section
      weatherTips: "किसानों के लिए मौसम संबंधी सुझाव",
      rainfallPlanning: "वर्षा योजना",
      rainfallTip: "सिंचाई कार्यक्रम को अनुकूलित करने और जल संसाधनों को बचाने के लिए वर्षा के पूर्वानुमानों की निगरानी करें।",
      temperatureVariations: "तापमान में बदलाव",
      temperatureTip: "अप्रत्याशित ठंड या गर्मी की लहरों से संवेदनशील फसलों की रक्षा के लिए तापमान में बदलाव पर नज़र रखें।",
      windConditions: "हवा की स्थिति",
      windTip: "तेज हवाओं के प्रति सचेत रहें जो फसल परागण को प्रभावित कर सकती हैं या पौधों को भौतिक नुकसान पहुंचा सकती हैं।",
      humidityLevels: "आर्द्रता का स्तर",
      humidityTip: "उच्च आर्द्रता से फंगल रोगों का खतरा बढ़ सकता है। कम आर्द्रता के लिए अतिरिक्त सिंचाई की आवश्यकता हो सकती है।",
      
      // Calendar section
      weatherCalendar: "मौसम और कृषि कैलेंडर",
      mayJune: "मई - जून",
      mayJuneTip: "धान, मक्का और दालों जैसी खरीफ फसलों के लिए मिट्टी तैयार करने का आदर्श समय। प्री-मानसून वर्षा की सावधानीपूर्वक निगरानी करें।",
      julyAugust: "जुलाई - अगस्त",
      julyAugustTip: "मानसून का शीर्ष मौसम। जलभराव से बचने के लिए उचित जल निकासी प्रणालियों को सुनिश्चित करें और कीट प्रकोप की निगरानी करें।",
      septemberOctober: "सितंबर - अक्टूबर",
      septemberOctoberTip: "खरीफ फसलों की कटाई और रबी फसलों के लिए भूमि की तैयारी। मौसम के अंत में वर्षा की निगरानी करना महत्वपूर्ण है।"
    }
  };
  
  const t = isHindi ? translations.hindi : translations.english;

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
    if (isHindi) {
      const days = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday];
      return days[date.getDay()];
    } else {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }
  };
  
  // Get month name (e.g., "January")
  const getMonthName = (date) => {
    if (isHindi) {
      const months = [
        t.january, t.february, t.march, t.april, t.may, t.june, 
        t.july, t.august, t.september, t.october, t.november, t.december
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
  const speedUnit = units === 'metric' ? (isHindi ? 'कि.मी./घं' : 'km/h') : (isHindi ? 'मील/घं' : 'mph');
  
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
    if (isHindi) {
      const day = t[date.getDay() === 0 ? 'sunday' : 
                   date.getDay() === 1 ? 'monday' : 
                   date.getDay() === 2 ? 'tuesday' : 
                   date.getDay() === 3 ? 'wednesday' : 
                   date.getDay() === 4 ? 'thursday' : 
                   date.getDay() === 5 ? 'friday' : 'saturday'];
      
      const month = t[date.getMonth() === 0 ? 'january' :
                    date.getMonth() === 1 ? 'february' :
                    date.getMonth() === 2 ? 'march' :
                    date.getMonth() === 3 ? 'april' :
                    date.getMonth() === 4 ? 'may' :
                    date.getMonth() === 5 ? 'june' :
                    date.getMonth() === 6 ? 'july' :
                    date.getMonth() === 7 ? 'august' :
                    date.getMonth() === 8 ? 'september' :
                    date.getMonth() === 9 ? 'october' :
                    date.getMonth() === 10 ? 'november' : 'december'];
      
      return `${day}, ${date.getDate()} ${month}, ${date.getFullYear()}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  // Get time from timestamp
  const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (isHindi) {
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
    if (!isHindi) return description;
    
    const weatherTranslations = {
      'clear sky': 'साफ आसमान',
      'few clouds': 'कुछ बादल',
      'scattered clouds': 'बिखरे हुए बादल',
      'broken clouds': 'टूटे हुए बादल',
      'overcast clouds': 'घने बादल',
      'light rain': 'हल्की बारिश',
      'moderate rain': 'मध्यम बारिश',
      'heavy intensity rain': 'तेज बारिश',
      'thunderstorm': 'आंधी-तूफान',
      'snow': 'बर्फबारी',
      'mist': 'कोहरा',
      'fog': 'धुंध',
      'haze': 'धुंध'
    };
    
    return weatherTranslations[description.toLowerCase()] || description;
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
              &larr; {t.backToHome}
            </Link>
            <button 
              className="unit-toggle"
              onClick={toggleUnits}
            >
              {t.switchTo} {units === 'metric' ? '°F' : '°C'}
            </button>
          </div>
          
          <h1>{t.weatherForecast}</h1>
          <p className="location-display">{t.weatherFor} {cityName}</p>
        </motion.div>
        
        {loading ? (
          <div className="weather-loading">
            <div className="loading-spinner"></div>
            <p>{t.loadingWeather}</p>
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
                <h2>{t.currentWeather}</h2>
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
                    {currentWeather && translateWeatherDescription(currentWeather.weather[0].description)}
                  </div>
                  <div className="current-feels-like">
                    {t.feelsLike}: {currentWeather && Math.round(currentWeather.main.feels_like)}{tempUnit}
                  </div>
                </div>
                <div className="current-weather-details">
                  <div className="detail-item">
                    <WiHumidity className="detail-icon humidity-icon" />
                    <div className="detail-info">
                      <span className="detail-value">{currentWeather && currentWeather.main.humidity}%</span>
                      <span className="detail-label">{t.humidity}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiStrongWind className="detail-icon wind-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && formatWindSpeed(currentWeather.wind.speed)} {speedUnit}
                      </span>
                      <span className="detail-label">
                        {t.wind} ({currentWeather && getWindDirection(currentWeather.wind.deg)})
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiBarometer className="detail-icon pressure-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && currentWeather.main.pressure} hPa
                      </span>
                      <span className="detail-label">{t.pressure}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <WiRaindrops className="detail-icon raindrops-icon" />
                    <div className="detail-info">
                      <span className="detail-value">
                        {currentWeather && (currentWeather.pop * 100 || 0).toFixed(0)}%
                      </span>
                      <span className="detail-label">{t.precipitation}</span>
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
                      <span className="sun-label">{t.sunrise}</span>
                    </div>
                  </div>
                  <div className="sun-item">
                    <WiSunset className="sun-icon sunset-icon" />
                    <div className="sun-info">
                      <span className="sun-time">{getTimeFromTimestamp(sunriseSunset.sunset)}</span>
                      <span className="sun-label">{t.sunset}</span>
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
              <h3>{t.fiveDayForecast}</h3>
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
                      {index === 0 ? t.today : day.dayOfWeek}
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
                      {translateWeatherDescription(day.description)}
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
              <h3>{t.hourlyForecast} {selectedDay && forecastData.find(d => d.date === selectedDay)?.dayOfWeek}</h3>
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
                  <p className="no-hourly-data">{t.noHourlyData}</p>
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
              <h3>{t.weatherTips}</h3>
              <div className="weather-tips">
                <div className="tip-card rainfall-card">
                  <h4>{t.rainfallPlanning}</h4>
                  <p>{t.rainfallTip}</p>
                </div>
                <div className="tip-card temperature-card">
                  <h4>{t.temperatureVariations}</h4>
                  <p>{t.temperatureTip}</p>
                </div>
                <div className="tip-card wind-card">
                  <h4>{t.windConditions}</h4>
                  <p>{t.windTip}</p>
                </div>
                <div className="tip-card humidity-card">
                  <h4>{t.humidityLevels}</h4>
                  <p>{t.humidityTip}</p>
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
              <h3>{t.weatherCalendar}</h3>
              <div className="weather-calendar">
                <div className="calendar-card spring-card">
                  <div className="calendar-header">{t.mayJune}</div>
                  <div className="calendar-content">
                    <p>{t.mayJuneTip}</p>
                  </div>
                </div>
                <div className="calendar-card summer-card">
                  <div className="calendar-header">{t.julyAugust}</div>
                  <div className="calendar-content">
                    <p>{t.julyAugustTip}</p>
                  </div>
                </div>
                <div className="calendar-card autumn-card">
                  <div className="calendar-header">{t.septemberOctober}</div>
                  <div className="calendar-content">
                    <p>{t.septemberOctoberTip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Add the styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --primary-color: #2f855a;
          --primary-dark: #276749;
          --primary-light: #c6f6d5;
          --secondary-color: #38a169;
          --text-color: #2d3748;
          --text-light: #4a5568;
          --background-light: #f8faf9;
          --background-card: #ffffff;
          
          /* New color variables */
          --sunny-color: #ff9900;
          --sunset-color: #ff6b35;
          --sunrise-color: #ff9e5e;
          --cloud-color: #5e7184;
          --rain-color: #4299e1;
          --thunder-color: #805ad5;
          --snow-color: #a0aec0;
          --fog-color: #718096;
          --humidity-color: #0bc5ea;
          --wind-color: #48bb78;
          --pressure-color: #7c689b;
          --raindrops-color: #3182ce;
          --moon-color: #4a5568;
          
          /* Card accent colors */
          --rainfall-accent: #3182ce;
          --temperature-accent: #ed8936;
          --wind-accent: #48bb78;
          --humidity-accent: #0bc5ea;
          
          /* Calendar colors */
          --spring-gradient: linear-gradient(135deg, #4ca770, #2ba196);
          --summer-gradient: linear-gradient(135deg, #2f855a, #38a169);
          --autumn-gradient: linear-gradient(135deg, #dd6b20, #ed8936);
          
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
          --shadow-lg: 0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05);
          --shadow-hover: 0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12);
          --border-radius-sm: 6px;
          --border-radius-md: 12px;
          --border-radius-lg: 20px;
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
        
        .weather-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa, #e4efe9);
          padding: 2rem 0;
        }
        
        .weather-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        
        .weather-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .weather-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .back-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .back-link:hover {
          color: var(--primary-dark);
          transform: translateX(-3px);
        }
        
        .unit-toggle {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        
        .unit-toggle:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .weather-header h1 {
          font-size: 2.5rem;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
          font-weight: 700;
          background: linear-gradient(to right, var(--primary-dark), var(--secondary-color));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .location-display {
          font-size: 1.2rem;
          color: var(--text-light);
          margin-bottom: 1rem;
        }
        
        .weather-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(47, 133, 90, 0.1);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .weather-error {
          padding: 2rem;
          border-radius: var(--border-radius-md);
          background: #fee2e2;
          color: #b91c1c;
          text-align: center;
          box-shadow: var(--shadow-sm);
          margin-bottom: 2rem;
        }
        
        /* Weather Icons Coloring */
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
        
        .sunrise-icon {
          color: var(--sunrise-color);
        }
        
        .sunset-icon {
          color: var(--sunset-color);
        }
        
        .humidity-icon {
          color: var(--humidity-color);
        }
        
        .wind-icon {
          color: var(--wind-color);
        }
        
        .pressure-icon {
          color: var(--pressure-color);
        }
        
        .raindrops-icon {
          color: var(--raindrops-color);
        }
        
        /* Current Weather */
        .current-weather {
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-lg);
          padding: 2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .current-weather::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: rgba(47, 133, 90, 0.05);
          border-radius: 50%;
          transform: translate(50%, -50%);
        }
        
        .current-weather-header {
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #edf2f7;
          padding-bottom: 1rem;
        }
        
        .current-weather-header h2 {
          font-size: 1.8rem;
          color: var(--primary-dark);
          margin-bottom: 0.25rem;
        }
        
        .current-date {
          color: var(--text-light);
          font-size: 1rem;
        }
        
        .current-weather-content {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .current-weather-icon {
          font-size: 5rem;
          flex: 0 0 auto;
        }
        
        .current-weather-icon .weather-icon {
          width: 120px;
          height: 120px;
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .current-weather-info {
          flex: 1;
          min-width: 150px;
        }
        
        .current-temp {
          font-size: 3.5rem;
          font-weight: 700;
          color: var(--primary-dark);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .current-description {
          font-size: 1.2rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }
        
        .current-feels-like {
          font-size: 1rem;
          color: var(--text-light);
        }
        
        .current-weather-details {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1.5rem;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .detail-icon {
          font-size: 2rem;
        }
        
        .detail-info {
          display: flex;
          flex-direction: column;
        }
        
        .detail-value {
          font-weight: 600;
          color: var(--text-color);
          font-size: 1.1rem;
        }
        
        .detail-label {
          font-size: 0.9rem;
          color: var(--text-light);
        }
        
        .sunrise-sunset {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #edf2f7;
        }
        
        .sun-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .sun-icon {
          font-size: 2.5rem;
        }
        
        .sun-info {
          display: flex;
          flex-direction: column;
        }
        
        .sun-time {
          font-weight: 600;
          color: var(--text-color);
          font-size: 1.1rem;
        }
        
        .sun-label {
          font-size: 0.9rem;
          color: var(--text-light);
        }
        
        /* 5-Day Forecast */
        .forecast-days-container {
          margin-bottom: 2rem;
        }
        
        .forecast-days-container h3 {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 1rem;
        }
        
        .forecast-days {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0.5rem 0.25rem;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-light) transparent;
        }
        
        .forecast-days::-webkit-scrollbar {
          height: 8px;
        }
        
        .forecast-days::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .forecast-days::-webkit-scrollbar-thumb {
          background-color: var(--primary-light);
          border-radius: 20px;
        }
        
        .forecast-day-card {
          flex: 0 0 auto;
          min-width: 140px;
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: var(--transition-normal);
          position: relative;
        }
        
        .forecast-day-card.selected {
          background: linear-gradient(to bottom, #ecfdf5, white);
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-top: 3px solid var(--primary-color);
        }
        
        .forecast-day-card.selected::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid var(--background-card);
        }
        
        .forecast-day-card:hover:not(.selected) {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
        }
        
        .day-name {
          font-weight: 600;
          color: var(--primary-dark);
          margin-bottom: 0.25rem;
        }
        
        .day-date {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.75rem;
        }
        
        .day-icon {
          margin-bottom: 0.75rem;
          font-size: 2.5rem;
        }
        
        .day-icon .weather-icon {
          width: 60px;
          height: 60px;
        }
        
        .day-temp {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .max-temp {
          font-weight: 600;
          color: var(--text-color);
        }
        
        .min-temp {
          color: var(--text-light);
        }
        
        .day-description {
          font-size: 0.85rem;
          color: var(--text-light);
          text-align: center;
          text-transform: capitalize;
        }
        
        /* Hourly Forecast */
        .hourly-forecast-container {
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          margin-bottom: 2rem;
        }
        
        .hourly-forecast-container h3 {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 1.5rem;
        }
        
        .hourly-forecast-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0.5rem 0.25rem;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-light) transparent;
        }
        
        .hourly-forecast-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .hourly-forecast-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .hourly-forecast-scroll::-webkit-scrollbar-thumb {
          background-color: var(--primary-light);
          border-radius: 20px;
        }
        
        .hourly-item {
          flex: 0 0 auto;
          background: var(--background-light);
          border-radius: var(--border-radius-sm);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
          transition: var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        
        .hourly-item:hover {
          background: #edf7f2;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .hour-time {
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.75rem;
        }
        
        .hour-icon {
          margin: 0.5rem 0;
          font-size: 1.8rem;
        }
        
        .hour-icon .weather-icon {
          width: 40px;
          height: 40px;
        }
        
        .hour-temp {
          font-weight: 600;
          color: var(--primary-dark);
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .hour-details {
          width: 100%;
        }
        
        .hour-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }
        
        .hour-detail-icon {
          font-size: 1.2rem;
        }
        
        .no-hourly-data {
          text-align: center;
          padding: 2rem;
          color: var(--text-light);
        }
        
        /* Weather Tips Section */
        .weather-info-section {
          margin-bottom: 2rem;
        }
        
        .weather-info-section h3 {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 1.5rem;
        }
        
        .weather-tips {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .tip-card {
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          transition: var(--transition-fast);
          border-top: 4px solid var(--primary-color);
        }
        
        .rainfall-card {
          border-top-color: var(--rainfall-accent);
        }
        
        .temperature-card {
          border-top-color: var(--temperature-accent);
        }
        
        .wind-card {
          border-top-color: var(--wind-accent);
        }
        
        .humidity-card {
          border-top-color: var(--humidity-accent);
        }
        
        .tip-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .tip-card h4 {
          color: var(--primary-dark);
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }
        
        .rainfall-card h4 {
          color: var(--rainfall-accent);
        }
        
        .temperature-card h4 {
          color: var(--temperature-accent);
        }
        
        .wind-card h4 {
          color: var(--wind-accent);
        }
        
        .humidity-card h4 {
          color: var(--humidity-accent);
        }
        
        .tip-card p {
          color: var(--text-light);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        /* Weather Calendar Section */
        .weather-alerts-section {
          margin-bottom: 2rem;
        }
        
        .weather-alerts-section h3 {
          font-size: 1.5rem;
          color: var(--primary-dark);
          margin-bottom: 1.5rem;
        }
        
        .weather-calendar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .calendar-card {
          background: var(--background-card);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition-fast);
        }
        
        .calendar-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .spring-card .calendar-header {
          background: var(--spring-gradient);
        }
        
        .summer-card .calendar-header {
          background: var(--summer-gradient);
        }
        
        .autumn-card .calendar-header {
          background: var(--autumn-gradient);
        }
        
        .calendar-header {
          color: white;
          padding: 1rem;
          font-weight: 600;
          font-size: 1.1rem;
          text-align: center;
        }
        
        .calendar-content {
          padding: 1.5rem;
        }
        
        .calendar-content p {
          color: var(--text-light);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        /* Responsive Styles - ENHANCED FOR MOBILE */
        @media (max-width: 768px) {
          .weather-page {
            padding: 0.75rem 0;
          }
          
          .weather-container {
            padding: 0 0.75rem;
          }
          
          .weather-header h1 {
            font-size: 1.75rem;
          }
          
          .location-display {
            font-size: 1rem;
          }
          
          .current-weather {
            padding: 1.25rem;
          }
          
          .current-weather-header h2 {
            font-size: 1.4rem;
          }
          
          .current-date {
            font-size: 0.85rem;
          }
          
          .current-weather-content {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }
          
          .current-weather-icon {
            display: flex;
            justify-content: center;
            width: 100%;
          }
          
          .current-weather-icon .weather-icon {
            width: 80px;
            height: 80px;
          }
          
          .current-weather-info {
            width: 100%;
          }
          
          .current-temp {
            font-size: 2.5rem;
          }
          
          .current-description {
            font-size: 1rem;
          }
          
          .current-weather-details {
            width: 100%;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-top: 0.5rem;
          }
          
          .detail-item {
            gap: 0.5rem;
          }
          
          .detail-icon {
            font-size: 1.5rem;
          }
          
          .detail-value {
            font-size: 0.9rem;
          }
          
          .detail-label {
            font-size: 0.75rem;
          }
          
          .sunrise-sunset {
            flex-direction: row;
            justify-content: space-around;
            gap: 1rem;
            padding-top: 1rem;
            margin-top: 1rem;
          }
          
          .sun-icon {
            font-size: 1.8rem;
          }
          
          .sun-time {
            font-size: 0.9rem;
          }
          
          .sun-label {
            font-size: 0.75rem;
          }
          
          .forecast-days-container h3, 
          .hourly-forecast-container h3,
          .weather-info-section h3,
          .weather-alerts-section h3 {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
          }
          
          .forecast-day-card {
            min-width: 100px;
            padding: 0.75rem 0.5rem;
          }
          
          .day-name {
            font-size: 0.9rem;
          }
          
          .day-date {
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
          }
          
          .day-icon .weather-icon {
            width: 40px;
            height: 40px;
          }
          
          .day-temp {
            font-size: 0.85rem;
            gap: 0.5rem;
          }
          
          .day-description {
            font-size: 0.75rem;
          }
          
          .hourly-forecast-container {
            padding: 1.25rem;
          }
          
          .hourly-item {
            min-width: 85px;
            padding: 0.75rem 0.5rem;
          }
          
          .hour-time {
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
          }
          
          .hour-icon .weather-icon {
            width: 30px;
            height: 30px;
          }
          
          .hour-temp {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }
          
          .hour-detail {
            font-size: 0.75rem;
          }
          
          .hour-detail-icon {
            font-size: 1rem;
          }
                      .weather-tips, .weather-calendar {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .tip-card, .calendar-card {
            padding: 1rem;
          }
          
          .tip-card h4, .calendar-header {
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }
          
          .tip-card p, .calendar-content p {
            font-size: 0.85rem;
            line-height: 1.4;
          }
        }
        
        @media (max-width: 480px) {
          .weather-page {
            padding: 0.5rem 0;
          }
          
          .weather-container {
            padding: 0 0.5rem;
          }
          
          .weather-nav {
            flex-direction: row;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .back-link {
            font-size: 0.85rem;
          }
          
          .unit-toggle {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .weather-header h1 {
            font-size: 1.5rem;
          }
          
          .location-display {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }
          
          .current-weather {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          
          .current-weather-header {
            margin-bottom: 1rem;
          }
          
          .current-weather-header h2 {
            font-size: 1.2rem;
          }
          
          .current-weather-icon .weather-icon {
            width: 70px;
            height: 70px;
          }
          
          .current-temp {
            font-size: 2.2rem;
          }
          
          .current-weather-details {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          
          .sunrise-sunset {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
          }
          
          .forecast-days-container, 
          .hourly-forecast-container,
          .weather-info-section,
          .weather-alerts-section {
            margin-bottom: 1rem;
          }
          
          .forecast-day-card {
            min-width: 85px;
            padding: 0.6rem 0.4rem;
          }
          
          .hourly-item {
            min-width: 75px;
            padding: 0.6rem 0.4rem;
          }
          
          .day-icon, .hour-icon {
            margin-bottom: 0.5rem;
          }
          
          .hourly-forecast-container h3 {
            font-size: 1.1rem;
          }
          
          .tip-card, .calendar-card {
            padding: 0.75rem;
          }
          
          .calendar-header {
            padding: 0.75rem;
          }
          
          .calendar-content {
            padding: 0.75rem;
          }
        }
        
        /* Extra Small Devices */
        @media (max-width: 360px) {
          .weather-header h1 {
            font-size: 1.3rem;
          }
          
          .current-weather-icon .weather-icon {
            width: 60px;
            height: 60px;
          }
          
          .current-temp {
            font-size: 2rem;
          }
          
          .current-description {
            font-size: 0.9rem;
          }
          
          .current-feels-like {
            font-size: 0.8rem;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.25rem;
          }
          
          .forecast-day-card {
            min-width: 75px;
          }
          
          .hourly-item {
            min-width: 70px;
            padding: 0.5rem 0.3rem;
          }
          
          .day-name, .day-date {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          
          .day-description {
            display: none; /* Hide on very small screens */
          }
        }
      `}</style>
    </div>
  );
}

export default Weather;