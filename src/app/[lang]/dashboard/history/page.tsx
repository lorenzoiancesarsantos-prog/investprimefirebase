
import { getTransactionsAction } from "@/app/actions/user";
import { HistoryClientPage } from "@/components/dashboard/history-client-page";
import { getFirebaseAdminAuth } from "@/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

async function getAuthenticatedUser() {
  try {
    const token = (await cookies()).get("__session")?.value;
    if (!token) return null;
    return await getFirebaseAdminAuth().verifySessionCookie(token, true);
  } catch (error) {
    return null;
  }
}

export default async function HistoryPage({ params }: { params: { lang: string } }) {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    redirect(`/${params.lang}/login`);
  }

  const transactions = await getTransactionsAction(authenticatedUser.uid);

  return <HistoryClientPage initialTransactions={transactions} />;
}
