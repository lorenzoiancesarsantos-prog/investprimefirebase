
"use server";

import { 
    checkUserRole as checkUserRoleServer, 
    getUsers as getUsersServer,
    addUser as addUserServer,
    updateUser as updateUserServer,
    deleteUser as deleteUserServer,
    getUser as getUserServer,
    getPortfolio as getPortfolioServer,
    getTransactions as getTransactionsServer
} from "@/services/users";
import { User, Portfolio, Transaction } from "@/lib/types";

export async function checkUserRoleAction(userId: string): Promise<'admin' | 'user'> {
  return await checkUserRoleServer(userId);
}

export async function getUsersAction(): Promise<User[]> {
    return await getUsersServer();
}

export async function addUserAction(user: Omit<User, 'id' | 'registrationDate'>): Promise<string> {
    return await addUserServer(user);
}

export async function updateUserAction(user: User): Promise<void> {
    await updateUserServer(user);
}

export async function deleteUserAction(userId: string): Promise<void> {
    await deleteUserServer(userId);
}

export async function getUserAction(userId: string): Promise<User | null> {
    return await getUserServer(userId);
}

export async function getPortfolioAction(userId: string): Promise<Portfolio | null> {
    return await getPortfolioServer(userId);
}

export async function getTransactionsAction(userId: string): Promise<Transaction[]> {
    return await getTransactionsServer(userId);
}
