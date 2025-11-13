import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Translatable from '../components/Translatable';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

function AreaCropPrediction() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [drawing, setDrawing] = useState(false);
  const [areaInfo, setAreaInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);

  const MAPTILER_KEY = 'bTfYcH4G9baUbfCL4HKu';

  const handleMapClick = useCallback((e) => {
    if (!drawing) return;
    
    const newCoord = [e.lngLat.lng, e.lngLat.lat];
    setCoordinates(prev => {
      const newCoords = [...prev, newCoord];
      setTimeout(() => updateMap(newCoords), 0);
      return newCoords;
    });
  }, [drawing]);

  const updateMap = (coords) => {
    if (!map.current || !coords) return;

    // Clear and add markers
    markers.forEach(marker => marker.remove());
    const newMarkers = coords.map(coord => 
      new maplibregl.Marker({ color: "#ff0000" })
        .setLngLat(coord)
        .addTo(map.current)
    );
    setMarkers(newMarkers);

    // Handle polygon
    if (coords.length >= 3) {
      const polygon = turf.polygon([[...coords, coords[0]]]);
      const area = turf.area(polygon);
      setAreaInfo({
        km: (area / 1e6).toFixed(3),
        hectares: (area / 10000).toFixed(2),
        acres: (area / 4046.86).toFixed(2),
      });

      try {
        if (map.current.getSource('polygon')) {
          map.current.getSource('polygon').setData(polygon);
        } else {
          map.current.addSource('polygon', { type: 'geojson', data: polygon });
          map.current.addLayer({
            id: 'polygon-fill',
            type: 'fill',
            source: 'polygon',
            paint: { 'fill-color': '#00bcd4', 'fill-opacity': 0.4 }
          });
          map.current.addLayer({
            id: 'polygon-outline',
            type: 'line',
            source: 'polygon',
            paint: { 'line-color': '#006064', 'line-width': 2 }
          });
        }
      } catch (error) {
        console.error('Polygon error:', error);
      }
    } else {
      setAreaInfo(null);
      try {
        if (map.current.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
        if (map.current.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
        if (map.current.getSource('polygon')) map.current.removeSource('polygon');
      } catch (error) {
        console.error('Remove polygon error:', error);
      }
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
      center: [78.9629, 20.5937],
      zoom: 5
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }), 'top-right');

    map.current.on('load', () => {
      map.current.on('click', handleMapClick);
    });

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
        markers.forEach(marker => marker.remove());
        map.current.remove();
        map.current = null;
      }
    };
  }, [handleMapClick]);

  const startDrawing = () => {
    setDrawing(true);
    setCoordinates([]);
    setAreaInfo(null);
    markers.forEach(marker => marker.remove());
    setMarkers([]);
    
    if (map.current) {
      try {
        if (map.current.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
        if (map.current.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
        if (map.current.getSource('polygon')) map.current.removeSource('polygon');
      } catch (error) {
        console.error('Clear error:', error);
      }
    }
  };

  const undoPoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(prev => {
        const newCoords = prev.slice(0, -1);
        setTimeout(() => updateMap(newCoords), 0);
        return newCoords;
      });
    }
  };

  const clearAll = () => {
    setDrawing(false);
    setCoordinates([]);
    setAreaInfo(null);
    markers.forEach(marker => marker.remove());
    setMarkers([]);
    
    if (map.current) {
      try {
        if (map.current.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
        if (map.current.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
        if (map.current.getSource('polygon')) map.current.removeSource('polygon');
      } catch (error) {
        console.error('Clear error:', error);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(console.error);
      };
    }
    setShowCamera(true);
  } catch (err) {
    alert('Camera access denied: ' + err.message);
  }
};


  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        setSelectedImage(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const handleAnalyze = () => {
    if (!areaInfo || !imageFile) {
      alert('Please select an area (3+ points) and capture/upload an image!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert(`Analysis Ready!\n\nArea: ${areaInfo.km} km² (${areaInfo.hectares} hectares)`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1><Translatable>🛰️ Farm Area Analysis</Translatable></h1>
          <p><Translatable>Select area on satellite map and analyze crops with AI</Translatable></p>
        </header>

        <div className="grid">
          {/* MAP SECTION */}
          <div className="card">
            <div className="card-header">
              <h2><Translatable>📍 Select Area</Translatable></h2>
              <div className="controls">
                <button onClick={startDrawing} className="btn btn-start" disabled={drawing}>
                  {drawing ? '🟢 Click Map' : '🟢 Start'}
                </button>
                <button onClick={undoPoint} className="btn btn-undo" disabled={coordinates.length === 0}>
                  ↩️ Undo
                </button>
                <button onClick={clearAll} className="btn btn-clear" disabled={coordinates.length === 0}>
                  ❌ Clear
                </button>
              </div>
            </div>

            <div className="map-wrapper">
              <div ref={mapContainer} className="map-container" />

              {areaInfo && (
                <div className="area-display">
                  <div className="area-icon">📐</div>
                  <div>
                    <div className="area-main">{areaInfo.km} km²</div>
                    <div className="area-sub">{areaInfo.hectares} ha • {areaInfo.acres} acres</div>
                  </div>
                </div>
              )}

              {drawing && (
                <div className="drawing-hint">
                  <span className="pulse"></span>
                  Click map ({coordinates.length} points)
                  {coordinates.length < 3 && <small> • Need 3+ for area</small>}
                </div>
              )}

              {coordinates.length > 0 && !drawing && (
                <div className="points-info">📍 {coordinates.length} point{coordinates.length > 1 ? 's' : ''}</div>
              )}
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="card">
            <h2><Translatable>📷 Crop Image</Translatable></h2>

            {!showCamera && !selectedImage && (
              <div className="image-options">
                <input type="file" accept="image/*" onChange={handleImageUpload} id="file-upload" style={{ display: 'none' }} />
                <label htmlFor="file-upload" className="upload-btn">
                  📤 Upload Image
                </label>
                <button onClick={startCamera} className="camera-btn">📸 Take Photo</button>
              </div>
            )}

            {showCamera && (
              <div className="camera-view">
                <video ref={videoRef} autoPlay playsInline muted className="video" />
                <div className="camera-controls">
                  <button onClick={captureImage} className="capture-btn">
                    <div className="capture-ring">
                      <div className="capture-circle"></div>
                    </div>
                  </button>
                  <button onClick={stopCamera} className="cancel-btn">❌ Cancel</button>
                </div>
              </div>
            )}

            {selectedImage && !showCamera && (
              <div className="image-preview">
                <img src={selectedImage} alt="Crop" />
                <button
                  className="remove-btn"
                  onClick={() => {
                    if (selectedImage) URL.revokeObjectURL(selectedImage);
                    setSelectedImage(null);
                    setImageFile(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !areaInfo || !imageFile}>
              {loading ? (
                <><span className="spinner"></span> 🔍 Analyzing...</>
              ) : (
                <>🚀 Start AI Analysis</>
              )}
            </button>

            <div className="info-box">
              {coordinates.length < 3 ? 
                "📍 Select area (3+ points) and add crop image" :
                areaInfo ? 
                  `✅ Area: ${areaInfo.km} km² - Add image to analyze` :
                  "📍 Area selected - Add crop image"
              }
            </div>
          </div>
        </div>

        {/* COORDINATES DISPLAY */}
        {coordinates.length > 0 && (
          <div className="coords-section">
            <h3><Translatable>📍 Coordinates ({coordinates.length})</Translatable></h3>
            <div className="coords-grid">
              {coordinates.map((coord, index) => (
                <div key={index} className="coord-item">
                  <div className="coord-number">{index + 1}</div>
                  <div className="coord-values">
                    <div className="coord-row">
                      <span className="label">🌍 Lat:</span>
                      <span className="value">{coord[1].toFixed(6)}°</span>
                    </div>
                    <div className="coord-row">
                      <span className="label">🗺️ Lng:</span>
                      <span className="value">{coord[0].toFixed(6)}°</span>
                    </div>
                  </div>
                  <button 
                    className="focus-btn"
                    onClick={() => {
                      if (map.current) {
                        map.current.flyTo({ center: coord, zoom: 15, duration: 1000 });
                      }
                    }}
                  >
                    🎯
                  </button>
                </div>
              ))}
            </div>
            
            <div className="coords-summary">
              <div className="summary-item">
                <strong>📍 Total Points: {coordinates.length}</strong>
              </div>
              {areaInfo && (
                <div className="summary-item">
                  <strong>📐 Area: {areaInfo.km} km² ({areaInfo.hectares} ha / {areaInfo.acres} acres)</strong>
                </div>
              )}
              <button 
                className="fit-btn"
                onClick={() => {
                  if (coordinates.length > 0 && map.current) {
                    const bounds = new maplibregl.LngLatBounds();
                    coordinates.forEach(coord => bounds.extend(coord));
                    map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
                  }
                }}
              >
                🔍 Fit Map to Area
              </button>
            </div>
          </div>
        )}

        <Link to="/tools" className="back-link">← Back to Tools</Link>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }

        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%);
          padding: 0.5rem;
        }

        .container { max-width: 1200px; margin: 0 auto; }

        .header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .header h1 {
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          color: #0c4a6e;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .header p {
          color: #0369a1;
          font-size: clamp(0.9rem, 2vw, 1rem);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .card-header h2 {
          color: white;
          margin: 0;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-weight: 700;
        }

        .card > h2 {
          color: #0c4a6e;
          margin: 0 0 1rem 0;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          font-weight: 700;
          padding: 1rem 1rem 0;
        }

        .controls {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.6rem, 1.5vw, 1rem);
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: clamp(0.7rem, 1.8vw, 0.85rem);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-start { background: #10b981; color: white; }
        .btn-undo { background: #f59e0b; color: white; }
        .btn-clear { background: #ef4444; color: white; }

        .map-wrapper {
          position: relative;
          height: clamp(280px, 40vw, 450px);
        }

        .map-container {
          width: 100%;
          height: 100%;
          cursor: ${drawing ? 'crosshair' : 'default'};
        }

        .area-display {
          position: absolute;
          bottom: clamp(10px, 2vw, 20px);
          left: clamp(10px, 2vw, 20px);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          padding: clamp(0.5rem, 1.5vw, 1rem);
          border-radius: clamp(8px, 2vw, 14px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: clamp(0.5rem, 1vw, 1rem);
          z-index: 10;
          border: 2px solid #00bcd4;
        }

        .area-icon { font-size: clamp(1.2rem, 3vw, 2rem); }

        .area-main {
          font-size: clamp(1rem, 2.5vw, 1.6rem);
          font-weight: 800;
          color: #0c4a6e;
        }

        .area-sub {
          font-size: clamp(0.7rem, 1.5vw, 0.85rem);
          color: #64748b;
          margin-top: 0.2rem;
        }

        .drawing-hint {
          position: absolute;
          top: clamp(10px, 2vw, 20px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(16, 185, 129, 0.95);
          color: white;
          padding: clamp(0.4rem, 1vw, 0.75rem) clamp(0.8rem, 2vw, 1.5rem);
          border-radius: 25px;
          font-weight: 600;
          font-size: clamp(0.7rem, 1.8vw, 0.9rem);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 10;
          max-width: 90%;
        }

        .points-info {
          position: absolute;
          top: clamp(10px, 2vw, 20px);
          left: clamp(10px, 2vw, 20px);
          background: rgba(59, 130, 246, 0.95);
          color: white;
          padding: clamp(0.3rem, 1vw, 0.5rem) clamp(0.6rem, 1.5vw, 1rem);
          border-radius: 6px;
          font-size: clamp(0.7rem, 1.8vw, 0.9rem);
          font-weight: 600;
          z-index: 10;
        }

        .pulse {
          width: clamp(8px, 2vw, 12px);
          height: clamp(8px, 2vw, 12px);
          background: white;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .card > div:not(.card-header) { padding: 1rem; }

        .image-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .upload-btn, .camera-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: clamp(1rem, 2.5vw, 1.5rem);
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          color: #0369a1;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
        }

        .upload-btn:hover, .camera-btn:hover {
          border-color: #00bcd4;
          background: #e0f2fe;
          transform: translateY(-2px);
        }

        .camera-view {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}


        .camera-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .capture-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .capture-ring {
          width: clamp(50px, 10vw, 70px);
          height: clamp(50px, 10vw, 70px);
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .capture-btn:hover .capture-ring { transform: scale(1.1); }

        .capture-circle {
          width: clamp(38px, 8vw, 54px);
          height: clamp(38px, 8vw, 54px);
          background: white;
          border-radius: 50%;
        }

        .cancel-btn {
          padding: 0.6rem 1.2rem;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          max-height: 60vh;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          background: #f8fafc;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: clamp(28px, 6vw, 36px);
          height: clamp(28px, 6vw, 36px);
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .analyze-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
          color: white;
          padding: clamp(0.8rem, 2vw, 1.1rem);
          border: none;
          border-radius: 10px;
          font-size: clamp(0.9rem, 2.2vw, 1.05rem);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 1rem;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(14, 165, 233, 0.4);
        }

        .analyze-btn:disabled {
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .info-box {
          background: #dbeafe;
          padding: 0.8rem;
          border-radius: 8px;
          color: #1e40af;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          text-align: center;
          line-height: 1.4;
        }

        .coords-section {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          padding: clamp(1rem, 2.5vw, 2rem);
          margin-bottom: 1.5rem;
          border: 2px solid #e0f2fe;
        }

        .coords-section h3 {
          color: #0c4a6e;
          margin: 0 0 1rem 0;
          font-size: clamp(1.1rem, 2.8vw, 1.4rem);
          font-weight: 700;
          text-align: center;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          padding: 0.8rem;
          border-radius: 8px;
        }

        .coords-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .coord-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s;
        }

        .coord-item:hover {
          border-color: #00bcd4;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 188, 212, 0.2);
        }

        .coord-number {
          width: clamp(32px, 6vw, 40px);
          height: clamp(32px, 6vw, 40px);
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          flex-shrink: 0;
          border: 2px solid white;
          box-shadow: 0 3px 8px rgba(239, 68, 68, 0.4);
        }

        .coord-values { flex: 1; }

        .coord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.3rem 0;
        }

        .label {
          font-weight: 700;
          color: #475569;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
        }

        .value {
          font-family: 'Courier New', monospace;
          font-weight: 800;
          color: #0c4a6e;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          background: rgba(255, 255, 255, 0.9);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        .focus-btn {
          background: #00bcd4;
          color: white;
          border: none;
          border-radius: 6px;
          padding: clamp(0.3rem, 1vw, 0.5rem);
          cursor: pointer;
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .focus-btn:hover {
          background: #0891b2;
          transform: scale(1.1);
        }

        .coords-summary {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          border-radius: 12px;
          padding: 1rem;
          border: 2px solid #bfdbfe;
          text-align: center;
        }

        .summary-item {
          margin-bottom: 0.8rem;
          color: #1e40af;
          font-size: clamp(0.9rem, 2.2vw, 1.1rem);
        }

        .fit-btn {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          background: #f59e0b;
          color: white;
        }

        .fit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: white;
          color: #0369a1;
          text-decoration: none;
          font-weight: 600;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
        }

        .back-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          background: #e0f2fe;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr; }
          .coords-grid { grid-template-columns: 1fr; }
          .image-options { grid-template-columns: 1fr; }
          
          .controls {
            width: 100%;
            flex-direction: column;
          }
          
          .btn { width: 100%; }
          
          .coord-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .coord-row {
            justify-content: center;
            gap: 1rem;
          }
          
          .area-display {
            bottom: 8px;
            left: 8px;
            right: 8px;
          }
        }

        @media (max-width: 480px) {
          .page { padding: 0.25rem; }
          
          .drawing-hint {
            left: 0.5rem;
            right: 0.5rem;
            transform: none;
            font-size: 0.7rem;
            padding: 0.4rem 0.8rem;
          }
          
          .controls { gap: 0.2rem; }
          .grid { gap: 0.8rem; }
        }
      `}</style>
    </div>
  );0
}

export default AreaCropPrediction;