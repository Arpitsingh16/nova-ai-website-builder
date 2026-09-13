// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aiwebsitebuilder-a731c.firebaseapp.com",
  projectId: "aiwebsitebuilder-a731c",
  storageBucket: "aiwebsitebuilder-a731c.firebasestorage.app",
  messagingSenderId: "897840698083",
  appId: "1:897840698083:web:046dba22b1d3c856a2abd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
