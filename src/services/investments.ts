
import { collection, getDocs, setDoc, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase";
import { Investment } from "@/lib/types";

export async function getInvestments(): Promise<Investment[]> {
    const db = getFirebaseDb();
    const investmentsCollection = collection(db, "investments");
    const querySnapshot = await getDocs(investmentsCollection);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment));
}

export async function getInvestmentById(investmentId: string): Promise<Investment | null> {
    if (!investmentId) {
        console.warn("getInvestmentById called with no investmentId");
        return null;
    }
    const db = getFirebaseDb();
    const investmentDocRef = doc(db, "investments", investmentId);
    const docSnap = await getDoc(investmentDocRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Investment;
    } else {
        console.warn(`Investment with ID ${investmentId} not found in Firestore.`);
        return null;
    }
}

export async function addInvestment(investment: Omit<Investment, 'id'>): Promise<string> {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "investments"), investment);
    return docRef.id;
}

export async function updateInvestment(investment: Investment) {
    if (!investment.id) throw new Error("Investment ID is required for update");
    const db = getFirebaseDb();
    const investmentDocRef = doc(db, "investments", investment.id);
    
    const dataToUpdate: Partial<Investment> = { ...investment };
    delete dataToUpdate.id;

    await setDoc(investmentDocRef, dataToUpdate, { merge: true });
}

export async function deleteInvestment(investmentId: string) {
    const db = getFirebaseDb();
    const investmentDocRef = doc(db, "investments", investmentId);
    await deleteDoc(investmentDocRef);
}
