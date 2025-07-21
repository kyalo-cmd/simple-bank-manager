import { useBank } from '@/context/BankContext';
import { Account } from '@/types/bank';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface TransactionHistoryProps {
  userAccounts: Account[];
}

export function TransactionHistory({ userAccounts }: TransactionHistoryProps) {
  const { getAccountTransactions, accounts } = useBank();
  const [searchTerm, setSearchTerm] = useState('');

  // Get all transactions for user's accounts
  const allTransactions = userAccounts.flatMap(account => 
    getAccountTransactions(account.id).map(txn => ({
      ...txn,
      accountNumber: account.accountNumber
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredTransactions = allTransactions.filter(txn =>
    txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View all your recent banking transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No transactions match your search.' : 'Your transaction history will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Account: {transaction.accountNumber}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Balance: {formatCurrency(transaction.balanceAfter)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}