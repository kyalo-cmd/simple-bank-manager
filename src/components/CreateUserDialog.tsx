import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBank } from '@/context/BankContext';
import { User, Shield } from 'lucide-react';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer' as 'admin' | 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, users } = useBank();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      createUser(formData);
      setIsLoading(false);
      onOpenChange(false);
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'customer'
      });
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const usernameExists = users.some(user => user.username === formData.username);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the banking system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username*</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateField('username', e.target.value)}
                required
              />
              {usernameExists && formData.username && (
                <p className="text-sm text-destructive">Username already exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address*</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>User Role</Label>
            <RadioGroup 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'customer') => updateField('role', value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-3 border border-border rounded-lg p-3">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Customer
                </Label>
              </div>
              <div className="flex items-center space-x-3 border border-border rounded-lg p-3">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="h-4 w-4" />
                  Admin
                </Label>
              </div>
            </RadioGroup>
          </div>

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
              disabled={isLoading || usernameExists || !formData.username || !formData.password || !formData.name || !formData.email || !formData.phone || !formData.address}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}