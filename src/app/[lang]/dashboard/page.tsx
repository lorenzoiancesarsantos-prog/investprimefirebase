
import { getUserAction, getPortfolioAction } from "@/app/actions/user";
import { getFirebaseAuth } from "@/firebase";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth } from "@/firebase-admin";
import DashboardClientPage from "@/components/dashboard/dashboard-client-page";

async function getAuthenticatedUser() {
  try {
    const token = cookies().get("__session")?.value;
    if (!token) return null;
    return await getFirebaseAdminAuth().verifySessionCookie(token, true);
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    return <div>Você não está autenticado.</div>;
  }

  const [user, portfolio] = await Promise.all([
    getUserAction(authenticatedUser.uid),
    getPortfolioAction(authenticatedUser.uid)
  ]);

  if (!user || !portfolio) {
    return <div>Não foi possível carregar os dados do dashboard.</div>;
  }

  return <DashboardClientPage user={user} portfolio={portfolio} />;
}
