import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import YieldPrediction from './pages/YieldPrediction'
import CropRecommendation from './pages/CropRecommendation'
import Weather from './pages/Weather'

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
                <h1 className="mb-4">Contact Us</h1>
                <p className="mb-8 text-medium" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  Have questions about AgroLens? We're here to help! Reach out to us using the form below.
                </p>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                  <h3 className="mb-4 text-primary">Send us a message</h3>
                  <form>
                    <div className="grid" style={{ gap: '1rem' }}>
                      <div>
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" name="name" required />
                      </div>
                      <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required />
                      </div>
                      <div>
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required />
                      </div>
                      <div>
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Send Message
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
        `}</style>
      </div>
    </LanguageProvider>
  ) 
}

export default App