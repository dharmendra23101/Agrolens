from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input
from PIL import Image
import numpy as np
import pickle
import io
import base64
import logging

app = Flask(__name__)

# Configure CORS for React frontend
CORS(app, resources={r"/*": {"origins": ["https://agrolens-gamma.vercel.app", "http://localhost:5173", "http://localhost:3000"]}}, supports_credentials=True)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Global variables for model and class names
model = None
class_names = None
IMG_SIZE = 224

# Load the model and class names
def load_model():
    global model, class_names
    try:
        # Try loading the Keras model first
        logger.info("Loading Keras model...")
        model = tf.keras.models.load_model('Crop_CLF_V1.keras')
        logger.info("✓ Keras model loaded successfully!")
        
        # Load class names
        with open('class_names.pkl', 'rb') as f:
            class_names = pickle.load(f)
        logger.info(f"✓ Class names loaded: {class_names}")
        
        return True
    except Exception as e:
        logger.error(f"Error loading Keras model: {e}")
        
        # Try loading from pickle as fallback
        try:
            logger.info("Trying to load from pickle...")
            with open('crop_model.pkl', 'rb') as f:
                model_data = pickle.load(f)
            model = model_data['model']
            class_names = model_data['class_names']
            logger.info("✓ Model loaded from pickle successfully!")
            return True
        except Exception as e2:
            logger.error(f"Error loading pickle model: {e2}")
            return False

# Load model on startup
if not load_model():
    logger.warning("Model not loaded. Make sure to train and save the model first.")

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocess image for ResNet50 prediction
    
    Args:
        image: PIL Image object
        target_size: tuple of (height, width)
    
    Returns:
        Preprocessed numpy array ready for prediction
    """
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize(target_size, Image.LANCZOS)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        # Preprocess for ResNet50
        img_array = preprocess_input(img_array)
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'class_names': class_names if class_names else None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict crop type from uploaded image
    
    Accepts:
        - multipart/form-data with 'image' file
        - JSON with 'image' as base64 string
    
    Returns:
        JSON with prediction and confidence score
    """
    try:
        if model is None or class_names is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded. Please train the model first.'
            }), 503
        
        image = None
        
        # Check if image is in form data (file upload)
        if 'image' in request.files:
            logger.info("Processing file upload...")
            file = request.files['image']
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'error': 'No file selected'
                }), 400
            
            # Read image from file
            image_bytes = file.read()
            image = Image.open(io.BytesIO(image_bytes))
        
        # Check if image is base64 encoded in JSON
        elif request.is_json and 'image' in request.json:
            logger.info("Processing base64 image...")
            image_data = request.json['image']
            
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        
        else:
            return jsonify({
                'success': False,
                'error': 'No image provided. Send image as file or base64 string.'
            }), 400
        
        # Preprocess the image
        logger.info("Preprocessing image...")
        processed_image = preprocess_image(image, target_size=(IMG_SIZE, IMG_SIZE))
        
        # Make prediction
        logger.info("Making prediction...")
        predictions = model.predict(processed_image, verbose=0)
        
        # Get the predicted class and confidence
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get class name
        predicted_crop = class_names.get(predicted_class_idx, f"Class_{predicted_class_idx}")
        
        logger.info(f"Prediction: {predicted_crop} (confidence: {confidence:.4f})")
        
        # Return prediction
        return jsonify({
            'success': True,
            'prediction': predicted_crop,
            'confidence': round(confidence, 4),
            'all_predictions': {
                class_names.get(i, f"Class_{i}"): round(float(predictions[0][i]), 4)
                for i in range(len(predictions[0]))
            }
        })
    
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get list of available crop classes"""
    if class_names is None:
        return jsonify({
            'success': False,
            'error': 'Class names not loaded'
        }), 503
    
    return jsonify({
        'success': True,
        'classes': class_names,
        'num_classes': len(class_names)
    })

if __name__ == '__main__':
    # Use environment variable to control debug mode (default: False for production safety)
    import os
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 'yes')
    app.run(host='0.0.0.0', port=5005, debug=debug_mode)
