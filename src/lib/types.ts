
import { Timestamp, FieldValue } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: Timestamp | FieldValue;
  invested: number;
  accountType: 'Standard' | 'Premium' | 'VIP';
  status: 'active' | 'inactive';
  referralCode?: string;
  role?: 'admin' | 'user';
};

export type Portfolio = {
  totalInvested: number;
  monthlyGains: number;
  royalties: number;
  availableBalance: number;
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
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  minInvestment: number;
  term: number; // in months
}

export type Campaign = {
    id: string;
    name: string;
    description: string;
    startDate: Timestamp | FieldValue;
    endDate: Timestamp | FieldValue;
    targetAudience: string;
    status: 'active' | 'inactive';
}
