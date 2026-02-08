import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9Uu1Lv7TALPJAxKEhXxKWh1RPCxKhj0g",
  authDomain: "personal-portfolio-470707.firebaseapp.com",
  projectId: "personal-portfolio-470707",
  storageBucket: "personal-portfolio-470707.firebasestorage.app",
  messagingSenderId: "455980302460",
  appId: "1:455980302460:web:47de9703958d55f07409f9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
