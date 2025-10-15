
import { collection, getDocs, addDoc, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where, limit, writeBatch, serverTimestamp, increment, orderBy, Timestamp, DocumentData, FirestoreDataConverter } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase";
import type { User, Portfolio, Transaction } from "@/lib/types";

export async function getUsers(): Promise<User[]> {
  const db = getFirebaseDb();
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, orderBy("registrationDate", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUser(userId: string): Promise<User | null> {
  if (!userId) {
    console.warn("getUser called with no userId");
    return null;
  }
  const db = getFirebaseDb();
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  } else {
    console.warn(`User with ID ${userId} not found in Firestore.`);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = getFirebaseDb();
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function checkUserRole(userId: string): Promise<'admin' | 'user'> {
  const user = await getUser(userId);
  return user?.role || 'user';
}


export async function getPortfolio(userId: string): Promise<Portfolio | null> {
    if (!userId) {
      console.warn("getPortfolio called with no userId");
      return null;
    }
    const db = getFirebaseDb();
    const portfolioDocRef = doc(db, "portfolios", userId);
    const docSnap = await getDoc(portfolioDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as Portfolio;
    } 
    console.warn(`Portfolio for user ID ${userId} not found in Firestore.`);
    return null;
}

export async function addUser(user: Omit<User, 'id' | 'registrationDate'>): Promise<string> {
    const db = getFirebaseDb();
    const docRef = await addDoc(collection(db, "users"), {
        ...user,
        registrationDate: serverTimestamp()
    });
    return docRef.id;
}

export async function updateUser(user: User) {
    if (!user.id) throw new Error("User ID is required for update");
    const db = getFirebaseDb();
    const userDocRef = doc(db, "users", user.id);
    
    const dataToUpdate: Partial<User> = { ...user };
    delete dataToUpdate.id;

    await setDoc(userDocRef, dataToUpdate, { merge: true });
}

export async function deleteUser(userId: string) {
    const db = getFirebaseDb();
    const batch = writeBatch(db);
    
    const userDocRef = doc(db, "users", userId);
    batch.delete(userDocRef);

    const portfolioDocRef = doc(db, "portfolios", userId);
    batch.delete(portfolioDocRef);
    
    await batch.commit();
}

const transactionConverter: FirestoreDataConverter<Transaction> = {
  toFirestore(transaction: Transaction): DocumentData {
    // A data é convertida de volta para Timestamp ao salvar, se necessário.
    // Para esta app, estamos apenas lendo, então não é crucial.
    return { 
      amount: transaction.amount,
      quantity: transaction.quantity,
      type: transaction.type,
      date: Timestamp.fromDate(new Date(transaction.date)),
     };
  },
  fromFirestore(snapshot, options): Transaction {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      amount: data.amount,
      quantity: data.quantity,
      type: data.type,
      date: (data.date as Timestamp).toDate().toISOString(),
    };
  },
};


export async function getTransactions(userId: string): Promise<Transaction[]> {
  const db = getFirebaseDb();
  const transactionsCollection = collection(db, `users/${userId}/transactions`).withConverter(transactionConverter);
  const q = query(transactionsCollection, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

export async function addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'date'>) {
    const db = getFirebaseDb();
    const transactionsCollection = collection(db, `users/${userId}/transactions`);
    await addDoc(transactionsCollection, {
        ...transaction,
        date: serverTimestamp(),
    });
}

/**
 * Updates a user's portfolio using Firestore's atomic increment operation.
 * This is crucial for data integrity, especially with concurrent operations.
 * @param userId The ID of the user whose portfolio is to be updated.
 * @param updates An object with fields to increment/decrement. Use negative numbers for decrementing.
 */
export async function updatePortfolio(userId: string, updates: Partial<Portfolio>) {
    const db = getFirebaseDb();
    const portfolioDocRef = doc(db, "portfolios", userId);
    
    const updateData: { [key: string]: any } = {};
    if (updates.royalties !== undefined) {
        updateData.royalties = increment(updates.royalties);
    }
    if (updates.totalInvested !== undefined) {
        updateData.totalInvested = increment(updates.totalInvested);
    }
    if (updates.availableBalance !== undefined) {
        updateData.availableBalance = increment(updates.availableBalance);
    }
    if (updates.monthlyGains !== undefined) {
        updateData.monthlyGains = increment(updates.monthlyGains);
    }

    if (Object.keys(updateData).length > 0) {
        await setDoc(portfolioDocRef, updateData, { merge: true });
    }
}

/**
 * Creates the user profile and portfolio documents in Firestore.
 * This is called from the signup server action.
 * @param uid The user's ID from Firebase Auth.
 * @param userData The basic user data (name, email).
 */
export async function createUserProfileAndPortfolio(uid: string, userData: { name: string, email: string }) {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  const userRef = doc(db, "users", uid);
  const newUser: Omit<User, 'id'> = {
    name: userData.name,
    email: userData.email,
    phone: "",
    registrationDate: serverTimestamp(),
    invested: 0,
    accountType: "Standard",
    status: "active",
    referralCode: `REF${uid.substring(0, 5).toUpperCase()}`,
    role: "user",
  };
  batch.set(userRef, newUser);

  const portfolioRef = doc(db, "portfolios", uid);
  const newPortfolio: Portfolio = {
    totalInvested: 0,
    monthlyGains: 0,
    royalties: 0,
    availableBalance: 0,
  };
  batch.set(portfolioRef, newPortfolio);

  await batch.commit();
}
