import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { LanguageContext } from '../context/LanguageContext';
import Translatable from '../components/Translatable';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : err.code === 'auth/too-many-requests'
          ? 'Too many unsuccessful login attempts. Please try again later.'
          : 'Failed to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to log in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          <Translatable>Log in to AgroLens</Translatable>
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
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
          
          <div className="form-group">
            <label htmlFor="password">
              <Translatable>Password</Translatable>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'en' ? 'Enter your password' : ''}
              required
            />
          </div>
          
          <div className="forgot-password">
            <Link to="/reset-password">
              <Translatable>Forgot password?</Translatable>
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <Translatable>Log In</Translatable>
            )}
          </button>
        </form>
        
        <div className="divider">
          <span><Translatable>or</Translatable></span>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          className="google-button"
          disabled={loading}
        >
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          <span><Translatable>Continue with Google</Translatable></span>
        </button>
        
        <div className="register-link">
          <Translatable>Don't have an account?</Translatable>
          <Link to="/register"> <Translatable>Sign up</Translatable></Link>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 2rem;
          background-color: #f9fafb;
        }
        
        .login-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }
        
        .login-title {
          color: #2f855a;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
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
        
        .login-form {
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
        
        .forgot-password {
          text-align: right;
          font-size: 0.875rem;
        }
        
        .forgot-password a {
          color: #2f855a;
          text-decoration: none;
        }
        
        .forgot-password a:hover {
          text-decoration: underline;
        }
        
        .login-button {
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
        }
        
        .login-button:hover {
          background-color: #276749;
        }
        
        .login-button:disabled {
          background-color: #9ae6b4;
          cursor: not-allowed;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: #a0aec0;
          font-size: 0.875rem;
        }
        
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .divider span {
          padding: 0 0.75rem;
        }
        
        .google-button {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          color: #4a5568;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 100%;
        }
        
        .google-button:hover {
          background-color: #f7fafc;
        }
        
        .google-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .register-link {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
          color: #4a5568;
        }
        
        .register-link a {
          color: #2f855a;
          font-weight: 500;
          text-decoration: none;
        }
        
        .register-link a:hover {
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
          .login-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;