import type { Transaction } from '@/lib/types';
import { Timestamp, FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const transactionConverter: FirestoreDataConverter<Transaction> = {
    toFirestore(transaction: Transaction): DocumentData {
        const { id, ...data } = transaction as any;
        return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Transaction {
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
