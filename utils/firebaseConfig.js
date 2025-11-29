// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnSHgLycvt1GSc5SAUWbgIigw7ZFWOwoE",
  authDomain: "odia-it-training-hub-database.firebaseapp.com",
  projectId: "odia-it-training-hub-database",

  // ✅ FIXED STORAGE BUCKET (VERY IMPORTANT)
  storageBucket: "odia-it-training-hub-database.appspot.com",

  messagingSenderId: "799162059424",
  appId: "1:799162059424:web:05065eb839a336e02097c5",
  measurementId: "G-21FR6P12QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export all services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Optional: Analytics (only on client)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ FINAL EXPORT
export { auth, db, storage, analytics };
