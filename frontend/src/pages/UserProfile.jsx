import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';

function UserProfile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          <Translatable>User Profile</Translatable>
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="profile-avatar">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : '?'}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <label><Translatable>Name</Translatable>:</label>
            <span>{currentUser?.displayName || <Translatable>Not provided</Translatable>}</span>
          </div>
          
          <div className="info-item">
            <label><Translatable>Email</Translatable>:</label>
            <span>{currentUser?.email}</span>
          </div>
          
          <div className="info-item">
            <label><Translatable>Account created</Translatable>:</label>
            <span>
              {currentUser?.metadata?.creationTime ? 
                new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                <Translatable>Unknown</Translatable>}
            </span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            className="logout-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <Translatable>Log Out</Translatable>
            )}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .profile-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
          background-color: #f9fafb;
        }
        
        .profile-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          width: 100%;
          max-width: 500px;
        }
        
        .profile-title {
          color: #2f855a;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .error-message {
          background-color: #fed7d7;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        
        .profile-avatar {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .profile-avatar img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #2f855a;
        }
        
        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #e2e8f0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2.5rem;
          font-weight: 600;
          color: #2f855a;
          border: 3px solid #2f855a;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .info-item label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #718096;
        }
        
        .info-item span {
          font-size: 1rem;
          color: #2d3748;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #edf2f7;
        }
        
        .profile-actions {
          display: flex;
          justify-content: center;
        }
        
        .logout-button {
          background-color: #e53e3e;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2.75rem;
        }
        
        .logout-button:hover {
          background-color: #c53030;
        }
        
        .logout-button:disabled {
          background-color: #fc8181;
          cursor: not-allowed;
        }
        
        .loading-spinner-small {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .profile-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default UserProfile;