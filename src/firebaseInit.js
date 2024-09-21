import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import the auth service

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCfEptfM-6JOyrFhKMoVYpjgkF7XaYE8xs",
  authDomain: "dtdl-3f499.firebaseapp.com",
  databaseURL: "https://dtdl-3f499-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dtdl-3f499",
  storageBucket: "dtdl-3f499.appspot.com",
  messagingSenderId: "882326858288",
  appId: "1:882326858288:web:5fef4932b03a8080b0dbf5",
  measurementId: "G-TKPRE9FH6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth

export { auth }; // Export the auth instance