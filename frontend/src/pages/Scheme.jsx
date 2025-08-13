import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Translatable from "../components/Translatable";
import "../styles/Scheme.css";

// Access environment variables 
const FIREBASE_URL = import.meta.env.VITE_FIREBASE_SCHEMES_URL;
const SCRAPER_API = import.meta.env.VITE_SCRAPER_API_URL;

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkDataAndUpdate = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First check if we have data and if it needs updating
        const res = await fetch(FIREBASE_URL);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();

        let needsUpdate = false;
        if (!data || !data.last_updated) {
          needsUpdate = true;
        } else {
          const lastUpdated = new Date(data.last_updated);
          const ageHours = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
          if (ageHours >= 12) {
            needsUpdate = true;
          }
          setLastUpdated(lastUpdated);
        }

        if (needsUpdate) {
          console.log("Data is old or missing. Calling scraper...");
          const updateRes = await fetch(SCRAPER_API);
          
          if (!updateRes.ok) {
            console.warn("Scraper API returned an error but continuing with existing data");
          } else {
            console.log("Scraper ran successfully");
          }
        }

        // Load the data (either updated or existing)
        await loadData();
      } catch (err) {
        console.error("Error in data update check:", err);
        setError("Failed to check for updates. Please try refreshing the page.");
        setLoading(false);
      }
    };

    const loadData = async () => {
      try {
        const res = await fetch(FIREBASE_URL);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (data && data.schemes && Array.isArray(data.schemes)) {
          setSchemes(data.schemes);
          if (data.last_updated) {
            setLastUpdated(new Date(data.last_updated));
          }
        } else {
          setSchemes([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load agricultural schemes. Please try again later.");
        setLoading(false);
      }
    };

    checkDataAndUpdate();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString; // Return the original string if parsing fails
    }
  };

  return (
    <div className="scheme-container">
      <div className="scheme-header">
        <h1 className="scheme-title">
          <Translatable>Agricultural Schemes</Translatable>
        </h1>
        <p className="scheme-description">
          <Translatable>
            Access the latest government agricultural schemes and programs to enhance your farming practices.
          </Translatable>
        </p>
        {lastUpdated && (
          <p className="scheme-last-updated">
            <Translatable>Last updated</Translatable>:{' '}
            {formatDate(lastUpdated.toISOString())}
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text"><Translatable>Loading schemes...</Translatable></p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            <Translatable>Retry</Translatable>
          </button>
        </div>
      ) : schemes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-message">
            <Translatable>No agricultural schemes available at the moment. Please check back later.</Translatable>
          </p>
        </div>
      ) : (
        <div className="schemes-list">
          {schemes.map((scheme, index) => (
            <div key={index} className="scheme-card">
              <h3 className="scheme-card-title">{scheme.title}</h3>
              <div className="scheme-card-meta">
                <span className="scheme-card-date">
                  <Translatable>Published</Translatable>: {scheme.publish_date}
                </span>
              </div>
              <div className="scheme-card-actions">
                {scheme.pdf_link && (
                  <a 
                    href={scheme.pdf_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="scheme-action-button pdf-button"
                  >
                    <span className="button-icon">📄</span>
                    <Translatable>View PDF</Translatable>
                  </a>
                )}
                {scheme.website_link && (
                  <a 
                    href={scheme.website_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="scheme-action-button website-button"
                  >
                    <span className="button-icon">🌐</span>
                    <Translatable>Visit Website</Translatable>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="refresh-container">
          <button 
            className="refresh-button"
            onClick={() => window.location.reload()}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                <Translatable>Refreshing...</Translatable>
              </>
            ) : (
              <>
                <span className="refresh-icon">🔄</span>
                <Translatable>Refresh Schemes</Translatable>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Scheme;