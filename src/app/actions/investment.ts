
"use server";

import { z } from "zod";
import { getFirebaseAdminDb } from "@/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from "next/cache";
import { getPortfolioAction } from "./user";


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
