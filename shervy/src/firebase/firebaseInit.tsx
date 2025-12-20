import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrkyjWYVjmtYFj4_G1YnufYIvktkZK8oY",
  authDomain: "shervy-a7611.firebaseapp.com",
  projectId: "shervy-a7611",
  storageBucket: "shervy-a7611.firebasestorage.app",
  messagingSenderId: "624618315527",
  appId: "1:624618315527:web:fdcca27299f242de852fa2",
  measurementId: "G-8KSJ8E93Z0"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
