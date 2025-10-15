
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';

function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApp();
  }

  const serviceAccount = process.env.SERVICE_ACCOUNT;

  if (!serviceAccount) {
    // This will only work in a Google Cloud environment (like App Hosting)
    // where default credentials are automatically available.
    console.log("Initializing Firebase Admin with Application Default Credentials");
    return initializeApp();
  }

  // This part is for local development if you have a service account JSON.
  // It won't be used in App Hosting deployment.
  try {
    const serviceAccountJson = JSON.parse(serviceAccount);
    console.log("Initializing Firebase Admin with service account JSON");
    return initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });
  } catch (e) {
    console.error("Failed to parse SERVICE_ACCOUNT environment variable.", e);
    throw new Error("Could not initialize Firebase Admin SDK. Service account configuration is invalid.");
  }
}

export { getFirebaseAdminApp };
