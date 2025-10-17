// src/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { getApp as getAdminApp, getApps as getAdminApps, initializeApp as initializeAdminApp, credential } from 'firebase-admin/app';

// --- Configuração do Cliente (Navegador) ---
const firebaseConfig = {
    apiKey: "AIzaSyCOdAv8886YidVLgzYrHmO6G9c0_xyKg10",
    authDomain: "studio-7505780173-ba373.firebaseapp.com",
    projectId: "studio-7505780173-ba373",
    storageBucket: "studio-7505780173-ba373.firebasestorage.app",
    messagingSenderId: "705447916184",
    appId: "1:705447916184:web:4e0936bd001a45e84616ed"
};

function getClientFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getClientFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getClientFirebaseApp());
}

// --- Configuração do Servidor (Admin) ---
function getAdminFirebaseApp() {
  if (getAdminApps().length) {
    return getAdminApp();
  }
  
  const serviceAccount = process.env.SERVICE_ACCOUNT;
  if (serviceAccount) {
    try {
      return initializeAdminApp({
        credential: credential.cert(JSON.parse(serviceAccount)),
      });
    } catch(e) {
      console.error("Failed to parse SERVICE_ACCOUNT. Initializing with default credentials.", e);
      // Fallback to default credentials if parsing fails
      return initializeAdminApp();
    }
  } else {
    // This will only work in a Google Cloud environment
    return initializeAdminApp();
  }
}

export function getFirebaseAdminAuth() {
  return getAdminFirebaseApp().auth();
}

export function getFirebaseAdminDb(): AdminFirestore {
  return getAdminFirestore(getAdminFirebaseApp());
}
