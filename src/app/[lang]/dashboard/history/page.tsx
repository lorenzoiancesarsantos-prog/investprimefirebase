
'use client';
import { HistoryClientPage } from "@/components/dashboard/history-client-page";
import { getTransactionsAction } from "@/app/actions/user";
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/types";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getFirebaseAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const fetchedTransactions = await getTransactionsAction(user.uid);
        setTransactions(fetchedTransactions);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
      return <div>Carregando histórico...</div>
  }

  return <HistoryClientPage initialTransactions={transactions} />;
}
