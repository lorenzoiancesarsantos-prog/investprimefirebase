import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;

function getFirebaseAdminApp(): App {
  if (app) {
    return app;
  }

  if (getApps().length > 0) {
    app = getApp();
    return app;
  }

  try {
    console.log("Attempting to initialize Firebase Admin SDK...");

    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    
    if (!serviceAccountString) {
      throw new Error("SERVICE_ACCOUNT environment variable is not set. Firebase Admin initialization failed because credentials were not found.");
    }

    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    app = initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin SDK initialized successfully.");
    return app;

  } catch (error: any) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed.", {
      errorMessage: error.message,
      errorStack: error.stack,
      hasServiceAccountEnv: !!process.env.SERVICE_ACCOUNT,
    });
    
    throw new Error("Could not initialize Firebase Admin SDK. Check server logs for detailed error information.");
  }
}

export function getFirebaseAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}