
"use server";

import { z } from "zod";
import { getFirebaseAdminDb } from "@/firebase";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from "next/cache";
import { getInvestmentSuggestion } from "@/ai/flows/ai-investment-suggestions";
import { getPortfolioAction } from "./user";

export type FormState = {
  fieldErrors?: Record<string, string>;
  error?: string;
  suggestedStrategy?: string;
  analysisSummary?: string;
  rationale?: string;
};

const investmentProfileSchema = z.object({
  investmentObjective: z.string().min(10, "O objetivo de investimento deve ter pelo menos 10 caracteres."),
  riskProfile: z.enum(["conservador", "moderado", "agressivo"]),
  availableBalance: z.coerce.number().min(0, "O saldo deve ser um número positivo."),
  monthlyInvestment: z.coerce.number().min(0, "O investimento mensal deve ser um número positivo."),
});

export async function generateSuggestionAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = investmentProfileSchema.safeParse({
    investmentObjective: formData.get("investmentObjective"),
    riskProfile: formData.get("riskProfile"),
    availableBalance: formData.get("availableBalance"),
    monthlyInvestment: formData.get("monthlyInvestment"),
  });

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validatedFields.error.issues) {
      fieldErrors[issue.path[0]] = issue.message;
    }
    return { fieldErrors };
  }

  try {
    const suggestion = await getInvestmentSuggestion(validatedFields.data);
    if (!suggestion) {
      return { error: "Não foi possível gerar uma sugestão. Tente novamente." };
    }
    return {
        suggestedStrategy: suggestion.suggestedStrategy,
        analysisSummary: suggestion.analysisSummary,
        rationale: suggestion.rationale
    };
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return { error: "Ocorreu um erro no servidor ao gerar a sugestão." };
  }
}


const buyRoyaltiesSchema = z.object({
  quantity: z.coerce.number().min(1, "A quantidade deve ser de pelo menos 1."),
  totalCost: z.coerce.number().min(100, "O custo total é inválido."),
  lang: z.string(),
  userId: z.string().min(1, "ID de usuário inválido"),
});


async function addTransaction(userId: string, transaction: Omit<any, 'id' | 'date'>) {
    const db = getFirebaseAdminDb();
    const transactionsCollection = db.collection(`users/${userId}/transactions`);
    await transactionsCollection.add({
        ...transaction,
        date: FieldValue.serverTimestamp(),
    });
}

async function updatePortfolio(userId: string, updates: Partial<any>) {
    const db = getFirebaseAdminDb();
    const portfolioDocRef = db.collection("portfolios").doc(userId);
    
    const updateData: { [key: string]: any } = {};
    if (updates.royalties !== undefined) {
        updateData.royalties = FieldValue.increment(updates.royalties);
    }
    if (updates.totalInvested !== undefined) {
        updateData.totalInvested = FieldValue.increment(updates.totalInvested);
    }
    if (updates.availableBalance !== undefined) {
        updateData.availableBalance = FieldValue.increment(updates.availableBalance);
    }
    if (updates.monthlyGains !== undefined) {
        updateData.monthlyGains = FieldValue.increment(updates.monthlyGains);
    }

    if (Object.keys(updateData).length > 0) {
        await portfolioDocRef.set(updateData, { merge: true });
    }
}

export async function buyRoyaltiesAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  if (!userId) {
      return { error: "Acesso negado. Usuário não autenticado." };
  }

  const parsed = buyRoyaltiesSchema.safeParse({
    quantity: formData.get("quantity"),
    totalCost: formData.get("totalCost"),
    lang: formData.get("lang"),
    userId: userId, 
  });

  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }

  const { quantity, totalCost, lang } = parsed.data;

  try {
    await addTransaction(userId, {
      quantity: quantity,
      amount: totalCost,
      type: 'purchase',
    });

    await updatePortfolio(userId, {
      royalties: quantity, 
      totalInvested: totalCost, 
      availableBalance: -totalCost, 
    });

    revalidatePath(`/${lang}/dashboard`);
    revalidatePath(`/${lang}/dashboard/history`);

    return { success: "Compra de royalties realizada com sucesso!" };

  } catch (error) {
    console.error("Erro ao comprar royalties:", error);
    return { error: "Ocorreu um erro ao processar sua compra. Tente novamente." };
  }
}


const withdrawSchema = z.object({
  amount: z.coerce.number().min(1, "O valor do saque deve ser maior que zero."),
  lang: z.string(),
  userId: z.string().min(1, "ID de usuário inválido"),
});

export async function withdrawAction(formData: FormData) {
    const userId = formData.get("userId") as string;
    if (!userId) {
        return { error: "Acesso negado. Usuário não autenticado." };
    }

    const parsed = withdrawSchema.safeParse({
        amount: formData.get("amount"),
        lang: formData.get("lang"),
        userId: userId,
    });

    if (!parsed.success) {
        return { error: parsed.error.errors.map((e) => e.message).join(", ") };
    }

    const { amount, lang } = parsed.data;

    try {
        const currentPortfolio = await getPortfolioAction(userId);
        if (!currentPortfolio || currentPortfolio.availableBalance < amount) {
            return { error: "Saldo insuficiente para realizar o saque." };
        }

        await addTransaction(userId, {
            quantity: 0, 
            amount: amount,
            type: 'withdrawal',
        });

        await updatePortfolio(userId, {
            availableBalance: -amount,
        });

        revalidatePath(`/${lang}/dashboard`);
        revalidatePath(`/${lang}/dashboard/withdraw`);
        revalidatePath(`/${lang}/dashboard/history`);

        return { success: "Sua solicitação de saque foi processada com sucesso!" };

    } catch (error) {
        console.error("Erro ao processar saque:", error);
        return { error: "Ocorreu um erro ao processar seu saque. Tente novamente." };
    }
}
