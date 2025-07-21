import { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  LogOut, 
  Plus, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Shield,
  Users,
  Eye,
  EyeOff,
  Snowflake,
  RotateCcw
} from 'lucide-react';
import { AccountCard } from './AccountCard';
import { TransactionHistory } from './TransactionHistory';
import { CreateAccountDialog } from './CreateAccountDialog';
import { TransactionDialog } from './TransactionDialog';
import { CreateUserDialog } from './CreateUserDialog';
import { AdminPanel } from './AdminPanel';

export function Dashboard() {
  const { currentUser, logout, getUserAccounts, accounts, users } = useBank();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  if (!currentUser) return null;

  const userAccounts = getUserAccounts(currentUser.id);
  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleTransaction = (accountId: string, type: 'deposit' | 'withdrawal') => {
    setSelectedAccount(accountId);
    setTransactionType(type);
    setShowTransaction(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">SecureBank</h1>
                <p className="text-sm text-muted-foreground">Banking Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{currentUser.name}</p>
                <div className="flex items-center gap-1">
                  {currentUser.role === 'admin' && <Shield className="h-3 w-3" />}
                  <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {currentUser.role === 'admin' ? (
          <AdminPanel />
        ) : (
          <Tabs defaultValue="accounts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accounts">My Accounts</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="space-y-6">
              {/* Balance Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Total Balance</CardTitle>
                      <CardDescription>Across all your accounts</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {showBalance ? `$${totalBalance.toFixed(2)}` : '••••••'}
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-success">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userAccounts.length} account{userAccounts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowCreateAccount(true)}
                  className="h-20 flex-col gap-2"
                >
                  <Plus className="h-6 w-6" />
                  Create New Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => userAccounts.length > 0 && handleTransaction(userAccounts[0].id, 'deposit')}
                  className="h-20 flex-col gap-2"
                  disabled={userAccounts.length === 0}
                >
                  <TrendingUp className="h-6 w-6" />
                  Quick Deposit
                </Button>
              </div>

              {/* Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    showBalance={showBalance}
                    onDeposit={() => handleTransaction(account.id, 'deposit')}
                    onWithdraw={() => handleTransaction(account.id, 'withdrawal')}
                  />
                ))}
              </div>

              {userAccounts.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Accounts Yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Get started by creating your first bank account
                    </p>
                    <Button onClick={() => setShowCreateAccount(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionHistory userAccounts={userAccounts} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Dialogs */}
      <CreateAccountDialog
        open={showCreateAccount}
        onOpenChange={setShowCreateAccount}
        userId={currentUser.id}
      />
      
      {selectedAccount && (
        <TransactionDialog
          open={showTransaction}
          onOpenChange={setShowTransaction}
          accountId={selectedAccount}
          type={transactionType}
        />
      )}
      
      {currentUser.role === 'admin' && (
        <CreateUserDialog
          open={showCreateUser}
          onOpenChange={setShowCreateUser}
        />
      )}
    </div>
  );
}