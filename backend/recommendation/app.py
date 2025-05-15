from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://agrolens-gamma.vercel.app"]}}, supports_credentials=True)


# Load model and label encoder
try:
    with open('./model/multi_target_forest.pkl', 'rb') as model_file:
        multi_target_forest = pickle.load(model_file)

    with open('./model/label_encoder.pkl', 'rb') as encoder_file:
        label_encoder = pickle.load(encoder_file)
    
    print("Model and encoder loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Prepare input data
        input_data = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])
        
        # Make prediction
        prediction = multi_target_forest.predict(input_data)
        predicted_crop_encoded = prediction.argmax(axis=1)[0]
        predicted_crop = label_encoder.inverse_transform([predicted_crop_encoded])[0]
        
        return jsonify({'crop': predicted_crop})
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)
