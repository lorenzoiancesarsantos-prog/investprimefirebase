
console.log("FIREBASE_ADMIN_TS: File loading...");
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp(): App {
  console.log("FIREBASE_ADMIN_TS: getFirebaseAdminApp() called.");

  if (getApps().length > 0) {
    console.log("FIREBASE_ADMIN_TS: Firebase app already exists, returning existing app.");
    return getApp();
  }

  const serviceAccount = process.env.SERVICE_ACCOUNT;
  console.log("FIREBASE_ADMIN_TS: SERVICE_ACCOUNT env var present:", !!serviceAccount);
  console.log("FIREBASE_ADMIN_TS: GCLOUD_PROJECT env var present:", !!process.env.GCLOUD_PROJECT);


  if (!serviceAccount) {
    console.log("FIREBASE_ADMIN_TS: Initializing with Application Default Credentials...");
    const app = initializeApp({ projectId: process.env.GCLOUD_PROJECT });
    console.log("FIREBASE_ADMIN_TS: Initialization with ADC successful.");
    return app;
  }

  try {
    const serviceAccountJson = JSON.parse(serviceAccount);
    console.log("FIREBASE_ADMIN_TS: Initializing with service account JSON...");
    const app = initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });
    console.log("FIREBASE_ADMIN_TS: Initialization with service account JSON successful.");
    return app;
  } catch (e) {
    console.error("FIREBASE_ADMIN_TS: FATAL - Failed to parse SERVICE_ACCOUNT JSON.", e);
    throw new Error("Could not initialize Firebase Admin SDK. Service account configuration is invalid.");
  }
}

console.log("FIREBASE_ADMIN_TS: Defining auth and db getters...");

export function getFirebaseAdminAuth(): AdminAuth {
  console.log("FIREBASE_ADMIN_TS: getFirebaseAdminAuth() called.");
  return getAdminAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb(): AdminFirestore {
  console.log("FIREBASE_ADMIN_TS: getFirebaseAdminDb() called.");
  return getAdminFirestore(getFirebaseAdminApp());
}

console.log("FIREBASE_ADMIN_TS: File loaded successfully.");
