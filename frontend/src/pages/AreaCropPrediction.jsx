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
  const dropZoneRef = useRef(null);
  
  const [drawing, setDrawing] = useState(false);
  const [areaInfo, setAreaInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || 'bTfYcH4G9baUbfCL4HKu';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';

  // Map Click Handler
  const handleMapClick = useCallback((e) => {
    if (!drawing) return;
    const newCoord = [e.lngLat.lng, e.lngLat.lat];
    setCoordinates(prev => {
      const newCoords = [...prev, newCoord];
      requestAnimationFrame(() => updateMap(newCoords));
      return newCoords;
    });
  }, [drawing]);

  const updateMap = (coords) => {
    if (!map.current || !coords) return;
    markers.forEach(marker => marker.remove());
    
    const newMarkers = coords.map(coord => 
      new maplibregl.Marker({ color: "#ef4444" }).setLngLat(coord).addTo(map.current)
    );
    setMarkers(newMarkers);

    if (coords.length >= 3) {
      const polygonCoords = [...coords, coords[0]];
      const polygon = turf.polygon([polygonCoords]);
      const area = turf.area(polygon);

      setAreaInfo({
        km:  (area / 1e6).toFixed(3),
        hectares: (area / 10000).toFixed(2),
        acres: (area / 4046.86).toFixed(2),
      });

      try {
        const source = map.current.getSource('polygon');
        if (source) {
          source.setData(polygon);
        } else {
          map.current.addSource('polygon', { type: 'geojson', data: polygon });
          map.current.addLayer({
            id: 'polygon-fill',
            type: 'fill',
            source: 'polygon',
            paint: { 'fill-color': '#10b981', 'fill-opacity': 0.3 }
          });
          map.current.addLayer({
            id: 'polygon-outline',
            type: 'line',
            source: 'polygon',
            paint: { 'line-color': '#059669', 'line-width':  3 }
          });
        }
      } catch (error) { console.error(error); }
    } else {
      setAreaInfo(null);
      try {
         if (map.current.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
         if (map.current.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
         if (map.current.getSource('polygon')) map.current.removeSource('polygon');
      } catch (e) {}
    }
  };

  // ✅ FIX 1 & 2: Fixed style URL + empty dependency array
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`, // ✅ Fixed:  removed space
      center: [78.9629, 20.5937],
      zoom: 4
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }), 'top-right');

    map.current.on('load', () => {
      console.log('✅ Map loaded successfully');
    });

    return () => {
      if (map.current) {
        markers.forEach(m => m.remove());
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // ✅ FIX 2: Empty dependency array

  // Add/remove click listener when drawing state changes
  useEffect(() => {
    if (!map.current) return;

    if (drawing) {
      map.current.on('click', handleMapClick);
    } else {
      map.current.off('click', handleMapClick);
    }

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [drawing, handleMapClick]);

  const startDrawing = () => {
    setDrawing(true);
    setCoordinates([]);
    setAreaInfo(null);
    markers.forEach(marker => marker.remove());
    setMarkers([]);
    try {
      if (map.current?.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
      if (map.current?.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
      if (map.current?.getSource('polygon')) map.current.removeSource('polygon');
    } catch(e){}
  };

  const undoPoint = () => {
    if (coordinates.length > 0) {
      setCoordinates(prev => {
        const newCoords = prev.slice(0, -1);
        requestAnimationFrame(() => updateMap(newCoords));
        return newCoords;
      });
    }
  };

  const clearAll = () => {
    setDrawing(false);
    setCoordinates([]);
    setAreaInfo(null);
    markers.forEach(m => m.remove());
    setMarkers([]);
    try {
      if (map.current?.getLayer('polygon-fill')) map.current.removeLayer('polygon-fill');
      if (map.current?.getLayer('polygon-outline')) map.current.removeLayer('polygon-outline');
      if (map.current?.getSource('polygon')) map.current.removeSource('polygon');
    } catch(e){}
  };

  // Image Handling
  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) processImageFile(file);
  };

  // Drag & Drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // Camera Logic
  const startCamera = async () => {
    setShowCamera(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      handleStreamSuccess(stream);
    } catch (err) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        handleStreamSuccess(stream);
      } catch (fallbackErr) {
        alert('Camera access denied or not available');
        setShowCamera(false);
      }
    }
  };

  const handleStreamSuccess = (stream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(e => console.error("Play error:", e));
      };
    }
  };

  const captureImage = () => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          processImageFile(file);
          stopCamera();
        }
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

  const handleAnalyze = async () => {
    if (!areaInfo || !imageFile) {
      alert('Please select an area (3+ points) and upload/capture an image!');
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('areaInfo', JSON.stringify(areaInfo));

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert(`❌ Connection Error: ${error.message}\n\nMake sure Flask server is running on ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1>🛰️ <Translatable>Farm Area Analysis</Translatable></h1>
            <p><Translatable>Select area on satellite map and analyze crops with AI</Translatable></p>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid">
          {/* MAP SECTION */}
          <div className="card map-card">
            <div className="card-header">
              <h2>📍 <Translatable>Select Area</Translatable></h2>
              <div className="controls">
                <button onClick={startDrawing} className="btn btn-start" disabled={drawing}>
                  {drawing ? '🟢 Drawing...' : '🟢 Start'}
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
              {/* ✅ FIX 3: Inline style for cursor */}
              <div 
                ref={mapContainer} 
                className="map-container"
                style={{ cursor: drawing ? 'crosshair' :  'grab' }}
              />
              
              {areaInfo && (
                <div className="area-display">
                  <div className="area-icon">📐</div>
                  <div className="area-info">
                    <div className="area-main">{areaInfo.km} km²</div>
                    <div className="area-sub">{areaInfo.hectares} ha • {areaInfo.acres} acres</div>
                  </div>
                </div>
              )}

              {drawing && (
                <div className="drawing-hint">
                  <span className="pulse"></span>
                  <span>Click map to add points ({coordinates.length} added)</span>
                </div>
              )}
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="card image-card">
            <div className="card-header">
              <h2>📷 <Translatable>Crop Image</Translatable></h2>
            </div>

            <div className="image-section">
              {!showCamera && !selectedImage && (
                <>
                  <div 
                    ref={dropZoneRef}
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="drop-icon">📤</div>
                    <p className="drop-text">
                      {isDragging ? 'Drop image here' : 'Drag & drop image here'}
                    </p>
                    <p className="drop-subtext">or</p>
                  </div>

                  <div className="image-options">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      id="file-upload" 
                      style={{ display: 'none' }} 
                    />
                    <label htmlFor="file-upload" className="upload-btn">
                      📁 Browse Files
                    </label>
                    <button onClick={startCamera} className="camera-btn">
                      📸 Open Camera
                    </button>
                  </div>
                </>
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
                    <button onClick={stopCamera} className="cancel-btn">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}

              {selectedImage && !showCamera && (
                <div className="image-preview">
                  <img src={selectedImage} alt="Selected crop" />
                  <button 
                    className="remove-btn" 
                    onClick={() => {
                      if (selectedImage) URL.revokeObjectURL(selectedImage);
                      setSelectedImage(null);
                      setImageFile(null);
                      setResult(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <button 
                className="analyze-btn" 
                onClick={handleAnalyze} 
                disabled={loading || !areaInfo || !imageFile}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>🚀 Start AI Analysis</>
                )}
              </button>

              {!result && (
                <div className="status-box">
                  {!areaInfo ? '📍 First, select area on map (3+ points)' :
                   !imageFile ? '📷 Now, upload or capture crop image' :
                   '✅ Ready! Click "Start AI Analysis"'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="results-card">
            <div className="results-header">
              <h2>🎯 <Translatable>Analysis Results</Translatable></h2>
            </div>
            
            <div className="results-grid">
              {/* Main Prediction */}
              <div className="result-main">
                <div className="result-icon">🌾</div>
                <div className="result-content">
                  <div className="result-label">Detected Crop</div>
                  <div className="result-value">{result.predicted_crop}</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: result.confidence_percentage }}
                    ></div>
                  </div>
                  <div className="confidence-text">
                    Confidence: {result.confidence_percentage}
                  </div>
                </div>
              </div>

              {/* Area Info */}
              <div className="result-item">
                <div className="result-item-icon">📐</div>
                <div>
                  <div className="result-item-label">Total Area</div>
                  <div className="result-item-value">{areaInfo.km} km²</div>
                  <div className="result-item-sub">
                    {areaInfo.hectares} ha • {areaInfo.acres} acres
                  </div>
                </div>
              </div>

              {/* Top Predictions */}
              <div className="top-predictions">
                <h3>Top 5 Predictions</h3>
                <div className="predictions-list">
                  {result.top_5_predictions?.map((pred, idx) => (
                    <div key={idx} className="prediction-item">
                      <span className="prediction-rank">#{idx + 1}</span>
                      <span className="prediction-name">{pred.crop}</span>
                      <span className="prediction-confidence">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                      <div className="prediction-bar">
                        <div 
                          className="prediction-bar-fill"
                          style={{ width: `${pred.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coordinates Summary */}
        {coordinates.length > 0 && (
          <div className="coords-card">
            <h3>📍 Coordinates ({coordinates.length} points)</h3>
            <div className="coords-list">
              {coordinates.map((coord, idx) => (
                <div key={idx} className="coord-item">
                  <span className="coord-num">{idx + 1}</span>
                  <span className="coord-val">
                    {coord[1].toFixed(6)}°, {coord[0].toFixed(6)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/tools" className="back-link">← <Translatable>Back to Tools</Translatable></Link>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%);
          padding: clamp(0.5rem, 2vw, 2rem);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .header {
          background: white;
          border-radius: 20px;
          padding: clamp(1.5rem, 3vw, 2.5rem);
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .header h1 {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          color: #0c4a6e;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .header p {
          color: #64748b;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
        }

        /* Grid */
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        /* Cards */
        .card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .card-header {
          background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%);
          padding: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-header h2 {
          color: white;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          font-weight: 700;
          margin: 0;
        }

        .controls {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
          white-space: nowrap;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-start { background: #10b981; }
        .btn-undo { background: #f59e0b; }
        .btn-clear { background: #ef4444; }

        /* Map */
        .map-wrapper {
          position: relative;
          height: clamp(350px, 50vh, 500px);
          flex:  1;
        }

        .map-container {
          width: 100%;
          height:  100%;
        }

        .area-display {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          padding: 1rem;
          border-radius:  12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 1rem;
          z-index: 10;
          border: 2px solid #10b981;
        }

        .area-icon {
          font-size: 2rem;
        }

        .area-main {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0c4a6e;
        }

        .area-sub {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 0.2rem;
        }

        .drawing-hint {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(16, 185, 129, 0.95);
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          z-index:  10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .pulse {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        /* Image Section */
        .image-section {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .drop-zone {
          border: 3px dashed #cbd5e1;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          background: #f8fafc;
          transition: all 0.3s;
          cursor: pointer;
        }

        .drop-zone.dragging {
          border-color: #10b981;
          background: #d1fae5;
          transform: scale(1.02);
        }

        .drop-icon {
          font-size: 4rem;
          margin-bottom:  1rem;
        }

        .drop-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .drop-subtext {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .image-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .upload-btn, .camera-btn {
          padding: 1.2rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          font-weight: 600;
          color: #0369a1;
          font-size: 1rem;
          transition: all 0.3s;
          text-align: center;
        }

        .upload-btn:hover, .camera-btn:hover {
          border-color: #10b981;
          background: #f0fdf4;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.2);
        }

        /* Camera */
        .camera-view {
          width: 100%;
          height:  400px;
          background: black;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }

        .video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .camera-controls {
          position: absolute;
          bottom: 2rem;
          width: 100%;
          display:  flex;
          justify-content:  center;
          align-items: center;
          gap: 2rem;
          z-index: 10;
        }

        .capture-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .capture-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 4px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .capture-btn:hover .capture-ring {
          transform: scale(1.1);
        }

        .capture-circle {
          width: 54px;
          height: 54px;
          background: white;
          border-radius: 50%;
        }

        .cancel-btn {
          padding: 0.8rem 1.5rem;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #dc2626;
        }

        /* Image Preview */
        .image-preview {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          max-height: 400px;
        }

        .image-preview img {
          width:  100%;
          height: auto;
          object-fit: contain;
          display: block;
          background: #f8fafc;
        }

        .remove-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .remove-btn:hover {
          transform: scale(1.1);
          background: #dc2626;
        }

        /* Analyze Button */
        .analyze-btn {
          width: 100%;
          padding:  1.2rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
        }

        .analyze-btn:hover: not(:disabled) {
          transform: translateY(-3px);
          box-shadow:  0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .analyze-btn:disabled {
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .status-box {
          background: #dbeafe;
          padding: 1rem;
          border-radius: 10px;
          color: #1e40af;
          font-size: 0.95rem;
          text-align: center;
          font-weight: 500;
        }

        /* Results Card */
        .results-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.15);
          margin-bottom: 1.5rem;
          border: 2px solid #10b981;
        }

        .results-header {
          background:  linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding:  1.5rem;
          color: white;
        }

        .results-header h2 {
          font-size: 1.5rem;
          margin:  0;
        }

        .results-grid {
          padding: 2rem;
          display: grid;
          gap: 1.5rem;
        }

        .result-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 16px;
          border: 2px solid #10b981;
        }

        .result-icon {
          font-size: 4rem;
        }

        .result-content {
          flex: 1;
        }

        .result-label {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .result-value {
          font-size: 2rem;
          font-weight:  800;
          color: #0c4a6e;
          margin-bottom: 0.8rem;
        }

        .confidence-bar {
          width: 100%;
          height:  12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          border-radius: 6px;
          transition: width 0.6s ease;
        }

        .confidence-text {
          font-size: 1rem;
          color: #059669;
          font-weight:  700;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .result-item-icon {
          font-size:  2.5rem;
        }

        .result-item-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        .result-item-value {
          font-size: 1.5rem;
          font-weight:  800;
          color: #0c4a6e;
        }

        .result-item-sub {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 0.2rem;
        }

        .top-predictions {
          padding: 1.2rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .top-predictions h3 {
          font-size: 1.1rem;
          color: #0c4a6e;
          margin-bottom: 1rem;
        }

        .predictions-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .prediction-item {
          display:  grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.8rem;
          align-items:  center;
          padding: 0.8rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .prediction-rank {
          font-weight: 800;
          color: #0c4a6e;
          font-size: 0.9rem;
        }

        .prediction-name {
          font-weight: 600;
          color:  #475569;
        }

        .prediction-confidence {
          font-weight: 700;
          color: #10b981;
          font-size: 0.9rem;
        }

        .prediction-bar {
          grid-column: 2 / 4;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .prediction-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        /* Coordinates */
        .coords-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
        }

        .coords-card h3 {
          color:  #0c4a6e;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .coords-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.8rem;
        }

        .coord-item {
          display: flex;
          align-items: center;
          gap:  0.8rem;
          padding: 0.8rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .coord-num {
          width: 32px;
          height: 32px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display:  flex;
          align-items:  center;
          justify-content:  center;
          font-weight:  800;
          flex-shrink: 0;
        }

        .coord-val {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 600;
        }

        /* Back Link */
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          background: white;
          color: #0369a1;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
          font-size: 1rem;
        }

        .back-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          background: #e0f2fe;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .controls {
            width: 100%;
          }
          
          .btn {
            flex:  1;
            min-width: 90px;
          }

          .image-options {
            grid-template-columns: 1fr;
          }

          .results-grid {
            padding: 1rem;
          }

          .result-main {
            flex-direction: column;
            text-align: center;
          }

          .coords-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .area-display {
            left: 0.5rem;
            bottom: 0.5rem;
            padding: 0.8rem;
            font-size: 0.85rem;
          }

          .drawing-hint {
            font-size: 0.85rem;
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AreaCropPrediction;
