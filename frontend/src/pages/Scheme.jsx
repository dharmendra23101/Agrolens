import React, { useEffect, useState } from "react";
import Translatable from "../components/Translatable";
import "../styles/Scheme.css";

const FIREBASE_URL = import.meta.env.VITE_FIREBASE_SCHEMES_URL;
const SCRAPER_API = import.meta.env.VITE_SCRAPER_API_URL;

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get data from Firebase
      let res = await fetch(FIREBASE_URL);
      if (!res.ok) throw new Error("Failed to fetch schemes data");
      let data = await res.json();

      let needsUpdate = forceRefresh; // Force update if refresh button clicked
      if (data && data.last_updated) {
        const last = new Date(data.last_updated);
        const age = (Date.now() - last.getTime()) / (1000 * 60 * 60);
        if (age >= 12) needsUpdate = true;
        setLastUpdated(last);
      } else {
        needsUpdate = true;
      }

      // Call scraper if data is old or force refresh
      if (needsUpdate) {
        try {
          const scraperRes = await fetch(SCRAPER_API);
          if (!scraperRes.ok) {
            console.warn("Scraper API returned an error:", await scraperRes.text());
          }
        } catch (scraperErr) {
          console.error("Error calling scraper:", scraperErr);
          // Continue with existing data even if scraper fails
        }

        // Reload latest data after scraper runs
        res = await fetch(FIREBASE_URL);
        if (!res.ok) throw new Error("Failed to fetch updated schemes data");
        data = await res.json();
        
        if (data && data.last_updated) {
          setLastUpdated(new Date(data.last_updated));
        }
      }

      if (data?.schemes?.length > 0) {
        setSchemes(data.schemes);
      } else {
        setSchemes([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load agricultural schemes. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
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
            <Translatable>Last updated</Translatable>: {formatDate(lastUpdated.toISOString())}
          </p>
        )}
        <button 
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <>
              <span className="spinner-icon"></span>
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
            onClick={() => fetchData(true)}
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
                {scheme.source_website && (
                  <span className="scheme-card-source">
                    <Translatable>Source</Translatable>: {new URL(scheme.source_website).hostname}
                  </span>
                )}
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
    </div>
  );
};

export default Scheme;
