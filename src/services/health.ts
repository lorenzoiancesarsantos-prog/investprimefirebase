
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase";

/**
 * Tests the Firestore connection by writing, reading, and then deleting a document.
 * This function is intended for a system health check page in an admin dashboard.
 * 
 * It uses a dedicated collection `_health_checks` for this purpose.
 * 
 * @returns {Promise<{
 *   write: { success: boolean; message: string; },
 *   read: { success: boolean; message: string; }
 * }>} An object containing the success status and message for both write and read operations.
 */
export async function testFirestoreConnection() {
  const db = getFirebaseDb();
  const testDocId = `test_${Date.now()}`;
  const testDocRef = doc(db, "_health_checks", testDocId);

  const result = {
    write: { success: false, message: "Falha ao iniciar o teste de escrita." },
    read: { success: false, message: "Teste de leitura não executado." },
  };

  try {
    // 1. Test Write
    await setDoc(testDocRef, {
      status: "testing",
      timestamp: serverTimestamp(),
    });
    result.write.success = true;
    result.write.message = "Documento de teste escrito com sucesso no Firestore.";

    try {
      // 2. Test Read
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists() && docSnap.data().status === "testing") {
        result.read.success = true;
        result.read.message = "Documento de teste lido com sucesso do Firestore.";
      } else {
        throw new Error("O documento lido não corresponde ao documento escrito.");
      }
    } catch (readError: any) {
      result.read.success = false;
      result.read.message = `Falha no teste de leitura: ${readError.message}`;
      console.error("Health Check - Read Error:", readError);
    }

  } catch (writeError: any) {
    result.write.success = false;
    let errorMessage = writeError.message;
    if (writeError.code === 'permission-denied') {
        errorMessage = "Permissão negada. Verifique as regras de segurança do Firestore.";
    }
    result.write.message = `Falha no teste de escrita: ${errorMessage}`;
    console.error("Health Check - Write Error:", writeError);
  } finally {
    // 3. Cleanup: Delete the test document regardless of success or failure.
    deleteDoc(testDocRef).catch(cleanupError => {
        console.error("Health Check - Cleanup Error:", cleanupError);
    });
  }

  return result;
}
