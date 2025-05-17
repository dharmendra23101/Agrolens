import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

function Footer() {
  const { language, isHindi } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(false);

  // Translations
  const translations = {
    english: {
      // Footer description
      description: "Advanced agricultural analytics platform helping farmers make data-driven decisions.",
      
      // Section headings
      quickLinks: "Quick Links",
      services: "Services",
      contact: "Contact",
      
      // Navigation links
      home: "Home",
      yieldPrediction: "Yield Prediction",
      cropRecommendation: "Crop Recommendation",
      weather: "Weather",
      contactLink: "Contact",
      
      // Services
      yieldAnalysis: "Crop Yield Analysis",
      cropSelection: "Optimal Crop Selection",
      weatherForecasting: "Weather Forecasting",
      
      // Contact info
      address: "IIIT Naya Raipur, Sector 24, Chhattisgarh, India",
      
      // Footer bottom
      copyright: "All rights reserved.",
      developer: "Developed with 💚 by",
      teamName: "Team AgroLens"
    },
    hindi: {
      // Footer description
      description: "किसानों को डेटा-संचालित निर्णय लेने में मदद करने वाला उन्नत कृषि विश्लेषण प्लेटफ़ॉर्म।",
      
      // Section headings
      quickLinks: "त्वरित लिंक",
      services: "सेवाएं",
      contact: "संपर्क",
      
      // Navigation links
      home: "होम",
      yieldPrediction: "उपज अनुमान",
      cropRecommendation: "फसल अनुशंसा",
      weather: "मौसम",
      contactLink: "संपर्क",
      
      // Services
      yieldAnalysis: "फसल उपज विश्लेषण",
      cropSelection: "इष्टतम फसल चयन",
      weatherForecasting: "मौसम पूर्वानुमान",
      
      // Contact info
      address: "IIIT नया रायपुर, सेक्टर 24, छत्तीसगढ़, भारत",
      
      // Footer bottom
      copyright: "सर्वाधिकार सुरक्षित।",
      developer: "💚 के साथ विकसित",
      teamName: "टीम AgroLens"
    }
  };
  
  const t = isHindi ? translations.hindi : translations.english;

  // Check if viewport is mobile sized
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Collapsible sections for mobile
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (section) => {
    if (isMobile) {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-heading">AgroLens</h3>
              <p className="footer-description">
                {t.description}
              </p>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <i className="icon">in</i>
                </a>
                <a href="#" className="social-icon" aria-label="GitHub">
                  <i className="icon">git</i>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <i className="icon">tw</i>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3 
                className="footer-heading toggle-heading" 
                onClick={() => toggleSection('quickLinks')}
              >
                {t.quickLinks} {isMobile && <span className="toggle-icon">{expandedSections.quickLinks ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-links ${isMobile && !expandedSections.quickLinks ? 'collapsed' : ''}`}>
                <li><Link to="/">{t.home}</Link></li>
                <li><Link to="/yield-prediction">{t.yieldPrediction}</Link></li>
                <li><Link to="/crop-recommendation">{t.cropRecommendation}</Link></li>
                <li><Link to="/weather">{t.weather}</Link></li>
                <li><Link to="/contact">{t.contactLink}</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 
                className="footer-heading toggle-heading" 
                onClick={() => toggleSection('services')}
              >
                {t.services} {isMobile && <span className="toggle-icon">{expandedSections.services ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-links ${isMobile && !expandedSections.services ? 'collapsed' : ''}`}>
                <li><Link to="/yield-prediction">{t.yieldAnalysis}</Link></li>
                <li><Link to="/crop-recommendation">{t.cropSelection}</Link></li>
                <li><Link to="/weather">{t.weatherForecasting}</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 
                className="footer-heading toggle-heading" 
                onClick={() => toggleSection('contact')}
              >
                {t.contact} {isMobile && <span className="toggle-icon">{expandedSections.contact ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-contact ${isMobile && !expandedSections.contact ? 'collapsed' : ''}`}>
                <li>
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">dharmendra3337@gmail.com</span>
                </li>
                <li>
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">ayushdeep27092004@gmail.com</span>
                </li>
                <li>
                  <span className="contact-icon">📱</span>
                  <span className="contact-text">+ (91) *******848</span>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">{t.address}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} <span className="brand">AgroLens</span>. {t.copyright}
            </p>
            <p className="developer">
              {t.developer} <a href="#" className="developer-link">{t.teamName}</a>
            </p>
          </div>
        </div>
      </footer>

      {/* CSS */}
      <style>{`
        .footer {
          background-color: #f8faf9;
          color: #444;
          padding: 3rem 0 1.5rem;
          margin-top: 2rem;
          border-top: 1px solid #e5e5e5;
        }
        
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-section {
          margin-bottom: 1.5rem;
        }
        
        .footer-heading {
          color: #2f855a;
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .toggle-heading {
          cursor: default;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .toggle-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .footer-description {
          line-height: 1.6;
          color: #555;
          margin-bottom: 1.2rem;
        }
        
        .footer-links, .footer-contact {
          list-style: none;
          padding: 0;
          margin: 0;
          transition: max-height 0.3s ease;
        }
        
        .footer-links.collapsed, .footer-contact.collapsed {
          max-height: 0;
          overflow: hidden;
        }
        
        .footer-links li, .footer-contact li {
          margin-bottom: 0.8rem;
          display: flex;
          align-items: flex-start;
        }
        
        .footer-links a {
          color: #555;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
          display: inline-block;
        }
        
        .footer-links a:hover {
          color: #2f855a;
        }
        
        .footer-links a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #2f855a;
          transition: width 0.3s ease;
        }
        
        .footer-links a:hover::after {
          width: 100%;
        }
        
        .contact-icon {
          margin-right: 0.8rem;
          min-width: 20px;
        }
        
        .contact-text {
          overflow-wrap: break-word;
          word-break: break-word;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e5e5;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .copyright {
          margin: 0;
          font-size: 0.9rem;
          color: #555;
        }
        
        .developer {
          margin: 0;
          font-size: 0.9rem;
          color: #555;
        }
        
        .developer-link {
          color: #2f855a;
          text-decoration: none;
          font-weight: 600;
        }
        
        .brand {
          color: #2f855a;
          font-weight: 600;
        }
        
        .social-icons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f0f0f0;
          color: #444;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .social-icon:hover {
          background-color: #2f855a;
          color: white;
          transform: translateY(-3px);
        }
        
        .icon {
          font-style: normal;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .footer {
            padding: 1.5rem 0 1rem;
            margin-top: 1rem;
          }
          
          .footer-container {
            padding: 0 1rem;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }
          
          .footer-section {
            margin-bottom: 0.75rem;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 0.75rem;
          }
          
          .footer-section:last-child {
            border-bottom: none;
          }
          
          .footer-heading {
            font-size: 1rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
          }
          
          .footer-description {
            font-size: 0.85rem;
            margin-bottom: 0.75rem;
            line-height: 1.4;
          }
          
          .footer-links li, .footer-contact li {
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
          }
          
          .social-icons {
            gap: 0.75rem;
          }
          
          .social-icon {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
            padding-top: 1rem;
          }
          
          .copyright, .developer {
            font-size: 0.8rem;
          }
          
          .contact-icon {
            font-size: 0.85rem;
            margin-right: 0.5rem;
          }
          
          .contact-text {
            font-size: 0.85rem;
            line-height: 1.4;
          }
        }
        
        @media (max-width: 480px) {
          .footer {
            padding: 1.25rem 0 0.75rem;
          }
          
          .footer-container {
            padding: 0 0.75rem;
          }
          
          .footer-content {
            gap: 0.5rem;
          }
          
          .footer-section {
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
          }
          
          .footer-heading {
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
          }
          
          .footer-description {
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
          }
          
          .footer-links li, .footer-contact li {
            margin-bottom: 0.4rem;
            font-size: 0.8rem;
          }
          
          .social-icon {
            width: 28px;
            height: 28px;
          }
          
          .footer-bottom {
            padding-top: 0.75rem;
          }
          
          .copyright, .developer {
            font-size: 0.75rem;
          }
          
          /* Make email addresses fit better on small screens */
          .contact-text {
            font-size: 0.8rem;
            max-width: calc(100% - 25px);
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
