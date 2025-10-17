
import { collection, getDocs, setDoc, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase";
import type { Campaign } from "@/lib/types";

// Helper para converter dados do Firestore
const campaignFromFirestore = (docSnap: any): Campaign => {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        name: data.name,
        description: data.description,
        startDate: (data.startDate as Timestamp)?.toDate().toLocaleDateString('pt-BR') || '',
        endDate: (data.endDate as Timestamp)?.toDate().toLocaleDateString('pt-BR') || '',
        targetAudience: data.targetAudience,
        status: data.status,
        conversion: data.conversion || '0%',
    };
};

export async function getCampaigns(): Promise<Campaign[]> {
    const db = getFirebaseDb();
    const campaignsCollection = collection(db, "campaigns");
    const querySnapshot = await getDocs(campaignsCollection);

    return querySnapshot.docs.map(campaignFromFirestore);
}

export async function getCampaignById(campaignId: string): Promise<Campaign | null> {
    if (!campaignId) {
        console.warn("getCampaignById called with no campaignId");
        return null;
    }
    const db = getFirebaseDb();
    const campaignDocRef = doc(db, "campaigns", campaignId);
    const docSnap = await getDoc(campaignDocRef);

    if (docSnap.exists()) {
        return campaignFromFirestore(docSnap);
    } else {
        console.warn(`Campaign with ID ${campaignId} not found in Firestore.`);
        return null;
    }
}

export async function addCampaign(campaign: Omit<Campaign, 'id' | 'startDate' | 'endDate' | 'conversion'>): Promise<string> {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "campaigns"), {
        ...campaign,
        startDate: serverTimestamp(),
        endDate: serverTimestamp(), // Pode ser ajustado conforme a necessidade
        conversion: '0%',
    });
    return docRef.id;
}

export async function updateCampaign(campaign: Campaign) {
    if (!campaign.id) throw new Error("Campaign ID is required for update");
    const db = getFirebaseDb();
    const campaignDocRef = doc(db, "campaigns", campaign.id);
    
    // Converte as datas de string de volta para um formato que o Firestore entende se necessário
    // Por simplicidade, esta versão apenas atualiza os campos existentes.
    // Uma implementação mais robusta lidaria com a conversão de `string` para `Timestamp`.
    const dataToUpdate: Partial<Campaign> = { ...campaign };
    delete dataToUpdate.id;

    await setDoc(campaignDocRef, dataToUpdate, { merge: true });
}

export async function deleteCampaign(campaignId: string) {
    const db = getFirebaseDb();
    const campaignDocRef = doc(db, "campaigns", campaignId);
    await deleteDoc(campaignDocRef);
}
