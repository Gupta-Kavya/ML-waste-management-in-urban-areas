from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define model and image dimensions
model_path = 'my_model.h5'  # Path to the saved model
img_height, img_width = 224, 224

# Load the model once at startup
model = load_model(model_path)
print("Model loaded.")

# Define the prediction function
def predict_image(img_path):
    img = image.load_img(img_path, target_size=(img_height, img_width))
    img_array = image.img_to_array(img) / 255.0  # Normalize to [0, 1]
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    prediction = model.predict(img_array)
    return "Biodegradable" if prediction < 0.5 else "Non-Biodegradable"

# Route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
    
    # Save the uploaded image to a temporary path
    temp_path = os.path.join("temp_image.jpg")
    file.save(temp_path)

    # Get the prediction result
    result = predict_image(temp_path)

    # Clean up the saved image
    os.remove(temp_path)

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)
