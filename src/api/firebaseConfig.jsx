import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import authentication module

const firebaseConfig = {
  apiKey: "firebase",
  authDomain: "healthcareapp-ccc2b.firebaseapp.com",
  projectId: "healthcareapp-ccc2b",
  storageBucket: "healthcareapp-ccc2b.appspot.com",
  messagingSenderId: "1002684398886",
  appId: "ID",
  measurementId: "ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize authentication

export { auth };
