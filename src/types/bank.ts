export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'customer';
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  userId: string;
  type: 'savings' | 'current';
  balance: number;
  status: 'active' | 'frozen' | 'closed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface BankState {
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  currentUser: User | null;
}