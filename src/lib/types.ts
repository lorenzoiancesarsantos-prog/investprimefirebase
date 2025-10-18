
import { Timestamp, FieldValue } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  invested: number;
  accountType: 'Standard' | 'Premium' | 'VIP';
  status: 'active' | 'inactive';
  referralCode?: string;
  role?: 'admin' | 'user';
};

export type Portfolio = {
  totalValue: number;
  previousTotalValue: number;
  totalInvested: number;
  lifetimePnl: number;
  monthlyGains: number;
  royalties: number;
  availableBalance: number;
  assets: any[]; 
};

export type Transaction = {
  id: string;
  date: string; // ISO 8601 format
  quantity: number;
  amount: number;
  type: 'purchase' | 'withdrawal' | 'referral' | 'deposit';
};

export type Investment = {
    id: string;
    userId: number;
    userName: string;
    amount: number;
    expectedReturn: number;
    startDate: string; // formatted as string
    duration: string;
    status: 'active' | 'completed';
}

export type Campaign = {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'ended';
    description: string;
    startDate: string; // formatted as string
    endDate: string; // formatted as string
    conversion: string;
    targetAudience: string;
}
