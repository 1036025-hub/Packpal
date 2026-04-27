// Import core Firebase
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYkR6_AbofzjFPj65P0TSY5Hxvfu0EANA",
  authDomain: "packpal-1250f.firebaseapp.com",
  projectId: "packpal-1250f",

 
  storageBucket: "packpal-1250f.appspot.com",

  messagingSenderId: "696745295149",
  appId: "1:696745295149:web:a8c62f15a35029555fe7a4",
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);