
'use server';

import { getFirebaseAdminDb, getFirebaseAdminAuth } from '@/firebase-admin';
import type { User, Portfolio, Transaction } from '@/lib/types';
import { FieldValue, Timestamp, FirestoreDataConverter, DocumentData } from 'firebase-admin/firestore';

// Helper to convert Firestore data, ensuring serializable dates
const userFromFirestore = (doc: DocumentData): User => {
    const data = doc.data();
    // Convert Timestamp to a serializable format (ISO string)
    const registrationDate = data.registrationDate instanceof Timestamp 
        ? data.registrationDate.toDate().toISOString() 
        : data.registrationDate;

    return {
        id: doc.id,
        ...
        data,
        registrationDate, // Use the converted date
    } as User;
};

export async function checkUserRoleAction(userId: string): Promise<'admin' | 'user'> {
  const user = await getUserAction(userId);
  return user?.role || 'user';
}

export async function getUsersAction(): Promise<User[]> {
  const db = getFirebaseAdminDb();
  const usersCollection = db.collection('users');
  const q = usersCollection.orderBy('registrationDate', 'desc');
  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => userFromFirestore(doc));
}

export async function addUserAction(user: Omit<User, 'id' | 'registrationDate'>): Promise<string> {
  const db = getFirebaseAdminDb();
  const docRef = await db.collection('users').add({
    ...user,
    registrationDate: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

export async function updateUserAction(user: User): Promise<void> {
  if (!user.id) throw new Error('User ID is required for update');
  const db = getFirebaseAdminDb();
  const userDocRef = db.collection('users').doc(user.id);
  
  const dataToUpdate: Partial<User> = { ...user };
  delete dataToUpdate.id;

  await userDocRef.set(dataToUpdate, { merge: true });
}

export async function deleteUserAction(userId: string): Promise<void> {
  const db = getFirebaseAdminDb();
  const auth = getFirebaseAdminAuth();
  const batch = db.batch();
  
  const userDocRef = db.collection('users').doc(userId);
  batch.delete(userDocRef);

  const portfolioDocRef = db.collection('portfolios').doc(userId);
  batch.delete(portfolioDocRef);
  
  await batch.commit();

  try {
    await auth.deleteUser(userId);
  } catch (error) {
    console.error(`Failed to delete auth user ${userId}:`, error);
  }
}

export async function getUserAction(userId: string): Promise<User | null> {
  if (!userId) {
    console.warn('getUserAction called with no userId');
    return null;
  }
  const db = getFirebaseAdminDb();
  const userDocRef = db.collection('users').doc(userId);
  const docSnap = await userDocRef.get();

  if (docSnap.exists) {
    return userFromFirestore(docSnap);
  } else {
    console.warn(`User with ID ${userId} not found in Firestore.`);
    return null;
  }
}

export async function getPortfolioAction(userId: string): Promise<Portfolio | null> {
    if (!userId) {
        console.warn("getPortfolioAction called with no userId");
        return null;
    }
    const db = getFirebaseAdminDb();
    const portfolioDocRef = db.collection("portfolios").doc(userId);
    const docSnap = await portfolioDocRef.get();

    if (docSnap.exists) {
        return docSnap.data() as Portfolio;
    } else {
        console.warn(`Portfolio for user ID ${userId} not found. Creating a new one.`);
        const newPortfolio: Portfolio = {
            totalValue: 0,
            previousTotalValue: 0,
            totalInvested: 0,
            lifetimePnl: 0,
            monthlyGains: 0,
            royalties: 0,
            availableBalance: 0,
            assets: [],
        };

        try {
            await portfolioDocRef.set(newPortfolio);
            return newPortfolio;
        } catch (error) {
            console.error(`Failed to create a new portfolio for user ${userId}:`, error);
            return null;
        }
    }
}

const transactionConverter: FirestoreDataConverter<Transaction> = {
  toFirestore(transaction: Transaction): DocumentData {
    return { 
      amount: transaction.amount,
      quantity: transaction.quantity,
      type: transaction.type,
      date: Timestamp.fromDate(new Date(transaction.date)),
     };
  },
  fromFirestore(snapshot): Transaction {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      amount: data.amount,
      quantity: data.quantity,
      type: data.type,
      date: (data.date as Timestamp).toDate().toISOString(),
    };
  },
};

export async function getTransactionsAction(userId: string): Promise<Transaction[]> {
  const db = getFirebaseAdminDb();
  const transactionsCollection = db.collection(`users/${userId}/transactions`).withConverter(transactionConverter);
  const q = transactionsCollection.orderBy('date', 'desc');
  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => doc.data());
}
