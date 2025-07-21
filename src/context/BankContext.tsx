import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Account, Transaction, BankState } from '@/types/bank';
import { toast } from '@/hooks/use-toast';

interface BankContextType extends BankState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  createAccount: (userId: string, type: 'savings' | 'current') => Account;
  deposit: (accountId: string, amount: number, description?: string) => boolean;
  withdraw: (accountId: string, amount: number, description?: string) => boolean;
  getUserAccounts: (userId: string) => Account[];
  getAccountTransactions: (accountId: string) => Transaction[];
  freezeAccount: (accountId: string) => void;
  unfreezeAccount: (accountId: string) => void;
}

const BankContext = createContext<BankContextType | null>(null);

type BankAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'LOAD_DATA'; payload: BankState };

function bankReducer(state: BankState, action: BankAction): BankState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(acc =>
          acc.id === action.payload.id ? action.payload : acc
        )
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

const initialState: BankState = {
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Bank Administrator',
      email: 'admin@bank.com',
      phone: '+1234567890',
      address: '123 Bank Street',
      createdAt: new Date().toISOString()
    },
    {
      id: 'customer-demo',
      username: 'demo',
      password: 'demo123',
      role: 'customer',
      name: 'Demo Customer',
      email: 'demo@customer.com',
      phone: '+1987654321',
      address: '456 Customer Ave',
      createdAt: new Date().toISOString()
    }
  ],
  accounts: [],
  transactions: [],
  currentUser: null
};

export function BankProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('bankData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bankData', JSON.stringify(state));
  }, [state]);

  const login = (username: string, password: string): boolean => {
    const user = state.users.find(u => u.username === username && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`
      });
      return true;
    }
    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
    return newUser;
  };

  const createAccount = (userId: string, type: 'savings' | 'current'): Account => {
    const accountNumber = `ACC${Date.now().toString().slice(-8)}`;
    const newAccount: Account = {
      id: `account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accountNumber,
      userId,
      type,
      balance: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    toast({
      title: "Account Created",
      description: `${type} account ${accountNumber} created successfully`
    });
    return newAccount;
  };

  const deposit = (accountId: string, amount: number, description = 'Deposit'): boolean => {
    const account = state.accounts.find(acc => acc.id === accountId);
    if (!account || account.status !== 'active') {
      toast({
        title: "Transaction Failed",
        description: "Account not found or inactive",
        variant: "destructive"
      });
      return false;
    }

    const newBalance = account.balance + amount;
    const updatedAccount = { ...account, balance: newBalance };
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: 'deposit',
      amount,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    
    toast({
      title: "Deposit Successful",
      description: `$${amount.toFixed(2)} deposited successfully`
    });
    return true;
  };

  const withdraw = (accountId: string, amount: number, description = 'Withdrawal'): boolean => {
    const account = state.accounts.find(acc => acc.id === accountId);
    if (!account || account.status !== 'active') {
      toast({
        title: "Transaction Failed",
        description: "Account not found or inactive",
        variant: "destructive"
      });
      return false;
    }

    if (account.balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "Your account balance is insufficient for this withdrawal",
        variant: "destructive"
      });
      return false;
    }

    const newBalance = account.balance - amount;
    const updatedAccount = { ...account, balance: newBalance };
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: 'withdrawal',
      amount,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance
    };

    dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    
    toast({
      title: "Withdrawal Successful",
      description: `$${amount.toFixed(2)} withdrawn successfully`
    });
    return true;
  };

  const getUserAccounts = (userId: string): Account[] => {
    return state.accounts.filter(acc => acc.userId === userId);
  };

  const getAccountTransactions = (accountId: string): Transaction[] => {
    return state.transactions
      .filter(txn => txn.accountId === accountId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const freezeAccount = (accountId: string) => {
    const account = state.accounts.find(acc => acc.id === accountId);
    if (account) {
      const updatedAccount = { ...account, status: 'frozen' as const };
      dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
      toast({
        title: "Account Frozen",
        description: "Account has been frozen successfully"
      });
    }
  };

  const unfreezeAccount = (accountId: string) => {
    const account = state.accounts.find(acc => acc.id === accountId);
    if (account) {
      const updatedAccount = { ...account, status: 'active' as const };
      dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
      toast({
        title: "Account Unfrozen",
        description: "Account has been activated successfully"
      });
    }
  };

  return (
    <BankContext.Provider value={{
      ...state,
      login,
      logout,
      createUser,
      createAccount,
      deposit,
      withdraw,
      getUserAccounts,
      getAccountTransactions,
      freezeAccount,
      unfreezeAccount
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}