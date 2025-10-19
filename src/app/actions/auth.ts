'''"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';

// --- Esquemas de Validação ---

const signupSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  idToken: z.string().min(1, "ID Token é obrigatório"),
});

// --- Ações do Servidor ---

export async function loginAction(values: unknown) {
  console.log("Iniciando ação de login no servidor...");
  
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { 
      error: "Dados de login inválidos. ID Token em falta.",
      success: false 
    };
  }

  const { idToken } = parsed.data;
  
  try {
    const auth = getFirebaseAdminAuth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em milissegundos

    const decodedToken = await auth.verifyIdToken(idToken);
    console.log("ID Token verificado para usuário:", decodedToken.uid);

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = cookies();
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
    });
    
    console.log("Cookie de sessão criado com sucesso.");
    return { 
      success: true,
      userId: decodedToken.uid 
    };

  } catch (error: any) {
    console.error("Erro ao criar cookie de sessão:", error);
    
    if (error.code === 'auth/id-token-expired') {
      return { 
        error: "Sessão expirada. Faça login novamente.",
        success: false 
      };
    }
    
    return { 
      error: "Falha na autenticação no servidor. Tente novamente.",
      success: false 
    };
  }
}

export async function logoutAction() {
  try {
    console.log("Iniciando ação de logout...");
    const cookieStore = cookies();
    cookieStore.delete('session');
    console.log("Logout realizado com sucesso");
    return { success: true };
  } catch (error: any) {
    console.error("Erro no logout:", error);
    return { error: "Erro ao fazer logout.", success: false };
  }
}

export async function signupAction(values: unknown) {
  console.log("Iniciando ação de cadastro no servidor...");
  
  let uid: string | null = null;
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados de cadastro inválidos.", validationErrors: parsed.error.issues, success: false };
  }

  const { email, password, fullName } = parsed.data;
  
  try {
    const auth = getFirebaseAdminAuth();
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    });
    uid = userRecord.uid;
    console.log(`Usuário criado no Auth com UID: ${uid}`);

    const db = getFirebaseAdminDb();
    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);
    batch.set(userRef, {
      name: fullName, email: email, phone: "", registrationDate: FieldValue.serverTimestamp(), invested: 0,
      accountType: "Standard", status: "active", referralCode: `REF${uid.substring(0, 5).toUpperCase()}`, role: "user", uid: uid,
    });

    const portfolioRef = db.collection("portfolios").doc(uid);
    batch.set(portfolioRef, {
      totalValue: 0, previousTotalValue: 0, totalInvested: 0, lifetimePnl: 0, monthlyGains: 0, royalties: 0,
      availableBalance: 0, assets: [], createdAt: FieldValue.serverTimestamp(), userId: uid,
    });

    await batch.commit();
    console.log(`Perfil e portfólio criados para: ${uid}`);

    return { success: true, userId: uid };

  } catch (error: any) {
    console.error("Erro detalhado no processo de cadastro:", error);
    
    if (uid) { // Se o UID existe, a criação do usuário funcionou, então devemos fazer rollback
      try {
        await getFirebaseAdminAuth().deleteUser(uid);
        console.log(`Rollback: Usuário ${uid} deletado do Auth devido a falha no Firestore.`);
      } catch (deleteError) {
        console.error("Erro crítico: Falha ao deletar usuário durante rollback:", deleteError);
      }
    }
    
    if (error.code === 'auth/email-already-exists') {
      return { error: "Este e-mail já está em uso.", success: false };
    }
    
    return { error: "Ocorreu um erro inesperado durante o cadastro.", success: false };
  }
}

export async function verifySessionAction() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return { isAuthenticated: false, user: null };
    
    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    
    return {
      isAuthenticated: true,
      user: { uid: decodedToken.uid, email: decodedToken.email, name: decodedToken.name },
    };
    
  } catch (error) {
    const cookieStore = cookies();
    cookieStore.delete('session');
    return { isAuthenticated: false, user: null };
  }
}
'''