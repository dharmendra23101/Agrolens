
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model and class names
MODEL_PATH = os.getenv('MODEL_PATH', 'models/crop_prediction_model.keras')
CLASS_NAMES_PATH = os.getenv('CLASS_NAMES_PATH', 'models/class_names.pkl')

print("🔄 Loading model...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

print("🔄 Loading class names...")
try:
    with open(CLASS_NAMES_PATH, 'rb') as f:
        class_names = pickle.load(f)
    print(f"✅ Class names loaded!  Total classes: {len(class_names)}")
except Exception as e: 
    print(f"❌ Error loading class names: {e}")
    class_names = {}

def prepare_image(image_bytes):
    """Prepare image for prediction"""
    try:
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
        
        # Resize to model input size
        img = cv2.resize(img, (224, 224))
        
        # Convert BGR to RGB (OpenCV uses BGR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Expand dimensions and preprocess
        img = np.expand_dims(img, axis=0)
        img = preprocess_input(img)
        
        return img
    except Exception as e:
        raise ValueError(f"Image preparation failed: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict_crop():
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'success': False,
                'error':  'Model not loaded.Please check server logs.'
            }), 500
        
        # Check if image is in request
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error':  'No image provided'
            }), 400
        
        # Get image file
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No image selected'
            }), 400
        
        image_bytes = image_file.read()
        
        # Get area info if provided
        area_data = request.form.get('areaInfo')
        
        # Prepare image
        print("🔄 Preparing image...")
        prepared_img = prepare_image(image_bytes)
        
        # Make prediction
        print("🔄 Making prediction...")
        predictions = model.predict(prepared_img, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get crop name
        crop_name = class_names.get(predicted_class_idx, f"Unknown ({predicted_class_idx})")
        
        # Get top 5 predictions
        top_5_idx = np.argsort(predictions[0])[-5:][::-1]
        top_5_predictions = [
            {
                'crop':  class_names.get(idx, f"Unknown ({idx})"),
                'confidence':  float(predictions[0][idx])
            }
            for idx in top_5_idx
        ]
        
        response = {
            'success': True,
            'predicted_crop': crop_name,
            'confidence': confidence,
            'confidence_percentage': f"{confidence * 100:.2f}%",
            'top_5_predictions': top_5_predictions,
            'area_info': area_data
        }
        
        print(f"✅ Prediction successful:  {crop_name} ({confidence * 100:.2f}%)")
        return jsonify(response)
        
    except ValueError as ve:
        return jsonify({
            'success':  False,
            'error': str(ve)
        }), 400
    except Exception as e: 
        print(f"❌ Error during prediction: {str(e)}")
        return jsonify({
            'success': False,
            'error': f"Prediction failed: {str(e)}"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'available_classes': len(class_names),
        'model_path': MODEL_PATH,
        'class_names_path': CLASS_NAMES_PATH
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '🌾 Crop Prediction API',
        'version': '1.0.0',
        'endpoints': {
            '/predict': 'POST - Predict crop from image',
            '/health': 'GET - Health check'
        }
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5003))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print("\n" + "="*50)
    print("🌾 Crop Prediction API Server")
    print("="*50)
    print(f"🚀 Server running on http://localhost:{port}")
    print(f"📊 Model: {MODEL_PATH}")
    print(f"📋 Classes: {len(class_names)}")
    print(f"🔧 Debug:  {debug}")
    print("="*50 + "\n")
    
    app.run(debug=debug, host='0.0.0.0', port=port)
