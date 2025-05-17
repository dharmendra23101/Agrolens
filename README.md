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

## Project Structure
AgroLens/
├── backend/
│   ├── chatbot/
│   │   ├── chatbot.js
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── yield_prediction/
│   │   ├── models/
│   │   │   └── crop_yield_model.pkl
│   │   ├── app.py
│   │   └── requirements.txt
│   ├── recommendation/
│   │   ├── model/
│   │   │   ├── multi_target_forest.pkl
│   │   │   ├── label_encoder.pkl
│   │   │   └── classes.npy
│   │   ├── app.py
│   │   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── YieldForm.jsx
│   │   │   └── RecommendationForm.jsx
│   │   ├── context/
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Weather.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── YieldPrediction.jsx
│   │   │   └── CropRecommendation.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.cjs
├── README.md
└── setup.ps1
