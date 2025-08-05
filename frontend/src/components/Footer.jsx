import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from './Translatable';
import '../styles/Footer.css';

function Footer() {
  const { language } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(false);

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
                <Translatable>
                  Advanced agricultural analytics platform helping farmers make data-driven decisions.
                </Translatable>
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
                <Translatable>Quick Links</Translatable> {isMobile && <span className="toggle-icon">{expandedSections.quickLinks ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-links ${isMobile && !expandedSections.quickLinks ? 'collapsed' : ''}`}>
                <li><Link to="/"><Translatable>Home</Translatable></Link></li>
                <li><Link to="/yield-prediction"><Translatable>Yield Prediction</Translatable></Link></li>
                <li><Link to="/crop-recommendation"><Translatable>Crop Recommendation</Translatable></Link></li>
                <li><Link to="/weather"><Translatable>Weather</Translatable></Link></li>
                <li><Link to="/contact"><Translatable>Contact</Translatable></Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 
                className="footer-heading toggle-heading" 
                onClick={() => toggleSection('services')}
              >
                <Translatable>Services</Translatable> {isMobile && <span className="toggle-icon">{expandedSections.services ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-links ${isMobile && !expandedSections.services ? 'collapsed' : ''}`}>
                <li><Link to="/yield-prediction"><Translatable>Crop Yield Analysis</Translatable></Link></li>
                <li><Link to="/crop-recommendation"><Translatable>Optimal Crop Selection</Translatable></Link></li>
                <li><Link to="/weather"><Translatable>Weather Forecasting</Translatable></Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 
                className="footer-heading toggle-heading" 
                onClick={() => toggleSection('contact')}
              >
                <Translatable>Contact</Translatable> {isMobile && <span className="toggle-icon">{expandedSections.contact ? '−' : '+'}</span>}
              </h3>
              <ul className={`footer-contact ${isMobile && !expandedSections.contact ? 'collapsed' : ''}`}>
                <li>
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">dkbob3337@gmail.com</span>
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
                  <span className="contact-text">
                    <Translatable>
                      IIIT Naya Raipur, Sector 24, Chhattisgarh, India
                    </Translatable>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} <span className="brand">AgroLens</span>. <Translatable>All rights reserved.</Translatable>
            </p>
            <p className="developer">
              <Translatable>Developed with 💚 by</Translatable> <a href="#" className="developer-link"><Translatable>Team AgroLens</Translatable></a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;


