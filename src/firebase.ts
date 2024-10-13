import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIky6tJZiKLDSYAkTR3PEXH9GqsJnHycc",
  authDomain: "nwritter-8822e.firebaseapp.com",
  projectId: "nwritter-8822e",
  storageBucket: "nwritter-8822e.appspot.com",
  messagingSenderId: "1009400861306",
  appId: "1:1009400861306:web:ada0177bab95072ebd21c3",
  measurementId: "G-E00106PS7V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app)

