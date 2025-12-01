// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuuZLX2e-4JT2CYL88vNioC2cOJesFotw",
  authDomain: "personal-finance-tracker-eac5a.firebaseapp.com",
  projectId: "personal-finance-tracker-eac5a",
  storageBucket: "personal-finance-tracker-eac5a.firebasestorage.app",
  messagingSenderId: "581429622436",
  appId: "1:581429622436:web:c80fbedf6f0e86a76f5831",
  measurementId: "G-053X3TZEZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export {db, auth, googleProvider, doc, setDoc};