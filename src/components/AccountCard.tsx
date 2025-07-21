import { Account } from '@/types/bank';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, TrendingDown, Snowflake } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  showBalance: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function AccountCard({ account, showBalance, onDeposit, onWithdraw }: AccountCardProps) {
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
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{account.accountNumber}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getTypeColor(account.type)}>
                  {account.type}
                </Badge>
                <Badge variant="outline" className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold">
            {showBalance ? `$${account.balance.toFixed(2)}` : '••••••'}
          </p>
        </div>

        {account.status === 'active' ? (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onDeposit}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              Deposit
            </Button>
            <Button 
              onClick={onWithdraw}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <TrendingDown className="h-3 w-3" />
              Withdraw
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Snowflake className="h-4 w-4" />
              <span className="text-sm">Account {account.status}</span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Created: {new Date(account.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}