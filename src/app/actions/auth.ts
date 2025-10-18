"use server";

import { z } from "zod";
import { getFirebaseAdminDb, getFirebaseAdminAuth } from "@/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { User, Portfolio } from '@/lib/types';

// --- LOGIN ACTION ---

const loginSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Token de autenticação inválido." };
  }
  
  const { idToken } = parsed.data;
  const auth = getFirebaseAdminAuth();

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar o cookie de sessão:", {
      errorMessage: error.message,
      errorCode: error.code,
      timestamp: new Date().toISOString()
    });
    return { error: "Falha ao iniciar a sessão. Tente novamente." };
  }
}


// --- SIGNUP ACTION (com as suas melhorias) ---

// Limitação de taxa simples
const signupAttempts = new Map<string, { count: number; lastAttempt: number }>();

function checkRateLimit(identifier: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxAttempts = 5;
  
  const userAttempts = signupAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
  
  if (now - userAttempts.lastAttempt > windowMs) {
    userAttempts.count = 0;
  }
  
  if (userAttempts.count >= maxAttempts) {
    throw new Error("Muitas tentativas de cadastro. Tente novamente em 15 minutos.");
  }
  
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  signupAttempts.set(identifier, userAttempts);
}

function sanitizeInput(data: { fullName: string; email: string; password: string }) {
  return {
    fullName: data.fullName.trim().replace(/\s+/g, ' '),
    email: data.email.toLowerCase().trim(),
    password: data.password.trim()
  };
}

const signupSchema = z.object({
  fullName: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  email: z.string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "A senha deve conter letras maiúsculas, minúsculas e números"),
});

async function createUserProfileAndPortfolio(uid: string, userData: { name: string; email: string }) {
  const db = getFirebaseAdminDb();
  
  try {
    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);
    const newUser = {
      name: userData.name,
      email: userData.email,
      phone: "",
      registrationDate: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp(),
      invested: 0,
      accountType: "Standard" as const,
      status: "active" as const,
      referralCode: `REF${uid.substring(0, 5).toUpperCase()}`,
      role: "user" as const,
    };
    batch.set(userRef, newUser);

    const portfolioRef = db.collection("portfolios").doc(uid);
    const newPortfolio: Portfolio = {
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
    console.log(`Perfil de usuário e portfolio criados para: ${uid}`);
    
  } catch (error) {
    console.error("Falha ao criar perfil de usuário e portfolio:", error);
    throw new Error("USER_PROFILE_CREATION_FAILED");
  }
}

export async function signupAction(values: unknown) {
  // Simulação de IP do cliente (implemente conforme sua necessidade)
  const clientIP = "client-identifier"; 
  
  try {
    checkRateLimit(clientIP);
  } catch (rateLimitError: any) {
    return { error: rateLimitError.message };
  }

  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return { 
      validationErrors: formattedErrors,
      error: "Dados de cadastro inválidos. Verifique os campos." 
    };
  }

  const sanitizedData = sanitizeInput(parsed.data);
  const { email, password, fullName } = sanitizedData;
  
  try {
    const auth = getFirebaseAdminAuth();

    // Verificar se email já existe
    try {
      await auth.getUserByEmail(email);
      return { error: "Este e-mail já está em uso." };
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
      emailVerified: false, // Requerer verificação de email
    });

    const uid = userRecord.uid;

    try {
      await createUserProfileAndPortfolio(uid, {
        name: fullName,
        email: email,
      });
    } catch (firestoreError: any) {
      await auth.deleteUser(uid);
      console.error("Erro no Firestore durante o cadastro. Usuário do Auth deletado (rollback):", firestoreError);
      return { error: "Ocorreu um erro ao finalizar seu perfil. Por favor, tente novamente." };
    }
    
    return { success: true, userId: uid };

  } catch (error: any) {
    console.error("Erro detalhado no cadastro:", {
      email,
      errorCode: error.code,
      errorMessage: error.message,
      timestamp: new Date().toISOString()
    });
    
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-exists':
          return { error: "Este e-mail já está em uso." };
        case 'auth/weak-password':
          return { error: "A senha é muito fraca. Use pelo menos 8 caracteres com letras maiúsculas, minúsculas e números." };
        case 'auth/invalid-email':
          return { error: "O e-mail fornecido é inválido." };
        default:
          return { error: "Ocorreu um erro de autenticação. Tente novamente." };
      }
    }
    
    return { error: "Ocorreu um erro inesperado durante o cadastro. Tente novamente." };
  }
}
