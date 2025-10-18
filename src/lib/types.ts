
export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    invested: number;
    accountType: 'Standard' | 'Premium';
    status: 'active' | 'inactive' | 'suspended';
    referralCode?: string;
    role: 'user' | 'admin';
    registrationDate: string;
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
    totalValue: number;
    previousTotalValue: number;
    totalInvested: number;
    lifetimePnl: number;
    monthlyGains: number;
    royalties: number;
    availableBalance: number;
    assets: Asset[];
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
