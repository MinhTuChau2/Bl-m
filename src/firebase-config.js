// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp8CGOwf3ZRZhwH5PTg0Z2Yw8Hk4eF7ag",
  authDomain: "yaywoo-e6375.firebaseapp.com",
  projectId: "yaywoo-e6375",
  storageBucket: "yaywoo-e6375.appspot.com",
  messagingSenderId: "8826816573",
  appId: "1:8826816573:web:441070e85a4d10fda78254",
  measurementId: "G-RGMC1DPB25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();