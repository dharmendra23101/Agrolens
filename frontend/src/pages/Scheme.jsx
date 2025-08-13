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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get data from Firebase
        let res = await fetch(FIREBASE_URL);
        if (!res.ok) throw new Error("Failed to fetch Firebase data");
        let data = await res.json();

        let needsUpdate = true;
        if (data && data.last_updated) {
          const last = new Date(data.last_updated);
          const age = (Date.now() - last.getTime()) / (1000 * 60 * 60);
          if (age < 12) needsUpdate = false;
          setLastUpdated(last);
        }

        // Call scraper if data is old
        if (needsUpdate) {
          await fetch(SCRAPER_API);
        }

        // Load latest data
        res = await fetch(FIREBASE_URL);
        if (!res.ok) throw new Error("Failed to fetch Firebase data");
        data = await res.json();

        if (data?.schemes?.length > 0) setSchemes(data.schemes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load agricultural schemes.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="scheme-container">
      <h1 className="scheme-title"><Translatable>Agricultural Schemes</Translatable></h1>
      {lastUpdated && <p>Last updated: {formatDate(lastUpdated.toISOString())}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : schemes.length === 0 ? (
        <p>No schemes available.</p>
      ) : (
        <div className="schemes-list">
          {schemes.map((scheme, i) => (
            <div key={i} className="scheme-card">
              <h3>{scheme.title}</h3>
              <p>Published: {scheme.publish_date}</p>
              <div>
                {scheme.pdf_link && <a href={scheme.pdf_link} target="_blank">View PDF</a>}
                {scheme.website_link && <a href={scheme.website_link} target="_blank">Visit Website</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scheme;
