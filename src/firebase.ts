
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Hardcoded configuration to ensure client-side initialization is always correct.
const firebaseConfig = {
    apiKey: "AIzaSyCOdAv8886YidVLgzYrHmO6G9c0_xyKg10",
    authDomain: "studio-7505780173-ba373.firebaseapp.com",
    projectId: "studio-7505780173-ba373",
    storageBucket: "studio-7505780173-ba373.firebasestorage.app",
    messagingSenderId: "705447916184",
    appId: "1:705447916184:web:0c5a8e11096863ea4616ed",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        if (!firebaseConfig.projectId) {
            throw new Error("Configuração do Firebase não encontrada. Verifique as variáveis de ambiente.");
        }
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    return app;
}

function getFirebaseAuth(): Auth {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

function getFirebaseDb(): Firestore {
    if (!db) {
        db = getFirestore(getFirebaseApp());
    }
    return db;
}

export { getFirebaseApp, getFirebaseAuth, getFirebaseDb };
