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
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
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
      if (isToolsDropdownOpen && !event.target.closest('.tools-menu')) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isUserDropdownOpen, isToolsDropdownOpen]);

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
    setIsToolsDropdownOpen(false);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsLanguageDropdownOpen(false);
    setIsToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    setIsLanguageDropdownOpen(false);
    setIsUserDropdownOpen(false);
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

            <Link to="/Scheme" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Scheme</Translatable>
            </Link>
            
            <Link to="/tools" className="nav-link" onClick={closeMobileMenu}>
              <Translatable>Tools</Translatable>
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
                aria-expanded={isLanguageDropdownOpen}
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
                  aria-expanded={isUserDropdownOpen}
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

      <style>{`
        /* Base styles */
.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  padding: 0.7rem 2rem;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

/* Brand styling */
.navbar-brand {
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  z-index: 1001;
  position: relative;
  transition: transform 0.2s ease;
}

.navbar-brand:hover {
  transform: scale(1.03);
}

.brand-text {
  color: #333;
  letter-spacing: -0.5px;
}

.brand-highlight {
  color: #2f855a;
}

/* Mobile menu icon */
.mobile-menu-icon {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #2f855a;
  cursor: pointer;
  z-index: 1001;
  position: relative;
  transition: all 0.2s ease;
  padding: 0.3rem;
  border-radius: 4px;
}

.mobile-menu-icon:hover {
  color: #1e563c;
  background-color: rgba(47, 133, 90, 0.05);
}

.mobile-menu-icon:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(47, 133, 90, 0.2);
}

/* Navbar links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #4a5568;
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

/* Tools Menu Styles */
.tools-menu {
  position: relative;
  z-index: 100;
}

.tools-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.2s ease;
}

.tools-toggle:hover {
  color: #2f855a;
}

.tools-toggle::after {
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

.tools-toggle:hover::after {
  width: 70%;
}

.tools-menu:has(.tools-dropdown) .dropdown-arrow {
  transform: rotate(180deg);
}

.tools-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  animation: dropdown-fade 0.25s ease-in-out;
  border: 1px solid rgba(229, 231, 235, 0.8);
  z-index: 101;
  overflow: hidden;
}

/* Language selector */
.language-selector {
  position: relative;
  z-index: 100;
}

.language-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-toggle:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.language-toggle:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(47, 133, 90, 0.15);
}

.language-icon {
  font-size: 1.1rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  margin-left: 0.3rem;
  transition: transform 0.2s ease;
}

.language-selector:has(.language-dropdown) .dropdown-arrow {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
  animation: dropdown-fade 0.25s ease-in-out;
  border: 1px solid rgba(229, 231, 235, 0.8);
  z-index: 101;
}

@keyframes dropdown-fade {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.language-option {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1.2rem;
  background: none;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background-color: #f8fafc;
}

.language-option.active {
  background-color: rgba(47, 133, 90, 0.08);
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
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-toggle:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.user-toggle:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(47, 133, 90, 0.15);
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(47, 133, 90, 0.2);
}

.user-avatar-placeholder {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #2f855a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.user-name {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.user-menu:has(.user-dropdown) .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  animation: dropdown-fade 0.25s ease-in-out;
  border: 1px solid rgba(229, 231, 235, 0.8);
  z-index: 101;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  text-align: left;
  padding: 0.8rem 1.2rem;
  background: none;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #2f855a;
}

.dropdown-icon {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Auth buttons styles */
.auth-buttons {
  display: flex;
  gap: 0.8rem;
}

.login-btn {
  color: #2f855a;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border: 1.5px solid #2f855a;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.login-btn:hover {
  background-color: rgba(47, 133, 90, 0.08);
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

.register-btn {
  background-color: #2f855a;
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  transition: all 0.25s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(47, 133, 90, 0.3);
}

.register-btn:hover {
  background-color: #276749;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(47, 133, 90, 0.3);
}

.register-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(47, 133, 90, 0.3);
}

/* Translation loading indicator */
.translation-loading-indicator {
  position: fixed;
  top: 15px;
  right: 15px;
  background: white;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(47, 133, 90, 0.2);
  border-radius: 50%;
  border-top-color: #2f855a;
  animation: spin 0.8s linear infinite;
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
    right: -100%; /* Start offscreen */
    width: 280px;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 5rem;
    gap: 0;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
    transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
    overflow-y: auto;
  }

  .navbar-links.active {
    right: 0;
  }

  .nav-link {
    width: 100%;
    text-align: left;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    font-size: 1.05rem;
    display: flex;
    align-items: center;
  }
  
  .nav-link::after {
    display: none;
  }
  
  /* Mobile tools menu */
  .tools-menu {
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .tools-toggle {
    width: 100%;
    justify-content: flex-start;
    padding: 1rem 1.5rem;
    border: none;
    font-size: 1.05rem;
    display: flex;
    align-items: center;
  }
  
  .tools-toggle::after {
    display: none;
  }
  
  .tools-dropdown {
    position: static;
    box-shadow: none;
    margin-top: 0;
    margin-left: 0;
    border-left: none;
    width: 100%;
    transform: none;
    animation: none;
    border: none;
    background-color: #f8fafc;
  }
  
  .tools-menu .dropdown-item {
    padding-left: 3rem;
  }
  
  /* Mobile language selector */
  .language-selector {
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.75rem 1.5rem;
  }
  
  .language-toggle {
    width: 100%;
    justify-content: flex-start;
    padding: 0.5rem 0;
    border: none;
    font-size: 1.05rem;
    background: none;
  }
  
  .language-dropdown {
    position: static;
    box-shadow: none;
    margin-top: 0.75rem;
    margin-left: 1.5rem;
    border-left: 2px solid #e2e8f0;
    max-height: 200px;
    min-width: unset;
    animation: none;
    border: none;
  }
  
  .language-option {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
  }
  
  /* Mobile auth buttons */
  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .login-btn, .register-btn {
    width: 100%;
    text-align: center;
    padding: 0.9rem;
    font-size: 1rem;
  }
  
  /* Mobile user menu */
  .user-menu {
    width: 100%;
    border-bottom: 1px solid #f1f5f9;
    padding: 0.75rem 1.5rem;
  }
  
  .user-toggle {
    width: 100%;
    justify-content: flex-start;
    padding: 0.5rem 0;
    border: none;
    font-size: 1.05rem;
    background: none;
  }
  
  .user-dropdown {
    position: static;
    box-shadow: none;
    margin-top: 0.75rem;
    margin-left: 1.5rem;
    border-left: 2px solid #e2e8f0;
    animation: none;
    border: none;
  }
  
  .dropdown-item {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
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
    animation: fade-in 0.3s ease;
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* Tablet adjustments */
@media (max-width: 768px) {
  .navbar {
    padding: 0.9rem 1.5rem;
  }
  
  .navbar.scrolled {
    padding: 0.7rem 1.5rem;
  }
  
  .navbar-brand {
    font-size: 1.6rem;
  }
}

/* Mobile adjustments */
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
    width: 80%;
    max-width: 300px;
  }
  
  .nav-link {
    padding: 0.9rem 1.2rem;
    font-size: 1rem;
  }
  
  .language-selector, 
  .user-menu, 
  .auth-buttons {
    padding: 0.7rem 1.2rem;
  }
  
  .language-dropdown,
  .user-dropdown {
    margin-left: 1rem;
  }
  
  .user-name {
    max-width: 100px;
  }
}

/* Very small devices */
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
  
  .nav-link,
  .language-toggle, 
  .user-toggle {
    font-size: 0.95rem;
  }
  
  .login-btn, 
  .register-btn {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  
  .user-name {
    max-width: 80px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar-brand,
  .nav-link,
  .language-toggle,
  .user-toggle,
  .login-btn,
  .register-btn,
  .language-dropdown,
  .user-dropdown,
  .dropdown-arrow {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}

/* Translation states */
.translating {
  position: relative;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.translation-error {
  color: #e53e3e;
  font-style: italic;
}

.translation-loading-dots {
  display: inline-block;
  margin-left: 3px;
  font-size: 0.8em;
  color: #2f855a;
  animation: dot-blink 1.2s infinite;
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
