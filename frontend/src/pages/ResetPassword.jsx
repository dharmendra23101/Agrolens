import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : 'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">
          <Translatable>Reset Password</Translatable>
        </h2>
        
        <p className="reset-description">
          <Translatable>
            Enter your email address and we'll send you a link to reset your password.
          </Translatable>
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-group">
            <label htmlFor="email">
              <Translatable>Email</Translatable>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'en' ? 'Enter your email' : ''}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <Translatable>Send Reset Link</Translatable>
            )}
          </button>
        </form>
        
        <div className="back-link">
          <Link to="/login">
            <Translatable>Back to Login</Translatable>
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .reset-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
          background-color: #f9fafb;
        }
        
        .reset-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }
        
        .reset-title {
          color: #2f855a;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .reset-description {
          color: #4a5568;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .error-message {
          background-color: #fed7d7;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        
        .success-message {
          background-color: #c6f6d5;
          color: #276749;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
        
        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
        }
        
        .form-group input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #2f855a;
          box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.2);
        }
        
        .reset-button {
          background-color: #2f855a;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2.75rem;
          margin-top: 0.5rem;
        }
        
        .reset-button:hover {
          background-color: #276749;
        }
        
        .reset-button:disabled {
          background-color: #9ae6b4;
          cursor: not-allowed;
        }
        
        .back-link {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        
        .back-link a {
          color: #2f855a;
          text-decoration: none;
          font-weight: 500;
        }
        
        .back-link a:hover {
          text-decoration: underline;
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
          .reset-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;