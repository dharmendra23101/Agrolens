import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import YieldPrediction from './pages/YieldPrediction'
import CropRecommendation from './pages/CropRecommendation'
import Weather from './pages/Weather'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminCheck from './components/AdminCheck';
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/yield-prediction" element={<YieldPrediction />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-check" element={<AdminCheck />} />
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          
          {/* Global Styles */}
          <style>{`
            .app {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            
            .main-content {
              flex: 1;
            }
            
            /* Focus visible for accessibility */
            :focus-visible {
              outline: 3px solid rgba(47, 133, 90, 0.5);
              outline-offset: 3px;
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar {
              width: 12px;
            }
            
            ::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            
            ::-webkit-scrollbar-thumb {
              background: #c3ecd0;
              border-radius: 6px;
              border: 3px solid #f1f1f1;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: #2f855a;
            }
            
            /* Form Elements */
            textarea {
              resize: vertical;
              min-height: 120px;
            }
            
            ::placeholder {
              color: #a0aec0;
              opacity: 1;
            }
            
            /* Page Transitions */
            .page-transition-enter {
              opacity: 0;
              transform: translateY(10px);
            }
            
            .page-transition-enter-active {
              opacity: 1;
              transform: translateY(0);
              transition: opacity 300ms, transform 300ms;
            }
            
            .page-transition-exit {
              opacity: 1;
              transform: translateY(0);
            }
            
            .page-transition-exit-active {
              opacity: 0;
              transform: translateY(-10px);
              transition: opacity 300ms, transform 300ms;
            }
            
            /* Translation styles */
            .translating {
              position: relative;
              opacity: 0.9;
              transition: opacity 0.3s ease;
            }
            
            .translation-loading-dots {
              display: inline-block;
              margin-left: 3px;
              font-size: 0.8em;
              color: #2f855a;
              animation: dot-blink 1s infinite;
            }
            
            @keyframes dot-blink {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            
            /* Auth form styles */
            .form-group {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              margin-bottom: 1rem;
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
            
            .auth-button {
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
            
            .auth-button:hover {
              background-color: #276749;
            }
            
            .auth-button:disabled {
              background-color: #9ae6b4;
              cursor: not-allowed;
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
            
            .loading-spinner-small {
              width: 1.25rem;
              height: 1.25rem;
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              border-top-color: white;
              animation: spin 1s ease-in-out infinite;
            }
            
            .loading-container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 300px;
            }
            
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 3px solid rgba(47, 133, 90, 0.2);
              border-radius: 50%;
              border-top-color: #2f855a;
              animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </LanguageProvider>
    </AuthProvider>
  ) 
}

export default App
