from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from werkzeug.exceptions import BadRequest

app = Flask(__name__)
CORS(app)

# Load YOLOv8 model
model = YOLO("yolov8n.pt")  # Make sure this model file exists

# Food categories
CATEGORIES = {
    "Vitamin A": ["carrot", "mango", "spinach", "apple", "papaya", "sweet potato", 
                 "red bell pepper", "cantaloupe", "butternut squash", "kale"],
    "Vitamin B": ["banana", "egg", "milk", "avocado", "legumes", "chicken", 
                 "fish", "nuts", "whole grains", "sunflower seeds"],
    "Vitamin C": ["orange", "lemon", "strawberry", "kiwi", "pineapple", "papaya", 
                 "mango", "broccoli", "brussels sprouts", "bell peppers"],
    "Minerals": ["broccoli", "kale", "spinach", "cauliflower", "mushrooms", 
                "peas", "lentils", "potatoes", "nuts", "seeds"],
    "Macronutrients": ["almond", "cashew", "walnut", "peanut", "pumpkin seeds", 
                      "chia seeds", "oats", "brown rice", "quinoa", "whole wheat bread", "tomato"]
}

def process_image(image_data):
    """Process image from either file upload or base64"""
    try:
        if isinstance(image_data, str):  # Base64 image
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            binary_data = base64.b64decode(image_data)
            np_img = np.frombuffer(binary_data, np.uint8)
        else:  # File upload
            np_img = np.frombuffer(image_data.read(), np.uint8)
        
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image")
        return img
    except Exception as e:
        raise BadRequest(f"Image processing failed: {str(e)}")

@app.route("/detect", methods=["POST"])
def detect_objects():
    try:
        # Handle both file upload and base64 JSON
        if 'image' in request.files:
            img = process_image(request.files['image'])
        elif request.is_json and 'image' in request.json:
            img = process_image(request.json['image'])
        else:
            raise BadRequest("No image provided. Send either as file upload or base64 in JSON")

        # Run YOLO detection
        results = model(img)
        detections = []

        # Process detections
        for r in results:
            for box in r.boxes:
                class_id = int(box.cls)
                name = r.names[class_id].lower()  # Convert to lowercase for matching
                confidence = float(box.conf)
                detections.append({"name": name, "confidence": confidence})

        # Prepare response
        response = {}
        for category, items in CATEGORIES.items():
            matched = [
                {"item": d["name"], "confidence": d["confidence"]}
                for d in detections if d["name"] in [item.lower() for item in items]
            ]
            response[category.lower().replace(" ", "_")] = {
                "detected": len(matched) > 0,
                "details": matched,
            }

        return jsonify(response)

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        app.logger.error(f"Detection error: {str(e)}")
        return jsonify({"error": "Object detection failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)