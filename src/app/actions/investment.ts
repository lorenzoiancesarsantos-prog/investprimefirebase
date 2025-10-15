
"use server";

import { z } from "zod";
import { getPortfolio, updatePortfolio, addTransaction } from "@/services/users";
import { revalidatePath } from "next/cache";

// AI Suggestion related form state and action are removed as Genkit is being removed.

const buyRoyaltiesSchema = z.object({
  quantity: z.coerce.number().min(1, "A quantidade deve ser de pelo menos 1."),
  totalCost: z.coerce.number().min(100, "O custo total é inválido."),
  lang: z.string(),
  userId: z.string().min(1, "ID de usuário inválido"),
});

export async function buyRoyaltiesAction(formData: FormData) {
  // This is a placeholder for a secure server-side session check.
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
    
    // In a real app, you would process payment here. We simulate success.

    await addTransaction(userId, {
      quantity: quantity,
      amount: totalCost,
      type: 'purchase',
    });

    await updatePortfolio(userId, {
      royalties: quantity, // Incremental
      totalInvested: totalCost, // Incremental
      availableBalance: -totalCost, // Decremental
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
        const currentPortfolio = await getPortfolio(userId);
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
