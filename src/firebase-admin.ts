
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // When deployed to a Google Cloud environment like App Hosting, GCLOUD_PROJECT is automatically set.
  // This is the signal to use Application Default Credentials.
  if (process.env.GCLOUD_PROJECT) {
    console.log("Google Cloud environment detected. Initializing Firebase Admin with Application Default Credentials.");
    return initializeApp();
  }

  // The following logic is for local development, where you'd use a service account JSON file.
  const serviceAccount = process.env.SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error("The SERVICE_ACCOUNT environment variable is not set. This is required for local development.");
  }

  try {
    console.log("Local development environment detected. Initializing Firebase Admin with service account JSON.");
    const serviceAccountJson = JSON.parse(serviceAccount);
    return initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });
  } catch (e) {
    console.error("Failed to parse the SERVICE_ACCOUNT environment variable. Make sure it's a valid JSON string.", e);
    throw new Error("Could not initialize Firebase Admin SDK for local development. The SERVICE_ACCOUNT variable is malformed.");
  }
}

// Initialize the app once when the module is loaded.
const app = getFirebaseAdminApp();

export function getFirebaseAdminAuth(): AdminAuth {
  return getAdminAuth(app);
}

export function getFirebaseAdminDb(): AdminFirestore {
  return getAdminFirestore(app);
}
