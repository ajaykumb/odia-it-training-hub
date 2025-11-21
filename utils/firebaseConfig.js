// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnSHgLycvt1GSc5SAUWbgIigw7ZFWOwoE",
  authDomain: "odia-it-training-hub-database.firebaseapp.com",
  projectId: "odia-it-training-hub-database",
  storageBucket: "odia-it-training-hub-database.firebasestorage.app",
  messagingSenderId: "799162059424",
  appId: "1:799162059424:web:05065eb839a336e02097c5",
  measurementId: "G-21FR6P12QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
