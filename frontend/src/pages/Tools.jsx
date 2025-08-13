import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';

function Tools() {
  const { isLoading } = useContext(LanguageContext);

  return (
    <div className="tools-page">
      <div className="tools-container">
        <h1 className="page-title">
          <Translatable>Agricultural Tools</Translatable>
        </h1>
        
        <p className="page-description">
          <Translatable>
            Our agricultural tools help you make data-driven decisions for your farm.
            Use these intelligent features to optimize your farming operations.
          </Translatable>
        </p>
        
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon">🌾</div>
            <h2 className="tool-title">
              <Translatable>Yield Prediction</Translatable>
            </h2>
            <p className="tool-description">
              <Translatable>
                Predict your crop yields based on historical data and environmental factors.
                Plan better with accurate forecasts.
              </Translatable>
            </p>
            <Link to="/yield-prediction" className="tool-button">
              <Translatable>Use Tool</Translatable>
            </Link>
          </div>
          
          <div className="tool-card">
            <div className="tool-icon">🌱</div>
            <h2 className="tool-title">
              <Translatable>Crop Recommendation</Translatable>
            </h2>
            <p className="tool-description">
              <Translatable>
                Get personalized crop recommendations based on your soil conditions, 
                climate, and location for optimal growth and yield.
              </Translatable>
            </p>
            <Link to="/crop-recommendation" className="tool-button">
              <Translatable>Use Tool</Translatable>
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .tools-page {
          padding: 3rem 1.5rem;
          background-color: #f8fafc;
          min-height: calc(100vh - 160px);
        }
        
        .tools-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .page-description {
          font-size: 1.1rem;
          color: #4a5568;
          max-width: 800px;
          margin: 0 auto 3rem;
          text-align: center;
          line-height: 1.6;
        }
        
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .tool-card {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .tool-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .tool-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        .tool-description {
          color: #4a5568;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          flex-grow: 1;
        }
        
        .tool-button {
          display: inline-block;
          background-color: #2f855a;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
          box-shadow: 0 2px 4px rgba(47, 133, 90, 0.3);
        }
        
        .tool-button:hover {
          background-color: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(47, 133, 90, 0.3);
        }
        
        .tool-button:active {
          transform: translateY(0);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }
          
          .page-description {
            font-size: 1rem;
          }
          
          .tools-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }
        }
        
        @media (max-width: 480px) {
          .tools-page {
            padding: 2rem 1rem;
          }
          
          .page-title {
            font-size: 1.8rem;
          }
          
          .tool-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Tools;