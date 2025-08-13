import React, { useEffect, useState, useRef } from "react";
import Translatable from "../components/Translatable";
import "../styles/Scheme.css";

const SCRAPER_LINK = import.meta.env.VITE_SCRAPER_LINK;
const FIREBASE_URL = import.meta.env.VITE_FIREBASE_URL;

const Scheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  
  // Scroll indicator reference
  const scrollRef = useRef(null);

  // Handle scroll for the scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setScrollWidth(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utility: fetch JSON safely
  const fetchJson = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error(`Invalid JSON from ${url}`, text.substring(0, 200) + "...");
      throw new Error("Invalid JSON response from server");
    }
  };

  const canForceScrape = (data) => {
    if (!data || !data.schemes) return true; // No data
    if (!data.last_updated) return true; // No timestamp
    const last = new Date(data.last_updated);
    const ageHours = (Date.now() - last.getTime()) / (1000 * 60 * 60);
    return ageHours >= 12; // Only allow if 12+ hours old
  };

  // Main fetch logic
  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      // 1️⃣ Get existing Firebase data
      let data = null;
      try {
        data = await fetchJson(FIREBASE_URL);
      } catch (err) {
        console.warn("Firebase fetch failed:", err);
      }

      if (data?.last_updated) {
        setLastUpdated(new Date(data.last_updated));
      }

      // Always show current data first
      if (data?.schemes?.length > 0) {
        setSchemes(data.schemes);
      } else {
        setSchemes([]);
      }

      // 2️⃣ Decide if scraper should run
      const needsUpdate = forceRefresh
        ? canForceScrape(data)
        : canForceScrape(data);

      if (needsUpdate) {
        try {
          const scraperRes = await fetch(SCRAPER_LINK);
          if (!scraperRes.ok) {
            console.warn("Scraper API error:", await scraperRes.text());
          } else {
            // ✅ Fetch updated Firebase data
            const newData = await fetchJson(FIREBASE_URL);
            if (newData?.schemes?.length > 0) {
              setSchemes(newData.schemes);
              if (newData.last_updated)
                setLastUpdated(new Date(newData.last_updated));
            }
          }
        } catch (scraperErr) {
          console.error("Scraper call failed:", scraperErr);
        }
      }
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setError("Failed to load government schemes. Please try again later.");
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
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Scroll indicator */}
      <div 
        className="scroll-indicator" 
        ref={scrollRef}
        style={{ width: `${scrollWidth}%` }} 
      />
      
      <div className="scheme-container">
        <div className="scheme-header">
          <h1 className="scheme-title">
            <Translatable>Govt Schemes</Translatable>
          </h1>
          {lastUpdated && (
            <p className="scheme-last-updated">
              <Translatable>Last updated</Translatable>:{" "}
              {formatDate(lastUpdated.toISOString())}
            </p>
          )}
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Schemes"}
          </button>
        </div>

        {loading ? (
          <div className="loading-container">Loading schemes...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : schemes.length === 0 ? (
          <div className="empty-state">
            No government schemes available right now.
          </div>
        ) : (
          <div className="schemes-list">
            {schemes.map((scheme, index) => (
              <div key={index} className="scheme-card">
                <h3>{scheme.title}</h3>
                <p>Published: {scheme.publish_date}</p>
                <div className="scheme-card-links">
                  {scheme.pdf_link && (
                    <a
                      href={scheme.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  )}
                  {scheme.website_link && (
                    <a
                      href={scheme.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Scheme;
