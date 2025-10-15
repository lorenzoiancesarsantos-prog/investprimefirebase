
import { collection, getDocs, setDoc, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase";
import { Campaign } from "@/lib/types";

export async function getCampaigns(): Promise<Campaign[]> {
    const db = getFirebaseDb();
    const campaignsCollection = collection(db, "campaigns");
    const querySnapshot = await getDocs(campaignsCollection);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
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
        return { id: docSnap.id, ...docSnap.data() } as Campaign;
    } else {
        console.warn(`Campaign with ID ${campaignId} not found in Firestore.`);
        return null;
    }
}

export async function addCampaign(campaign: Omit<Campaign, 'id' | 'startDate' | 'endDate'>): Promise<string> {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "campaigns"), {
        ...campaign,
        startDate: serverTimestamp(),
        endDate: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateCampaign(campaign: Campaign) {
    if (!campaign.id) throw new Error("Campaign ID is required for update");
    const db = getFirebaseDb();
    const campaignDocRef = doc(db, "campaigns", campaign.id);
    
    const dataToUpdate: Partial<Campaign> = { ...campaign };
    delete dataToUpdate.id;

    await setDoc(campaignDocRef, dataToUpdate, { merge: true });
}

export async function deleteCampaign(campaignId: string) {
    const db = getFirebaseDb();
    const campaignDocRef = doc(db, "campaigns", campaignId);
    await deleteDoc(campaignDocRef);
}
