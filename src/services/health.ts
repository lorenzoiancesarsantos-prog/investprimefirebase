
'use server';

import { getFirebaseAdminDb } from '@/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Tests the Firestore connection by writing, reading, and then deleting a document
 * using the Firebase Admin SDK.
 *
 * @returns {Promise<any>} An object containing the results of the write and read tests.
 */
export async function testFirestoreConnection() {
  const db = getFirebaseAdminDb();
  const testDocId = `health_check_${Date.now()}`;
  const testDocRef = db.collection('_health_checks').doc(testDocId);

  const result = {
    write: { success: false, message: 'Falha ao iniciar o teste de escrita.' },
    read: { success: false, message: 'Teste de leitura não executado.' },
  };

  try {
    // 1. Test Write
    await testDocRef.set({
      status: 'testing',
      timestamp: FieldValue.serverTimestamp(),
    });
    result.write.success = true;
    result.write.message =
      'Documento de teste escrito com sucesso no Firestore.';

    try {
      // 2. Test Read
      const docSnap = await testDocRef.get();
      if (docSnap.exists && docSnap.data()?.status === 'testing') {
        result.read.success = true;
        result.read.message =
          'Documento de teste lido com sucesso do Firestore.';
      } else {
        throw new Error('O documento lido não corresponde ao documento escrito.');
      }
    } catch (readError: any) {
      result.read.success = false;
      result.read.message = `Falha no teste de leitura: ${readError.message}`;
      console.error('Health Check - Read Error:', readError);
    }
  } catch (writeError: any) {
    result.write.success = false;
    let errorMessage = writeError.message;
    if (writeError.code === 'permission-denied') {
      errorMessage = 'Permissão negada. Verifique as regras de segurança do Firestore.';
    }
    result.write.message = `Falha no teste de escrita: ${errorMessage}`;
    console.error('Health Check - Write Error:', writeError);
  } finally {
    // 3. Cleanup: Delete the test document regardless of success or failure.
    await testDocRef.delete().catch((cleanupError) => {
      console.error('Health Check - Cleanup Error:', cleanupError);
    });
  }

  return result;
}
