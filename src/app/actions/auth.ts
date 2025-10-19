"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { getFirebaseAdminDb, getFirebaseAdminAuth } from "@/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import type { User, Portfolio } from '@/lib/types';

// --- SCHEMAS ---

const signupSchema = z.object({
  fullName: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim(),
  email: z.string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(128, "Senha muito longa"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// --- HELPER FUNCTIONS ---

async function createUserProfileAndPortfolio(uid: string, userData: { name: string; email: string }) {
  const db = getFirebaseAdminDb();
  
  try {
    console.log(`Iniciando criação de perfil e portfolio para: ${uid}`);
    
    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);
    const newUser: Omit<User, 'id'> = {
      name: userData.name,
      email: userData.email,
      phone: "",
      registrationDate: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp(),
      invested: 0,
      accountType: "Standard" as const,
      status: "active" as const,
      referralCode: `REF${uid.substring(0, 8).toUpperCase()}`,
      role: "user" as const,
      emailVerified: false,
    };
    
    batch.set(userRef, newUser);
    console.log(`Perfil de usuário configurado para: ${uid}`);

    const portfolioRef = db.collection("portfolios").doc(uid);
    const newPortfolio: Portfolio = {
      userId: uid,
      totalValue: 0,
      previousTotalValue: 0,
      totalInvested: 0,
      lifetimePnl: 0,
      monthlyGains: 0,
      royalties: 0,
      availableBalance: 0,
      assets: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    batch.set(portfolioRef, newPortfolio);
    console.log(`Portfolio configurado para: ${uid}`);

    await batch.commit();
    console.log(`Batch commit realizado com sucesso para: ${uid}`);
    
    return { success: true };
    
  } catch (error) {
    console.error("Erro detalhado na criação do perfil e portfolio:", {
      uid,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error("Falha na criação do perfil do usuário");
  }
}

// --- SERVER ACTIONS ---

export async function signupAction(values: unknown) {
  console.log("Iniciando ação de cadastro...");
  
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    console.log("Erro de validação:", parsed.error);
    const formattedErrors = parsed.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return { 
      validationErrors: formattedErrors,
      error: "Dados de cadastro inválidos. Verifique os campos." 
    };
  }

  const { email, password, fullName } = parsed.data;
  
  try {
    console.log(`Tentando criar usuário: ${email}`);
    const auth = getFirebaseAdminAuth();

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false,
    });

    const uid = userRecord.uid;
    console.log(`Usuário criado no Auth: ${uid}`);

    try {
      await createUserProfileAndPortfolio(uid, {
        name: fullName,
        email: email,
      });
      
      console.log(`Cadastro concluído com sucesso para: ${uid}`);
      return { 
        success: true, 
        userId: uid,
        message: "Cadastro realizado com sucesso!" 
      };

    } catch (firestoreError: any) {
      console.error("Erro no Firestore, realizando rollback...", firestoreError);
      await auth.deleteUser(uid);
      console.log(`Usuário ${uid} deletado do Auth (rollback)`);
      
      return { 
        error: "Erro ao criar perfil do usuário. Tente novamente." 
      };
    }
    
  } catch (error: any) {
    console.error("Erro no processo de cadastro:", {
      email,
      errorCode: error.code,
      errorMessage: error.message,
    });
    
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-exists':
          return { error: "Este e-mail já está em uso." };
        case 'auth/weak-password':
          return { error: "A senha é muito fraca. Use pelo menos 6 caracteres." };
        default:
          return { error: "Erro de autenticação. Tente novamente." };
      }
    }
    
    return { 
      error: "Erro interno do servidor. Tente novamente." 
    };
  }
}

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Dados de login inválidos." };
  }

  const { email, password } = parsed.data;

  // Note: Firebase client-side SDK handles actual sign-in.
  // This server action is for creating a session cookie after the client confirms authentication.
  // We expect an ID token to be passed from the client.
  
  // For this action, let'''s assume the client will send the ID token.
  // We'''ll adjust the schema to expect an idToken.

  const tokenSchema = z.object({ idToken: z.string() });
  const tokenParsed = tokenSchema.safeParse(values);

  if (!tokenParsed.success) {
      return { error: "ID Token não fornecido." };
  }
  
  const { idToken } = tokenParsed.data;
  const auth = getFirebaseAdminAuth();

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      maxAge: expiresIn,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };

  } catch (error: any) {
    console.error("Erro ao criar cookie de sessão:", error);
    return { error: "Falha ao autenticar. Tente novamente." };
  }
}

export async function logoutAction() {
    cookies().delete("session");
    return { success: true };
}
