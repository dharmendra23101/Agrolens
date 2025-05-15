from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import logging

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["https://agrolens-gamma.vercel.app"]}}, supports_credentials=True)


# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load the model and transformers
try:
    with open('models/crop_yield_model.pkl', 'rb') as f:
        model_data = pickle.load(f)
    
    ct = model_data['column_transformer']
    le = model_data['label_encoder']
    imputer = model_data['imputer']
    scaler = model_data['scaler']
    regressor = model_data['model']
    boolean_indices = model_data['boolean_indices']
    numeric_indices = model_data['numeric_indices']
    feature_names = model_data['feature_names']
    
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    try:
        data = request.get_json()
        logger.debug(f"Received data: {data}")
        
        required_fields = ['soil_type', 'crop', 'rainfall', 'temperature', 'fertilizer', 'irrigation', 'weather', 'days_to_harvest']
        if not all(field in data for field in required_fields):
            logger.warning("Missing required fields")
            return jsonify({'error': 'Missing required fields'}), 400

        sample = {
            'Soil_Type': data['soil_type'],
            'Crop': data['crop'],
            'Rainfall_mm': float(data['rainfall']),
            'Temperature_Celsius': float(data['temperature']),
            'Fertilizer_Used': data['fertilizer'],
            'Irrigation_Used': data['irrigation'],
            'Weather_Condition': data['weather'],
            'Days_to_Harvest': int(data['days_to_harvest'])
        }
        sample_df = pd.DataFrame([sample])
        logger.debug(f"Sample DataFrame: {sample_df}")
        
        # Convert Yes/No to 1/0
        for col in ['Fertilizer_Used', 'Irrigation_Used']:
            sample_df[col] = 1 if sample_df[col].iloc[0] == 'Yes' else 0
        
        sample_encoded = ct.transform(sample_df)
        sample_encoded_df = pd.DataFrame(sample_encoded)
        sample_encoded_df = pd.DataFrame(imputer.transform(sample_encoded_df))

        for col in numeric_indices:
            if col < sample_encoded_df.shape[1]:
                sample_encoded_df[col] = scaler.transform(sample_encoded_df[[col]])

        sample_encoded = sample_encoded_df.to_numpy()
        prediction = float(regressor.predict(sample_encoded)[0])
        prediction = round(prediction, 2)

        logger.info(f"Prediction: {prediction}")
        return jsonify({'prediction': prediction})
    
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
