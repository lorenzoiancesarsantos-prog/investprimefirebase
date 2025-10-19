
export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    invested: number;
    accountType: 'Standard' | 'Premium' | 'VIP';
    status: 'active' | 'inactive';
    referralCode?: string;
    role: 'user' | 'admin';
    registrationDate: any; // Can be a server timestamp
    lastUpdated?: any; // Can be a server timestamp
    emailVerified?: boolean;
};

export type Asset = {
    id: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    totalValue: number;
};

export type Portfolio = {
    userId: string;
    totalValue: number;
    previousTotalValue: number;
    totalInvested: number;
    lifetimePnl: number;
    monthlyGains: number;
    royalties: number;
    availableBalance: number;
    assets: Asset[];
    createdAt?: any; // Can be a server timestamp
    updatedAt?: any; // Can be a server timestamp
};

export type Transaction = {
    id: string;
    date: string;
    quantity: number;
    amount: number;
    type: 'purchase' | 'withdrawal' | 'referral' | 'deposit' | 'investment';
};

export type Campaign = {
    id: string;
    title: string;
    description: string;
    goal: number;
    pledged: number;
    deadline: string;
    status: 'active' | 'inactive';
};

export type Notification = {
    id: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};
