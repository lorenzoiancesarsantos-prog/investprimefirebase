
import { getUserAction, getPortfolioAction, getTransactionsAction } from "@/app/actions/user";
import { getFirebaseAdminAuth } from "@/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import DashboardClientPage from "@/components/dashboard/dashboard-client-page";

async function getAuthenticatedUser() {
  try {
    const token = (await cookies()).get("__session")?.value;
    if (!token) return null;
    return await getFirebaseAdminAuth().verifySessionCookie(token, true);
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export default async function DashboardPage({ params }: { params: { lang: string } }) {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    redirect(`/${params.lang}/login`);
  }

  const [user, portfolio, transactions] = await Promise.all([
    getUserAction(authenticatedUser.uid),
    getPortfolioAction(authenticatedUser.uid),
    getTransactionsAction(authenticatedUser.uid),
  ]);

  if (!user || !portfolio) {
    // This could happen if Firestore data is missing for an authenticated user.
    // It's safer to redirect to login to re-establish the session.
    redirect(`/${params.lang}/login`);
  }

  return <DashboardClientPage user={user} portfolio={portfolio} transactions={transactions} />;
}
