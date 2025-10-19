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
    return { error: "Dados de login inválidos. ID Token em falta." };
  }

  const { idToken } = parsed.data;
  const auth = getFirebaseAdminAuth();

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em milissegundos

    // Cria o cookie de sessão a partir do ID Token fornecido pelo cliente
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Define o cookie no navegador do usuário
    const cookieStore = cookies();
    await cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000, // maxAge é em segundos
      path: '/',
    });
    
    console.log("Cookie de sessão criado com sucesso.");
    return { success: true };

  } catch (error: any) {
    console.error("Erro ao criar cookie de sessão:", error);
    return { error: "Falha na autenticação no servidor. Tente novamente." };
  }
}

export async function logoutAction() {
  try {
    console.log("Iniciando ação de logout...");
    const cookieStore = cookies();
    cookieStore.delete('session');
    return { success: true };
  } catch (error: any) {
    console.error("Erro no logout:", error);
    return { error: "Erro ao fazer logout." };
  }
}

export async function signupAction(values: unknown) {
  console.log("Iniciando ação de cadastro no servidor...");
  
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados de cadastro inválidos.", validationErrors: parsed.error.issues };
  }

  const { email, password, fullName } = parsed.data;
  
  try {
    const auth = getFirebaseAdminAuth();
    const db = getFirebaseAdminDb();

    // 1. Criar usuário no Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    });
    const uid = userRecord.uid;
    console.log(`Usuário criado no Auth com UID: ${uid}`);

    // 2. Criar perfil e portfólio no Firestore dentro de um batch
    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);
    const newUser = {
      name: fullName,
      email: email,
      phone: "",
      registrationDate: FieldValue.serverTimestamp(),
      invested: 0,
      accountType: "Standard",
      status: "active",
      referralCode: `REF${uid.substring(0, 5).toUpperCase()}`,
      role: "user",
    };
    batch.set(userRef, newUser);

    const portfolioRef = db.collection("portfolios").doc(uid);
    const newPortfolio = {
      totalValue: 0,
      previousTotalValue: 0,
      totalInvested: 0,
      lifetimePnl: 0,
      monthlyGains: 0,
      royalties: 0,
      availableBalance: 0,
      assets: [],
      createdAt: FieldValue.serverTimestamp(),
    };
    batch.set(portfolioRef, newPortfolio);

    await batch.commit();
    console.log(`Perfil e portfólio criados para: ${uid}`);

    // 3. Retornar sucesso. O login automático será tratado no cliente.
    return { success: true, userId: uid };

  } catch (error: any) {
    console.error("Erro detalhado no processo de cadastro:", error);
    
    // Se houver um UID, significa que a criação do usuário no Auth funcionou mas o Firestore falhou.
    // Devemos deletar o usuário do Auth para permitir uma nova tentativa (Rollback).
    if (error.uid) {
      await getFirebaseAdminAuth().deleteUser(error.uid);
      console.log(`Rollback: Usuário ${error.uid} deletado do Auth devido a falha no Firestore.`);
    }

    if (error.code === 'auth/email-already-exists') {
      return { error: "Este e-mail já está em uso." };
    }
    
    return { error: "Ocorreu um erro inesperado durante o cadastro." };
  }
}
'''