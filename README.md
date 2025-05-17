# AgroLens 🌱

AgroLens is a comprehensive agricultural technology platform that helps farmers make data-driven decisions. Our tools combine modern agricultural science with user-friendly technology to optimize farming operations.

## Features

- **Crop Yield Prediction**: Predict potential yields based on various environmental and farming parameters
- **Crop Recommendation**: Get personalized crop recommendations based on soil conditions and location
- **Weather Forecasting**: Access detailed weather forecasts to plan farming activities
- **Multi-language Support**: Access the platform in your preferred language
- **Responsive Design**: Use the platform on any device - desktop, tablet, or mobile

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests

### Backend
- Python Flask for yield prediction and crop recommendation models
- Node.js for chatbot functionality
- Machine Learning models (Random Forest) for agricultural predictions


## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ (for backend services)
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/dharmendra23101/AgroLens.git
cd AgroLens/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
### Backend Setup
```base
# Setup Yield Prediction Service
cd ../backend/yield_prediction
pip install -r requirements.txt
python app.py

# Setup Recommendation Service
cd ../recommendation
pip install -r requirements.txt
python app.py

# Setup Chatbot Service
cd ../chatbot
npm install
node chatbot.js
```


### Development
# To run the project in development mode:
```base
# Frontend (from frontend directory)
npm run dev

# Access the application at http://localhost:5173
```

### Deployment
## Vercel Deployment Notes
To ensure proper functioning of client-side routing when deployed to Vercel, the project includes a vercel.json configuration file that redirects all routes to the main index.html file:

```base
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This configuration prevents 404 errors when refreshing pages or accessing routes directly.

### Usage
Visit the home page to learn about AgroLens features.  
Use the navigation menu to access different tools:
- **Yield Prediction** – Enter crop and field details to get yield estimates.
- **Crop Recommendation** – Get suggestions for suitable crops based on soil data.
- **Weather** – Check current and forecasted weather conditions.
- **Contact** – Reach out to the AgroLens team with questions or feedback.

### Contributing
We welcome contributions to AgroLens! To contribute:
- Fork the repository
- Create your feature branch (`git checkout -b feature/amazing-feature`)
- Commit your changes (`git commit -m 'Add some amazing feature'`)
- Push to the branch (`git push origin feature/amazing-feature`)
- Open a Pull Request

### Contact
## Dharmendra - GitHub Profile

## Project Link: https://github.com/dharmendra23101/AgroLens

Made with ❤️ for farmers everywhere

This README provides comprehensive documentation for your AgroLens project, including installation instructions, project structure, and deployment notes. It highlights the key features of your application and provides clear guidance for both users and potential contributors.

