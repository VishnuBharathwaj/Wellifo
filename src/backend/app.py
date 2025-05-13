from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import PyPDF2

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allows React frontend to communicate with Flask backend

# Medicine Search
file_path = r"C:\\VISHNU_VIT\\SEM\\SEM 8\\Capstone\\wellifo\\src\\backend\\medicine_search\\updated_indian_medicine_data.csv"
df = pd.read_csv(file_path)
df.fillna("Not Available", inplace=True)

@app.route("/search", methods=["GET"])
def search_medicine():
    query = request.args.get("query", "").strip().lower()
    if not query:
        return jsonify([])
    filtered_df = df[df["name"].str.lower().str.startswith(query)]
    suggestions = filtered_df[["name"]].to_dict(orient="records")
    return jsonify(suggestions)

@app.route("/medicine/<name>", methods=["GET"])
def get_medicine_details(name):
    medicine = df[df["name"].str.lower() == name.lower()]
    if medicine.empty:
        return jsonify({"error": "Medicine not found"}), 404
    details = medicine.iloc[0].to_dict()
    return jsonify(details)

def calculate_bmi(weight, height):
    return round(weight / (height / 100) ** 2, 2)

# Diet Plan
diet_paths = {
    'underweight': {
        'veg': 'https://drive.google.com/file/d/1ZbdzjGxbvtbtwbDTgrC3GOVQ7oY0xAFP/view?usp=drive_link',
        'non veg': 'https://drive.google.com/file/d/1_ybJD9SPdpsSurPh_43qUSjRRm_UdmYO/view?usp=drive_link',
        'allergies': 'https://drive.google.com/file/d/1tYr_QYXg_JgF2HHWpzMpAKEJdABs9Mhi/view?usp=drive_link',
        'exercise': 'https://drive.google.com/file/d/10XiahH3OKhfwjF0QiFGaZzKVU_rbuaHM/view?usp=drive_link'
    },
    'normal': {
        'veg': 'https://drive.google.com/file/d/1XHuVFABwZSPae8-FxTWvJsFFhZ3VF2HI/view?usp=drive_link',
        'non veg': 'https://drive.google.com/file/d/1vCvvkLqjsa-pLFwKw1SOLts3vLGW-DHe/view?usp=drive_link',
        'allergies': 'https://drive.google.com/file/d/1QYqAjBZC_ytnGRm5NicrjuEyzenV-cP5/view?usp=drive_link',
        'exercise': 'https://drive.google.com/file/d/1NlBUkGB08qz-Q6iTVA9B0UjnZFudqhY5/view?usp=drive_link'
    },
    'overweight': {
        'veg': 'https://drive.google.com/file/d/1ZT9PypTF-D3PbAslQWk97vHxUKF3kWaC/view?usp=drive_link',
        'non veg': 'https://drive.google.com/file/d/142lnQC_M2tkK5r560ic69HMMJ-c7hfrV/view?usp=drive_link',
        'allergies': 'https://drive.google.com/file/d/1Tn9KM7XuAmUGgHMamqpMFMbmHNAEyeFc/view?usp=drive_link',
        'exercise': 'https://drive.google.com/file/d/1JvvVXospzj3E4SkPLX-5EoOSigcGp1Gl/view?usp=drive_link'
    }
}

daily_schedule = [
    "06:30 AM - Wake Up",
    "07:00 AM - Morning Walk",
    "07:30 AM - Exercise",
    "08:00 AM - Breakfast",
    "10:30 AM - Mid-Morning Snack",
    "01:00 PM - Lunch",
    "04:00 PM - Evening Snack",
    "08:00 PM - Dinner",
    "Hydration Reminder - Every 30 Minutes",
    "05:00 PM - Hobby Time",
    "10:00 PM - Sleep Time"
]

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    name = data.get('name')
    gender = data.get('gender')
    height = float(data.get('height'))
    weight = float(data.get('weight'))
    preference = data.get('preference', '').strip().lower()
    allergies = data.get('allergies', [])

    preference = 'non veg' if preference == 'non-veg' else 'veg' if preference == 'veg' else 'allergies'
    bmi = round(weight / (height / 100) ** 2, 2)
    category = 'underweight' if bmi < 18.5 else 'normal' if bmi <= 24.9 else 'overweight'
    diet_pdf = diet_paths[category][preference]
    exercise_pdf = diet_paths[category]['exercise']

    return jsonify({
        "name": name,
        "gender": gender,
        "allergies": allergies,
        "bmi": bmi,
        "category": category,
        "diet_pdf": diet_pdf,
        "exercise_pdf": exercise_pdf,
        "schedule": daily_schedule
    })

# Disease Overview
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
    app.run(host="0.0.0.0", port=5000, debug=True)
