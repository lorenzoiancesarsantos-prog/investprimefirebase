
"use server";

import { z } from "zod";
import { getFirebaseAdminDb, getFirebaseAdminAuth } from "@/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import type { User, Portfolio } from '@/lib/types';


async function createUserProfileAndPortfolio(uid: string, userData: { name: string, email: string }) {
  const db = getFirebaseAdminDb();
  const batch = db.batch();

  const userRef = db.collection("users").doc(uid);
  const newUser = {
    name: userData.name,
    email: userData.email,
    phone: "",
    registrationDate: FieldValue.serverTimestamp(),
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
  };
  batch.set(portfolioRef, newPortfolio);

  await batch.commit();
}


const signupSchema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function signupAction(values: unknown) {
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

  const { email, password, fullName } = parsed.data;
  
  try {
    const auth = getFirebaseAdminAuth();

    const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
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
    console.error("Erro detalhado no cadastro (signupAction):", JSON.stringify(error, null, 2));
    
    if (error.code) {
        switch (error.code) {
            case 'auth/email-already-exists':
                return { error: "Este e-mail já está em uso." };
            case 'auth/weak-password':
                return { error: "A senha é muito fraca. Use pelo menos 6 caracteres." };
            case 'auth/invalid-email':
                return { error: "O e-mail fornecido é inválido." };
            default:
                return { error: "Ocorreu um erro de autenticação. Tente novamente." };
        }
    }
    
    return { error: "Ocorreu um erro inesperado durante o cadastro. Tente novamente." };
  }
}
