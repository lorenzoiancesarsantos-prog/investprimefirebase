
import * as admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // Quando implantado em um ambiente do Google Cloud como o App Hosting, GCLOUD_PROJECT é definido automaticamente.
  // Este é o sinal para usar as Credenciais Padrão da Aplicação.
  if (process.env.GCLOUD_PROJECT) {
    console.log("Ambiente Google Cloud detectado. Inicializando Firebase Admin com Credenciais Padrão da Aplicação.");
    return initializeApp();
  }

  // A lógica a seguir é para desenvolvimento local, onde você usaria um arquivo JSON de conta de serviço.
  const serviceAccount = process.env.SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error("A variável de ambiente SERVICE_ACCOUNT não está definida. Isso é necessário para o desenvolvimento local.");
  }

  try {
    console.log("Ambiente de desenvolvimento local detectado. Inicializando Firebase Admin com JSON da conta de serviço.");
    const serviceAccountJson = JSON.parse(serviceAccount);
    return initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    });
  } catch (e) {
    console.error("Falha ao analisar a variável de ambiente SERVICE_ACCOUNT. Certifique-se de que é uma string JSON válida.", e);
    throw new Error("Não foi possível inicializar o SDK Admin do Firebase para desenvolvimento local. A variável SERVICE_ACCOUNT está malformada.");
  }
}

// Inicializa o app uma vez quando o módulo é carregado.
const app = getFirebaseAdminApp();

export function getFirebaseAdminAuth(): AdminAuth {
  return getAdminAuth(app);
}

export function getFirebaseAdminDb(): AdminFirestore {
  return getAdminFirestore(app);
}
