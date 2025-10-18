
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK, reusing the existing app if one exists.
 * This function relies on Application Default Credentials for authentication,
 * which works automatically in Google Cloud environments (like App Hosting)
 * and can be configured locally using the gcloud CLI.
 * 
 * @returns The initialized Firebase App instance.
 */
function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  
  // initializeApp() with no arguments uses Application Default Credentials.
  // This is the standard and recommended way for Google Cloud environments.
  return initializeApp();
}

// Initialize the app once when the module is loaded.
const app = getFirebaseAdminApp();

export function getFirebaseAdminAuth(): AdminAuth {
  return getAdminAuth(app);
}

export function getFirebaseAdminDb(): AdminFirestore {
  return getAdminFirestore(app);
}
