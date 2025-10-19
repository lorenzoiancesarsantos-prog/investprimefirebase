import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Cache a nível de módulo para evitar reinicializações
let app: App | undefined;

/**
 * Função robusta e de inicialização preguiçosa para o Firebase Admin SDK.
 * Garante que o SDK é inicializado apenas uma vez e fornece logs detalhados.
 */
function getFirebaseAdminApp(): App {
  if (app) return app; // Retorna a instância em cache se existir
  if (getApps().length > 0) {
    app = getApp(); // Reutiliza a app existente (importante para hot-reloading)
    return app;
  }

  try {
    console.log("A inicializar o Firebase Admin SDK...");

    const serviceAccountString = process.env.SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      throw new Error("Variável de ambiente SERVICE_ACCOUNT não definida. As credenciais do Admin não foram encontradas.");
    }

    const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);

    app = initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin SDK inicializado com sucesso.");
    return app;

  } catch (error: any) {
    console.error("FALHA CRÍTICA: A inicialização do Firebase Admin SDK falhou.", {
      errorMessage: error.message,
      // Não registe o stack no produção, a menos que seja necessário para depuração
    });
    throw new Error("Não foi possível inicializar o Firebase Admin SDK. Verifique os logs do servidor.");
  }
}

// Funções de exportação que garantem a inicialização da app
export function getFirebaseAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}