import { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Plus,
  Snowflake,
  RotateCcw,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { CreateUserDialog } from './CreateUserDialog';

export function AdminPanel() {
  const { users, accounts, transactions, freezeAccount, unfreezeAccount } = useBank();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);

  const customerUsers = users.filter(user => user.role === 'customer');
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalTransactions = transactions.length;

  const filteredUsers = customerUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = accounts.filter(account => {
    const user = users.find(u => u.id === account.userId);
    return user && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'frozen': return 'bg-warning/10 text-warning border-warning/20';
      case 'closed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'savings' 
      ? 'bg-banking-green/10 text-banking-green border-banking-green/20'
      : 'bg-banking-blue/10 text-banking-blue border-banking-blue/20';
  };

  return (
    <div className="space-y-6">
      {/* Admin Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{customerUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-banking-blue" />
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-banking-green" />
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-banking-gold" />
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="accounts">Manage Accounts</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setShowCreateUser(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users or accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all customer accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No users match your search.' : 'No customer users have been created yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => {
                    const userAccounts = accounts.filter(acc => acc.userId === user.id);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>@{user.username}</span>
                              <span>•</span>
                              <span>{user.email}</span>
                              <span>•</span>
                              <span>{userAccounts.length} account{userAccounts.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                View and manage all bank accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Accounts Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No accounts match your search.' : 'No accounts have been created yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAccounts.map((account) => {
                    const user = users.find(u => u.id === account.userId);
                    return (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-banking-blue/10 rounded-full">
                            <CreditCard className="h-4 w-4 text-banking-blue" />
                          </div>
                          <div>
                            <p className="font-medium">{account.accountNumber}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{user?.name}</span>
                              <span>•</span>
                              <Badge variant="outline" className={getTypeColor(account.type)}>
                                {account.type}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(account.status)}>
                                {account.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold">${account.balance.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              Created: {new Date(account.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {account.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => freezeAccount(account.id)}
                              className="flex items-center gap-1"
                            >
                              <Snowflake className="h-3 w-3" />
                              Freeze
                            </Button>
                          ) : account.status === 'frozen' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unfreezeAccount(account.id)}
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Unfreeze
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
      />
    </div>
  );
}