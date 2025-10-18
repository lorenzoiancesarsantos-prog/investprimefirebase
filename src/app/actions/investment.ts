
"use server";

import { z } from "zod";
import { getFirebaseAdminDb } from "@/firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from "next/cache";
import { getPortfolioAction } from "./user";
import type { Portfolio, Transaction } from "@/lib/types";

const buyRoyaltiesSchema = z.object({
  quantity: z.coerce.number().min(1, "A quantidade deve ser de pelo menos 1."),
  totalCost: z.coerce.number().min(100, "O custo total é inválido."),
  lang: z.string(),
  userId: z.string().min(1, "ID de usuário inválido"),
});

async function addTransaction(userId: string, transactionData: Omit<Transaction, 'id' | 'date'>) {
    const db = getFirebaseAdminDb();
    // Get a standard collection reference without the converter for write operations
    const transactionsCollection = db.collection(`users/${userId}/transactions`);

    // Manually construct the data object and set the server timestamp
    await transactionsCollection.add({
        ...transactionData,
        date: FieldValue.serverTimestamp(),
    });
}

type PortfolioUpdate = {
    [K in keyof Portfolio]?: number;
};

async function updatePortfolio(userId: string, updates: PortfolioUpdate) {
    const db = getFirebaseAdminDb();
    const portfolioDocRef = db.collection("portfolios").doc(userId);
    
    const updateData: { [key: string]: FieldValue } = {};

    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            const typedKey = key as keyof PortfolioUpdate;
            const value = updates[typedKey];
            if (typeof value === 'number') {
                updateData[typedKey] = FieldValue.increment(value);
            }
        }
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
