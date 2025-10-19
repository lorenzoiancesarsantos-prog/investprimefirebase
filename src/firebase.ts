
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// As variáveis de ambiente NEXT_PUBLIC_* são injetadas no cliente pelo Next.js
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validação para garantir que o ficheiro .env.local está configurado
if (!firebaseConfig.apiKey) {
  throw new Error("A configuração do Firebase não foi encontrada. Verifique se o seu ficheiro .env.local está configurado corretamente com as variáveis NEXT_PUBLIC_FIREBASE_*.");
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function getClientFirebaseApp(): FirebaseApp {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    return app;
}

export function getFirebaseAuth(): Auth {
    if (!auth) {
        const app = getClientFirebaseApp();
        auth = getAuth(app);
    }
    return auth;
}

export function getFirebaseDb(): Firestore {
    if (!db) {
        const app = getClientFirebaseApp();
        db = getFirestore(app);
    }
    return db;
}
