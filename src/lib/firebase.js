import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "cmpg313-group2-chat-app.firebaseapp.com",
  projectId: "cmpg313-group2-chat-app",
  storageBucket: "cmpg313-group2-chat-app.appspot.com",
  messagingSenderId: "252700380993",
  appId: "1:252700380993:web:c7d04c4c49515588579bc0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()






