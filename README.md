# Wellifo – Smart Healthcare Companion App

**Wellifo** is a comprehensive healthcare mobile application developed as part of our final year capstone project. It offers a suite of intelligent and essential features to empower users with accessible medical tools, real-time information, and nutrition guidance — all in one app.

---  

## 🚀 Features

### 1. 🆘 Emergency Caller & Hospital Locator
- One-touch emergency call functionality.
- Locate nearby hospitals with name, contact number, location, and address using geolocation services.

### 2. 💊 Medicine Search
- Search for any medicine and get details like:
  - Manufacturer
  - Price per strip
  - Usage/Benefits
  - Side effects

### 3. 🧠 Disease Prediction
- Enter a symptom and receive potential disease predictions based on symptom-to-disease mapping.

### 4. 🍽️ Diet Prescription
- User inputs height, weight, and allergies (nuts, lactose intolerance).
- Categorizes user into underweight, healthy, overweight, or obese.
- Suggests a personalized diet plan accordingly.

### 5. 📅 Appointment Scheduling
- Schedule appointments based on user-preferred dates and doctor specialization.

### 6. 🧬 NutroGuide
- Get detailed insights into:
  - Micronutrients (Vitamins & Minerals)
  - Macronutrients
- Discover which foods provide essential nutrients and why they are important.

### 7. 📸 FoodTracker (Webcam-Based)
- Captures food images from a live webcam feed.
- Detects food items and classifies them into categories:
  - Vitamin A/B/C
  - Minerals
  - Macronutrients

### 8. 📰 HealthNews
- Stay updated with:
  - Real-time health news
  - Blood donation and health camps
  - Awareness programs

---

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Language:** JavaScript / TypeScript
- **Backend Services:** Firebase (Auth, DB)
- **APIs:** Various REST APIs for medicines, hospitals, news, etc.
- **AI/ML:** Image classification for FoodTracker (TensorFlow / Custom ML Model)
- **Libraries:**
  - `expo-camera`, `expo-location`, `react-navigation`, `axios`, etc.

---

## 📲 How to Run

### 1. Prerequisites
- Node.js >= 18.x
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Expo Go App / VStudio code

### 2. Installation3

```bash
git clone https://github.com/your-username/wellifo.git
cd wellifo
npm install

Then npx expo start.


