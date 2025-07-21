import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBank } from '@/context/BankContext';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  type: 'deposit' | 'withdrawal';
}

export function TransactionDialog({ open, onOpenChange, accountId, type }: TransactionDialogProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { deposit, withdraw, accounts } = useBank();

  const account = accounts.find(acc => acc.id === accountId);
  const isDeposit = type === 'deposit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const amountValue = parseFloat(amount);
      const success = isDeposit 
        ? deposit(accountId, amountValue, description || `${type} transaction`)
        : withdraw(accountId, amountValue, description || `${type} transaction`);
      
      if (success) {
        onOpenChange(false);
        setAmount('');
        setDescription('');
      }
      setIsLoading(false);
    }, 1000);
  };

  const reset = () => {
    setAmount('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) reset();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDeposit ? (
              <>
                <TrendingUp className="h-5 w-5 text-success" />
                Deposit Money
              </>
            ) : (
              <>
                <TrendingDown className="h-5 w-5 text-destructive" />
                Withdraw Money
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isDeposit ? 'Add money to' : 'Withdraw money from'} account {account?.accountNumber}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {account && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Current Balance:</span>
                <span className="font-semibold">${account.balance.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder={`Enter description for this ${type}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {!isDeposit && account && parseFloat(amount) > account.balance && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <p className="text-sm text-destructive">
                Insufficient funds. Available balance: ${account.balance.toFixed(2)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !amount || parseFloat(amount) <= 0 || (!isDeposit && account && parseFloat(amount) > account.balance)}
              className={isDeposit ? 'bg-success hover:bg-success/90' : ''}
            >
              {isLoading ? 'Processing...' : `${isDeposit ? 'Deposit' : 'Withdraw'} $${amount || '0.00'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}