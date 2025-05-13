from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allows React frontend to communicate with Flask backend

# Define disease data
disease_data = {
     "Allergies": {"symptoms": ["sneezing", "runny nose", "itchy eyes", "rash", "shortness of breath"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Allergies.pdf"},
    "Anemia": {"symptoms": ["fatigue", "pale skin", "shortness of breath", "dizziness", "irregular heartbeat"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Anemia.pdf"},
    "Appendicitis": {"symptoms": ["abdominal pain", "nausea", "vomiting", "loss of appetite", "fever"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Appendicitis.pdf"},
    "Arthritis": {"symptoms": ["joint pain", "stiffness", "swelling", "reduced mobility"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Arthritis.pdf"},
    "Asthma": {"symptoms": ["shortness of breath", "wheezing", "chest tightness", "coughing"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Asthma.pdf"},
    "Bronchitis": {"symptoms": ["cough", "mucus", "chest discomfort", "fatigue", "shortness of breath"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Bronchitis.pdf"},
    "Chickenpox": {"symptoms": ["itchy rash", "blisters", "fever", "fatigue", "loss of appetite"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Chickenpox.pdf"},
    "Eczema": {"symptoms": ["dry skin", "itchiness", "red patches", "cracked skin"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Eczema-Atopic_Dermatitis.pdf"},
    "Epilepsy": {"symptoms": ["seizures", "confusion", "staring spells", "uncontrollable movements"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Epilepsy.pdf"},
    "Fever": {"symptoms": ["high temperature", "chills", "sweating", "body ache", "fatigue"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Fever.pdf"},
    "Food poisoning": {"symptoms": ["nausea", "vomiting", "diarrhea", "abdominal cramps", "fever"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/FoodPoisoning.pdf"},
    "Hepatitis B": {"symptoms": ["jaundice", "fatigue", "dark urine", "abdominal pain", "loss of appetite"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Hepatitis_B.pdf"},
    "Hypertension": {"symptoms": ["headache", "dizziness", "chest pain", "blurred vision", "shortness of breath"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Hypertension.pdf"},
    "Kidney Stones": {"symptoms": ["severe pain", "nausea", "vomiting", "bloody urine", "frequent urination"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/KidneyStones.pdf"},
    "Migraine": {"symptoms": ["severe headache", "nausea", "sensitivity to light", "throbbing pain"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Migraine.pdf"},
    "Osteoporosis": {"symptoms": ["bone fractures", "back pain", "stooped posture", "loss of height"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Osteoporosis.pdf"},
    "Pneumonia": {"symptoms": ["cough", "fever", "shortness of breath", "chest pain"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Pneumonia.pdf"},
    "Psoriasis": {"symptoms": ["red patches", "scaly skin", "itching", "dry skin"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Psoriasis.pdf"},
    "Sinusitis": {"symptoms": ["facial pain", "nasal congestion", "headache", "runny nose"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Sinusitis.pdf"},
    "Stroke": {"symptoms": ["sudden numbness", "confusion", "trouble speaking", "loss of balance"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Stroke.pdf"},
    "Tuberculosis": {"symptoms": ["persistent cough", "weight loss", "night sweats", "fever"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/Tuberculosis.pdf"},
    "Ulcerative Colitis": {"symptoms": ["diarrhea", "abdominal pain", "fatigue", "bloody stools"], "pdf": r"C:/VISHNU_VIT/SEM/SEM 8/Capstone/wellifo/src/backend/disease_overview/PDF/UlcerativeColitis.pdf"}
}

# Collect all unique symptoms
all_symptoms = sorted(set(symptom for data in disease_data.values() for symptom in data["symptoms"]))

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    return jsonify(all_symptoms)

@app.route("/search", methods=["POST"])
def search_disease():
    data = request.json
    symptom_input = data.get("symptom", "").lower()

    detected_diseases = [
        d for d, info in disease_data.items() if any(s in symptom_input for s in info["symptoms"])
    ]

    return jsonify({"diseases": detected_diseases})

@app.route("/pdf", methods=["POST"])
def get_pdf_content():
    data = request.json
    disease = data.get("disease")

    if disease in disease_data:
        pdf_path = disease_data[disease]["pdf"]
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as file:
                reader = PyPDF2.PdfReader(file)
                text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            return jsonify({"content": text})
        return jsonify({"error": "PDF not found"}), 404

    return jsonify({"error": "Disease not found"}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
