'''
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Use a module-level cache to avoid re-initializing on every call.
let app: App | undefined;

/**
 * A robust, lazy-initializing function for the Firebase Admin SDK.
 * It ensures the SDK is initialized only once and provides detailed logging
 * for diagnostics.
 * 
 * @returns The initialized Firebase App instance.
 */
function getFirebaseAdminApp(): App {
  // If the app is already initialized, return it immediately.
  if (app) {
    return app;
  }

  // If running in an environment where `getApps` has an instance, use it.
  // This handles Next.js hot-reloading.
  if (getApps().length > 0) {
    app = getApp();
    return app;
  }

  // If no app is initialized, proceed with a new initialization.
  try {
    console.log("Attempting to initialize Firebase Admin SDK...");

    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    
    if (!serviceAccountString) {
      // This is a critical configuration error.
      throw new Error("SERVICE_ACCOUNT environment variable is not set. Firebase Admin initialization failed because credentials were not found.");
    }

    // Parse the service account JSON string.
    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    // Initialize the app with the parsed credentials.
    app = initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin SDK initialized successfully.");
    return app;

  } catch (error: any) {
    // Log detailed error information for debugging in the server environment.
    console.error("CRITICAL: Firebase Admin SDK initialization failed.", {
      errorMessage: error.message,
      errorStack: error.stack,
      hasServiceAccountEnv: !!process.env.SERVICE_ACCOUNT,
      serviceAccountEnvLength: process.env.SERVICE_ACCOUNT?.length || 0,
    });
    
    // Throw a new error to ensure that any function calling this will fail
    // clearly, instead of proceeding with an uninitialized SDK.
    throw new Error("Could not initialize Firebase Admin SDK. Check server logs for detailed error information.");
  }
}

/**
 * Gets the Firebase Admin Auth service.
 * Lazily initializes the app if it hasn't been already.
 */
export function getFirebaseAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

/**
 * Gets the Firebase Admin Firestore service.
 * Lazily initializes the app if it hasn't been already.
 */
export function getFirebaseAdminDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}
'''