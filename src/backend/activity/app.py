from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLOv8 model
model = YOLO("yolov8n.pt")

# Food categories
CATEGORIES = {
    "Vitamin A": ["carrot", "mango", "spinach", "apple", "papaya", "sweet potato", "red bell pepper", "cantaloupe", "butternut squash", "kale"],
    "Vitamin B": ["banana", "egg", "milk", "avocado", "legumes", "chicken", "fish", "nuts", "whole grains", "sunflower seeds"],
    "Vitamin C": ["orange", "lemon", "strawberry", "kiwi", "pineapple", "papaya", "mango", "broccoli", "brussels sprouts", "bell peppers"],
    "Minerals": ["broccoli", "kale", "spinach", "cauliflower", "mushrooms", "peas", "lentils", "potatoes", "nuts", "seeds"],
    "Macronutrients": ["almond", "cashew", "walnut", "peanut", "pumpkin seeds", "chia seeds", "oats", "brown rice", "quinoa", "whole wheat bread","Tomato"]
}

@app.route("/detect", methods=["POST"])
def detect_objects():
    file = request.files["image"]
    np_img = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    results = model(img)
    detections = []

    for r in results:
        for box in r.boxes:
            class_id = int(box.cls)
            name = r.names[class_id]
            confidence = float(box.conf)
            detections.append({"name": name, "confidence": confidence})

    response = {}
    for category, items in CATEGORIES.items():
        matched = [
            {"item": d["name"], "confidence": d["confidence"]}
            for d in detections if d["name"] in items
        ]
        response[category.lower().replace(" ", "_")] = {
            "detected": len(matched) > 0,
            "details": matched,
        }

    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)