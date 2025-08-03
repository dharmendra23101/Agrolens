import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import YieldPrediction from './pages/YieldPrediction'
import CropRecommendation from './pages/CropRecommendation'
import Weather from './pages/Weather'
import Translatable from './components/Translatable'

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/yield-prediction" element={<YieldPrediction />} />
            <Route path="/crop-recommendation" element={<CropRecommendation />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/contact" element={
              <div className="page-container text-center py-8">
                <h1 className="mb-4">
                  <Translatable>Contact Us</Translatable>
                </h1>
                <p className="mb-8 text-medium" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <Translatable>
                    Have questions about AgroLens? We're here to help! Reach out to us using the form below.
                  </Translatable>
                </p>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                  <h3 className="mb-4 text-primary">
                    <Translatable>Send us a message</Translatable>
                  </h3>
                  <form>
                    <div className="grid" style={{ gap: '1rem' }}>
                      <div>
                        <label htmlFor="name">
                          <Translatable>Your Name</Translatable>
                        </label>
                        <input type="text" id="name" name="name" required />
                      </div>
                      <div>
                        <label htmlFor="email">
                          <Translatable>Email Address</Translatable>
                        </label>
                        <input type="email" id="email" name="email" required />
                      </div>
                      <div>
                        <label htmlFor="subject">
                          <Translatable>Subject</Translatable>
                        </label>
                        <input type="text" id="subject" name="subject" required />
                      </div>
                      <div>
                        <label htmlFor="message">
                          <Translatable>Message</Translatable>
                        </label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        <Translatable>Send Message</Translatable>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            } />
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
        `}</style>
      </div>
    </LanguageProvider>
  ) 
}

export default App
