# Crop Image Prediction Service

This service provides AI-powered crop classification using a ResNet50 deep learning model trained on crop images.

## Features

- **ResNet50 Model**: Transfer learning from ImageNet pre-trained ResNet50
- **Flask API**: RESTful API for predictions
- **Multiple Input Formats**: Supports file uploads and base64 encoded images
- **Confidence Scores**: Returns prediction confidence and top-5 alternatives
- **CORS Enabled**: Ready for React frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend/imagePrediction
pip install -r requirements.txt
```

### 2. Train the Model

Open the Jupyter notebook and train the model:

```bash
jupyter notebook image.ipynb
```

**Important**: Update the dataset paths in the notebook:
- Set `TRAIN_DIR` to your training data directory
- Set `VAL_DIR` to your validation data directory
- Your data should be organized in subdirectories by crop class:
  ```
  train/
    ├── wheat/
    ├── rice/
    ├── corn/
    └── ...
  validation/
    ├── wheat/
    ├── rice/
    ├── corn/
    └── ...
  ```

Run all cells in the notebook. The model will be saved in three formats:
- `Crop_CLF_V1.keras` - Keras format (recommended)
- `crop_model.pkl` - Pickle format (backup)
- `class_names.pkl` - Class names dictionary

### 3. Start the Flask API

```bash
python app.py
```

The API will start on `http://localhost:5005`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "class_names": {...}
}
```

### Get Classes
```
GET /classes
```

Response:
```json
{
  "success": true,
  "classes": {
    "0": "wheat",
    "1": "rice",
    "2": "corn",
    ...
  },
  "num_classes": 10
}
```

### Predict Crop
```
POST /predict
```

**Option 1: File Upload (multipart/form-data)**
```bash
curl -X POST http://localhost:5005/predict \
  -F "image=@crop_image.jpg"
```

**Option 2: Base64 Encoded (JSON)**
```bash
curl -X POST http://localhost:5005/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_string"}'
```

Response:
```json
{
  "success": true,
  "prediction": "wheat",
  "confidence": 0.9523,
  "all_predictions": {
    "wheat": 0.9523,
    "barley": 0.0312,
    "rice": 0.0098,
    ...
  }
}
```

Error Response:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Frontend Integration

The React component at `frontend/src/pages/AreaCropPrediction.jsx` is already configured to use this API.

### Configuration

The API URL can be configured using an environment variable:

1. Copy the example env file:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Update the API URL in `.env`:
   ```
   VITE_IMAGE_PREDICTION_API=http://localhost:5005
   ```

For production, update this to your production API URL.

### Usage Flow:

1. User selects an area on the map (3+ points)
2. User uploads or captures a crop image
3. Click "Start AI Analysis" button
4. API processes the image and returns prediction
5. Results displayed with confidence score and area information

### Example API Call from React:

```javascript
// API URL is configured via environment variable
const API_BASE_URL = import.meta.env.VITE_IMAGE_PREDICTION_API || 'http://localhost:5005';

const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch(`${API_BASE_URL}/predict`, {
  method: 'POST',
  body: formData,
});

const data = await response.json();
if (data.success) {
  console.log(`Predicted crop: ${data.prediction}`);
  console.log(`Confidence: ${data.confidence * 100}%`);
}
```

## Image Requirements

- **Format**: JPEG, PNG, or any format supported by PIL
- **Size**: Any size (automatically resized to 224x224)
- **Preprocessing**: Images are automatically preprocessed for ResNet50
- **Content**: Should contain clear view of crop plants

## Model Details

- **Architecture**: ResNet50 with custom classification head
- **Input Size**: 224x224 RGB images
- **Preprocessing**: ResNet50 preprocess_input (ImageNet normalization)
- **Output**: Softmax probabilities for each crop class
- **Training**: Transfer learning with optional fine-tuning

### Model Architecture:
```
ResNet50 (ImageNet weights, frozen)
  ↓
GlobalAveragePooling2D
  ↓
Dense(512, relu) + Dropout(0.5)
  ↓
Dense(256, relu) + Dropout(0.3)
  ↓
Dense(num_classes, softmax)
```

## Troubleshooting

### Model Not Found Error
- Make sure you've trained the model using `image.ipynb`
- Check that the following files exist in `backend/imagePrediction/`:
  - `Crop_CLF_V1.keras` or `crop_model.pkl`
  - `class_names.pkl`

### CORS Error
- The API is configured for `http://localhost:5173` and `http://localhost:3000`
- If using a different port, update the CORS configuration in `app.py`

### Low Prediction Confidence
- Ensure training data is diverse and well-labeled
- Consider training for more epochs
- Enable fine-tuning in the notebook (uncomment fine-tuning section)
- Add more training data

### Memory Issues
- Reduce `BATCH_SIZE` in the notebook
- Use a machine with more RAM/GPU memory
- Consider using a smaller model (MobileNetV2, EfficientNetB0)

## Production Deployment

For production use:

1. **Use Gunicorn** instead of Flask development server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5005 app:app
   ```

2. **Update CORS origins** in `app.py` to match your production domain

3. **Add authentication** if needed for security

4. **Set up logging** for monitoring:
   ```python
   logging.basicConfig(
       level=logging.INFO,
       filename='prediction.log',
       format='%(asctime)s - %(levelname)s - %(message)s'
   )
   ```

5. **Add rate limiting** to prevent abuse

## Dependencies

- `flask==2.3.3` - Web framework
- `flask-cors==4.0.1` - CORS support
- `tensorflow==2.15.0` - Deep learning framework
- `Pillow==10.0.0` - Image processing
- `numpy==1.26.4` - Numerical operations
- `gunicorn==21.2.0` - Production WSGI server

## License

Part of the Agrolens project.
