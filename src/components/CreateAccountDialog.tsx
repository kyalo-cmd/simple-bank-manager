import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBank } from '@/context/BankContext';
import { Wallet, CreditCard } from 'lucide-react';

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function CreateAccountDialog({ open, onOpenChange, userId }: CreateAccountDialogProps) {
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');
  const [isLoading, setIsLoading] = useState(false);
  const { createAccount } = useBank();

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      createAccount(userId, accountType);
      setIsLoading(false);
      onOpenChange(false);
      setAccountType('savings');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Choose the type of account you would like to create.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Label>Account Type</Label>
          <RadioGroup 
            value={accountType} 
            onValueChange={(value: 'savings' | 'current') => setAccountType(value)}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex items-center space-x-3 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="savings" id="savings" />
              <Label htmlFor="savings" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-banking-green/10 rounded-lg">
                  <Wallet className="h-5 w-5 text-banking-green" />
                </div>
                <div>
                  <div className="font-medium">Savings Account</div>
                  <div className="text-sm text-muted-foreground">
                    Earn interest on your deposits
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-banking-blue/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-banking-blue" />
                </div>
                <div>
                  <div className="font-medium">Current Account</div>
                  <div className="text-sm text-muted-foreground">
                    For everyday banking and transactions
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}