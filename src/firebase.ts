
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCOdAv8886YidVLgzYrHmO6G9c0_xyKg10",
    authDomain: "studio-7505780173-ba373.firebaseapp.com",
    projectId: "studio-7505780173-ba373",
    storageBucket: "studio-7505780173-ba373.firebasestorage.app",
    messagingSenderId: "705447916184",
    appId: "1:705447916184:web:4e0936bd001a45e84616ed"
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export function getFirebaseAuth(): Auth {
  return auth;
}

export function getFirestoreDb(): Firestore {
  return db;
}
