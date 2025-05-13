from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Function to calculate BMI
def calculate_bmi(weight, height):
    return round(weight / (height / 100) ** 2, 2)

# Diet plan file paths
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

# Health Schedule
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

# API to generate a plan
@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    name = data.get('name')
    gender = data.get('gender')
    height = float(data.get('height'))
    weight = float(data.get('weight'))
    preference = data.get('preference', '').strip().lower()
    allergies = data.get('allergies', [])

    # Normalize preference
    preference = 'non veg' if preference == 'non-veg' else 'veg' if preference == 'veg' else 'allergies'

    # Calculate BMI
    bmi = round(weight / (height / 100) ** 2, 2)

    # Determine category
    category = 'underweight' if bmi < 18.5 else 'normal' if bmi <= 24.9 else 'overweight'

    # Get PDFs
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

