
"use server";

import { z } from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createUserProfileAndPortfolio } from "@/services/users";
import { getFirebaseAuth } from "@/firebase";
import { FirebaseError } from "firebase/app";

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
  const auth = getFirebaseAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: fullName });

    try {
      await createUserProfileAndPortfolio(user.uid, {
          name: fullName,
          email: email,
      });
    } catch (firestoreError: any) {
        // This is a critical failure. If we can't create the user profile,
        // we should delete the auth user to avoid an inconsistent state.
        // This is a simple rollback mechanism.
        if (auth.currentUser?.uid === user.uid) {
            await user.delete();
        }
        console.error("Erro no Firestore durante o cadastro. Usuário do Auth deletado (rollback):", firestoreError);
        return { error: "Ocorreu um erro ao finalizar seu perfil. Por favor, tente novamente." };
    }
    
    return { success: true, userId: user.uid };

  } catch (error: any) {
    console.error("Erro no cadastro (signupAction):", error.code, error.message);
    
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return { error: "Este e-mail já está em uso." };
            case 'auth/weak-password':
                return { error: "A senha é muito fraca. Use pelo menos 6 caracteres." };
            case 'auth/invalid-email':
                return { error: "O e-mail fornecido é inválido." };
            case 'auth/operation-not-allowed':
            case 'auth/requests-from-referer-<empty>-are-blocked':
            case 'auth/configuration-not-found':
                 return { error: 'Ocorreu um erro de configuração no servidor. Por favor, tente novamente mais tarde.' };
            default:
                return { error: "Ocorreu um erro de autenticação. Tente novamente." };
        }
    }
    
    // Generic error for unexpected issues
    return { error: "Ocorreu um erro inesperado durante o cadastro. Tente novamente." };
  }
}
