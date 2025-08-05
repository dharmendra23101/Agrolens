import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Translatable from './Translatable';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, changeLanguage, isLoading, availableLanguages } = useContext(LanguageContext);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body overflow to prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageDropdownOpen && !event.target.closest('.language-selector')) {
        setIsLanguageDropdownOpen(false);
      }
      if (isUserDropdownOpen && !event.target.closest('.user-menu')) {
        setIsUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isUserDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLanguageDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsLanguageDropdownOpen(false);
  };

  const handleLanguageChange = (selectedLanguage) => {
    console.log('[Navbar] Language selected:', selectedLanguage);
    changeLanguage(selectedLanguage);
    setIsLanguageDropdownOpen(false);
  };

  // Get current language name for display
  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === language);
    return currentLang ? currentLang.name : 'English';
  };

  // Get user display name or email
  const getUserDisplayName = () => {
    return currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : '');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="brand-text">Agro<span className="brand-highlight">Lens</span></span>
          </Link>

          <button className="mobile-menu-icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Home</Translatable>
            </Link>
            <Link to="/yield-prediction" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Yield Prediction</Translatable>
            </Link>
            <Link to="/crop-recommendation" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Crop Recommendation</Translatable>
            </Link>
            <Link to="/weather" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Weather</Translatable>
            </Link>
            
            {/* Language selector */}
            <div className="language-selector">
              <button 
                className="language-toggle" 
                onClick={toggleLanguageDropdown}
                aria-label="Select language"
              >
                <span className="language-icon">🌐</span>
                <span className="language-text">
                  {isLoading ? '...' : getCurrentLanguageName()}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="language-dropdown">
                  {availableLanguages.map(lang => (
                    <button 
                      key={lang.code}
                      className={`language-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            
            {/* User menu or auth buttons */}
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-toggle" 
                  onClick={toggleUserDropdown}
                  aria-label="User menu"
                >
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="user-avatar" 
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                
{isUserDropdownOpen && (
  <div className="user-dropdown">
    {isAdmin && (
      <Link 
        to="/admin" 
        className="dropdown-item"
        onClick={() => {
          setIsUserDropdownOpen(false);
          closeMobileMenu();
        }}
      >
        <span className="dropdown-icon">⚙️</span>
        <Translatable>Admin Dashboard</Translatable>
      </Link>
    )}
    <Link 
      to="/profile" 
      className="dropdown-item"
      onClick={() => {
        setIsUserDropdownOpen(false);
        closeMobileMenu();
      }}
    >
      <span className="dropdown-icon">👤</span>
      <Translatable>My Profile</Translatable>
    </Link>
    
    <Link 
      to="/contact" 
      className="dropdown-item"
      onClick={() => {
        setIsUserDropdownOpen(false);
        closeMobileMenu();
      }}
    >
      <span className="dropdown-icon">📞</span>
      <Translatable>Contact Us</Translatable>
    </Link>
  </div>
)}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="login-btn"
                  onClick={closeMobileMenu}
                >
                  <Translatable>Log In</Translatable>
                </Link>
                <Link 
                  to="/register" 
                  className="register-btn"
                  onClick={closeMobileMenu}
                >
                  <Translatable>Sign Up</Translatable>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      

      {/* Translation loading indicator */}
      {isLoading && (
        <div className="translation-loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          padding: 0.7rem 2rem;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }

        .navbar-brand {
          font-size: 1.8rem;
          font-weight: 700;
          text-decoration: none;
          z-index: 1001;
          position: relative;
        }
        
        .brand-text {
          color: #333;
          letter-spacing: -0.5px;
        }
        
        .brand-highlight {
          color: #2f855a;
        }

        .mobile-menu-icon {
          display: none;
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #2f855a;
          cursor: pointer;
          z-index: 1001;
          position: relative;
          transition: color 0.2s ease;
        }
        
        .mobile-menu-icon:hover {
          color: #1e563c;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: #555;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #2f855a;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #2f855a;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 70%;
        }
        
        /* Language selector styles */
        .language-selector {
          position: relative;
          z-index: 100;
        }
        
        .language-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid #e2e8f0;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .language-toggle:hover {
          background-color: #f7fafc;
          border-color: #cbd5e0;
        }
        
        .language-icon {
          font-size: 1.1rem;
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          margin-left: 0.3rem;
          transition: transform 0.2s ease;
        }
        
        .language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.3rem;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 140px;
          max-height: 300px;
          overflow-y: auto;
          animation: dropdown-fade 0.2s ease-in-out;
        }
        
        @keyframes dropdown-fade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .language-option {
          width: 100%;
          text-align: left;
          padding: 0.7rem 1rem;
          background: none;
          border: none;
          border-bottom: 1px solid #f1f1f1;
          font-size: 0.9rem;
          color: #4a5568;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .language-option:last-child {
          border-bottom: none;
        }
        
        .language-option:hover {
          background-color: #f7fafc;
        }
        
        .language-option.active {
          background-color: #e6fffa;
          color: #2f855a;
          font-weight: 500;
        }
        
        /* User menu styles */
        .user-menu {
          position: relative;
          z-index: 100;
        }
        
        .user-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: 1px solid #e2e8f0;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-toggle:hover {
          background-color: #f7fafc;
          border-color: #cbd5e0;
        }
        
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-avatar-placeholder {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #2f855a;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        
        .user-name {
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.3rem;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          animation: dropdown-fade 0.2s ease-in-out;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          text-align: left;
          padding: 0.7rem 1rem;
          background: none;
          border: none;
          border-bottom: 1px solid #f1f1f1;
          font-size: 0.9rem;
          color: #4a5568;
          cursor: pointer;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background-color: #f7fafc;
        }
        
        .dropdown-icon {
          font-size: 1rem;
        }
        
        /* Auth buttons styles */
        .auth-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .login-btn {
          color: #2f855a;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.4rem 1rem;
          border: 1px solid #2f855a;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .login-btn:hover {
          background-color: rgba(47, 133, 90, 0.1);
        }
        
        .register-btn {
          background-color: #2f855a;
          color: white;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.4rem 1.2rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .register-btn:hover {
          background-color: #276749;
        }
        
        /* Translation loading indicator */
        .translation-loading-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          padding: 8px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 9999;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(47, 133, 90, 0.3);
          border-radius: 50%;
          border-top-color: #2f855a;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile styles */
        @media (max-width: 992px) {
          .mobile-menu-icon {
            display: block;
          }

          .navbar-links {
            position: fixed;
            top: 0;
            right: -300px; /* Start offscreen */
            width: 260px;
            height: 100vh;
            background: white;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 5rem;
            gap: 0;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            transition: right 0.3s ease-in-out;
            z-index: 1000;
            overflow-y: auto;
          }

          .navbar-links.active {
            right: 0;
          }

          .nav-link {
            width: 100%;
            text-align: left;
            padding: 1rem 2rem;
            border-bottom: 1px solid #f1f1f1;
          }
          
          .nav-link::after {
            display: none;
          }
          
          /* Mobile language selector styles */
          .language-selector {
            width: 100%;
            border-bottom: 1px solid #f1f1f1;
            padding: 0.5rem 2rem;
          }
          
          .language-toggle {
            width: 100%;
            justify-content: flex-start;
            padding: 0.5rem 0;
            border: none;
            font-size: 1rem;
          }
          
          .language-dropdown {
            position: static;
            box-shadow: none;
            margin-top: 0.5rem;
            margin-left: 1.5rem;
            border-left: 2px solid #e2e8f0;
            max-height: 200px;
          }
          
          .language-option {
            padding: 0.8rem 1rem;
          }
          
          /* Mobile auth buttons styles */
          .auth-buttons {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
            padding: 1rem 2rem;
            border-bottom: 1px solid #f1f1f1;
          }
          
          .login-btn, .register-btn {
            width: 100%;
            text-align: center;
            padding: 0.8rem;
          }
          
          /* Mobile user menu styles */
          .user-menu {
            width: 100%;
            border-bottom: 1px solid #f1f1f1;
            padding: 0.5rem 2rem;
          }
          
          .user-toggle {
            width: 100%;
            justify-content: flex-start;
            padding: 0.5rem 0;
            border: none;
            font-size: 1rem;
          }
          
          .user-dropdown {
            position: static;
            box-shadow: none;
            margin-top: 0.5rem;
            margin-left: 1.5rem;
            border-left: 2px solid #e2e8f0;
          }
          
          .dropdown-item {
            padding: 0.8rem 1rem;
          }
          
          .mobile-menu-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(2px);
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            padding: 0.8rem 1rem;
          }
          
          .navbar.scrolled {
            padding: 0.6rem 1rem;
          }
          
          .navbar-brand {
            font-size: 1.5rem;
          }
          
          .mobile-menu-icon {
            font-size: 1.5rem;
          }
          
          .navbar-links {
            width: 75%; /* Make menu wider on small screens */
            max-width: 280px;
          }
          
          .nav-link {
            padding: 0.9rem 1.5rem;
            font-size: 0.95rem;
          }
          
          .language-selector, 
          .user-menu, 
          .auth-buttons {
            padding: 0.5rem 1.5rem;
          }
          
          .language-dropdown,
          .user-dropdown {
            margin-left: 1rem;
          }
        }
        
        /* Fix for very small devices */
        @media (max-width: 360px) {
          .navbar-brand {
            font-size: 1.3rem;
          }
          
          .mobile-menu-icon {
            font-size: 1.3rem;
          }
          
          .navbar-links {
            width: 85%;
          }
          
          .nav-link {
            padding: 0.8rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .language-selector, 
          .user-menu, 
          .auth-buttons {
            padding: 0.5rem 1.2rem;
          }
          
          .language-toggle,
          .user-toggle {
            font-size: 0.9rem;
          }
          
          .auth-buttons {
            gap: 0.4rem;
          }
          
          .login-btn, 
          .register-btn {
            padding: 0.7rem;
            font-size: 0.9rem;
          }
        }
        
        /* Add translation loading and error styles */
        .translating {
          position: relative;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }
        
        .translation-loading-dots {
          display: inline-block;
          margin-left: 3px;
          font-size: 0.8em;
          color: #2f855a;
          animation: dot-blink 1s infinite;
        }
        
        @keyframes dot-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
