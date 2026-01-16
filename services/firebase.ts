
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, query, addDoc, getDocs, where, orderBy } from "firebase/firestore";

// Note: In a production environment, these keys should be in environment variables.
// For the purpose of this demo, we'll use a placeholder structure.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mak-work-os.firebaseapp.com",
  projectId: "mak-work-os",
  storageBucket: "mak-work-os.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  addDoc, 
  getDocs, 
  where, 
  orderBy 
};
