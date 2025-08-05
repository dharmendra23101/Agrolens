import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveContactMessage } from '../services/adminService'
import Translatable from '../components/Translatable'

function Contact() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    subject: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('sending')
    setError('')
    
    try {
      // Save message to Firestore
      await saveContactMessage({
        ...formData,
        userId: currentUser?.uid || null
      })
      
      setFormStatus('success')
      setFormData({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        subject: '',
        message: ''
      })
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Failed to send message. Please try again.')
      setFormStatus('error')
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1><Translatable>Contact Us</Translatable></h1>
        <p>
          <Translatable>
            Have questions about AgroLens? We're here to help you optimize your farming operations.
          </Translatable>
        </p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h2><Translatable>Get In Touch</Translatable></h2>
          <p>
            <Translatable>
              Fill out the form and our team will get back to you within 24 hours.
            </Translatable>
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-details">
                <h3><Translatable>Email</Translatable></h3>
                <p>dkbob3337@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="method-icon">📱</div>
              <div className="method-details">
                <h3><Translatable>Phone</Translatable></h3>
                <p>+19 xxxxxxx848</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="method-icon">📍</div>
              <div className="method-details">
                <h3><Translatable>Office</Translatable></h3>
                <p>
                  <Translatable>
                    Plot No. 7, Sector 24
                  </Translatable>
                  <br />
                  <Translatable>
                    IIIT Naya raipur, Chhattisgarh 493661
                  </Translatable>
                </p>
              </div>
            </div>
          </div>
          
          <div className="operating-hours">
            <h3><Translatable>Operating Hours</Translatable></h3>
            <p><Translatable>Monday - Friday: 9:00 AM - 5:00 PM</Translatable></p>
            <p><Translatable>Saturday: 10:00 AM - 2:00 PM</Translatable></p>
            <p><Translatable>Sunday: Closed</Translatable></p>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h2><Translatable>Send Us a Message</Translatable></h2>
          <form onSubmit={handleSubmit} className="contact-form">
            {error && (
              <div className="form-error">
                <p>{error}</p>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name"><Translatable>Your Name</Translatable></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email"><Translatable>Email Address</Translatable></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject"><Translatable>Subject</Translatable></label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message"><Translatable>Your Message</Translatable></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className={`submit-button ${formStatus === 'sending' ? 'loading' : ''}`}
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 
                <Translatable>Sending...</Translatable> : 
                <Translatable>Send Message</Translatable>
              }
            </button>
            
            {formStatus === 'success' && (
              <div className="form-success">
                <p>
                  ✓ <Translatable>Your message has been sent successfully! We'll get back to you soon.</Translatable>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <div className="faq-section">
        <h2><Translatable>Frequently Asked Questions</Translatable></h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3><Translatable>How accurate are the crop predictions?</Translatable></h3>
            <p>
              <Translatable>
                Our AI models have been trained on extensive agricultural datasets and typically 
                achieve 85-90% accuracy in predicting crop yields and recommendations under normal conditions.
              </Translatable>
            </p>
          </div>
          
          <div className="faq-item">
            <h3><Translatable>Do you offer consultations for large farms?</Translatable></h3>
            <p>
              <Translatable>
                Yes, we offer personalized consultations for large-scale agricultural operations. 
                Please contact us directly to discuss your specific requirements.
              </Translatable>
            </p>
          </div>
          
          <div className="faq-item">
            <h3><Translatable>Is my data secure?</Translatable></h3>
            <p>
              <Translatable>
                Absolutely. We use industry-standard encryption and security protocols to ensure 
                your data remains private and protected at all times.
              </Translatable>
            </p>
          </div>
          
          <div className="faq-item">
            <h3><Translatable>Can I integrate AgroLens with other farming systems?</Translatable></h3>
            <p>
              <Translatable>
                Yes, we offer API integration with many popular farming management systems. 
                Contact our technical team for integration details.
              </Translatable>
            </p>
          </div>
        </div>
      </div>

      {/* Add the styling */}
      <style>{`
        .contact-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
        }
        
        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .contact-header h1 {
          font-size: 2.5rem;
          color: #2f855a;
          margin-bottom: 1rem;
        }
        
        .contact-header p {
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.125rem;
          color: #4a5568;
        }
        
        .contact-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        
        @media (min-width: 768px) {
          .contact-container {
            grid-template-columns: 1fr 1.5fr;
          }
        }
        
        .contact-info {
          background-color: #f0fff4;
          padding: 2rem;
          border-radius: 12px;
        }
        
        .contact-info h2 {
          color: #2f855a;
          margin-bottom: 1rem;
          font-size: 1.75rem;
        }
        
        .contact-info > p {
          color: #4a5568;
          margin-bottom: 2rem;
        }
        
        .contact-methods {
          margin-bottom: 2rem;
        }
        
        .contact-method {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .method-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          background-color: white;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .method-details h3 {
          font-size: 1.125rem;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        
        .method-details p {
          color: #4a5568;
          margin: 0;
        }
        
        .operating-hours h3 {
          font-size: 1.125rem;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }
        
        .operating-hours p {
          margin: 0 0 0.5rem;
          color: #4a5568;
        }
        
        .contact-form-container {
          background-color: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .contact-form-container h2 {
          color: #2f855a;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }
        
        .contact-form {
          display: grid;
          gap: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 0.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }
        
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #f7fafc;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #2f855a;
          box-shadow: 0 0 0 3px rgba(47, 133, 90, 0.1);
          background-color: white;
        }
        
        .submit-button {
          padding: 0.875rem;
          background-color: #2f855a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          background-color: #276749;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .submit-button.loading {
          background-color: #9ae6b4;
          cursor: not-allowed;
        }
        
        .form-success {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 8px;
          animation: fadeIn 0.5s ease;
        }
        
        .form-success p {
          color: #2f855a;
          margin: 0;
          text-align: center;
        }
        
        .form-error {
          padding: 1rem;
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          animation: fadeIn 0.5s ease;
        }
        
        .form-error p {
          color: #c53030;
          margin: 0;
          text-align: center;
        }
        
        .faq-section {
          margin-top: 3rem;
        }
        
        .faq-section h2 {
          color: #2f855a;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }
        
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .faq-item {
          background-color: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        
        .faq-item h3 {
          color: #2d3748;
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
        }
        
        .faq-item p {
          color: #4a5568;
          margin: 0;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Additional styling for Translatable components */
        .translating {
          position: relative;
          display: inline-block;
        }
        
        h1 .translating, h2 .translating, h3 .translating {
          display: inline-block;
        }
        
        button .translating {
          display: inline;
        }
        
        p .translating {
          display: inline;
        }
      `}</style>
    </div>
  )
}

export default Contact
