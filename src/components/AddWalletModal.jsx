import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Wallet, DollarSign, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useTheme } from '../context/ThemeContext';

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' }
];

const AddWalletModal = ({ open, onClose, onWalletAdded }) => {
  const { theme } = useTheme();
  const [walletType, setWalletType] = useState('manual');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (walletType === 'bank') {
        toast.info('This is a demo feature. Real bank integration not available.');
        setLoading(false);
        return;
      }

      const wallet = {
        id: uuidv4(),
        name,
        balance: parseFloat(balance),
        currency,
        initialBalance: parseFloat(balance),
        createdAt: new Date().toISOString()
      };

      const wallets = storage.getWallets();
      wallets.push(wallet);
      storage.setWallets(wallets);

      if (wallets.length === 1) {
        storage.setCurrentWallet(wallet.id);
      }

      toast.success('Wallet created successfully!');
      onWalletAdded();
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setWalletType('manual');
    setName('');
    setBalance('');
    setCurrency('USD');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{
        background: 'var(--modal-bg)',
        borderColor: 'var(--modal-border)',
        color: 'var(--text-primary)'
      }} className="max-w-md" data-testid="add-wallet-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>Create Wallet</DialogTitle>
          <DialogDescription style={{ color: 'var(--text-secondary)' }}>
            Add a new wallet to track your expenses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Wallet Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              data-testid="manual-wallet-button"
              onClick={() => setWalletType('manual')}
              style={{
                background: walletType === 'manual' ? 'var(--card-hover-bg)' : 'var(--card-bg)',
                borderColor: walletType === 'manual' ? 'var(--text-primary)' : 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
              className={`p-4 rounded-lg border-2 transition-all`}
            >
              <Wallet className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
              <div className="text-sm font-semibold">Manual Wallet</div>
            </button>

            <button
              type="button"
              data-testid="bank-wallet-button"
              onClick={() => setWalletType('bank')}
              style={{
                background: walletType === 'bank' ? 'var(--card-hover-bg)' : 'var(--card-bg)',
                borderColor: walletType === 'bank' ? 'var(--text-primary)' : 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
              className={`p-4 rounded-lg border-2 transition-all`}
            >
              <Building2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
              <div className="text-sm font-semibold">Bank Account</div>
            </button>
          </div>

          {walletType === 'bank' && (
            <Alert style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }} data-testid="bank-demo-alert">
              <AlertDescription style={{ color: 'rgb(96, 165, 250)' }} className="text-sm">
                Bank integration is a demo feature. Please use Manual Wallet instead.
              </AlertDescription>
            </Alert>
          )}

          {walletType === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="wallet-form">
              <div className="space-y-2">
                <Label htmlFor="wallet-name" style={{ color: 'var(--text-primary)' }}>Wallet Name</Label>
                <Input
                  id="wallet-name"
                  data-testid="wallet-name-input"
                  type="text"
                  placeholder="e.g., Personal, Business, Savings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--input-text)'
                  }}
                  className="focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-balance" style={{ color: 'var(--text-primary)' }}>Initial Balance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <Input
                    id="initial-balance"
                    data-testid="initial-balance-input"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                    className="pl-10 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" style={{ color: 'var(--text-primary)' }}>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger data-testid="currency-select" style={{
                    background: 'var(--select-bg)',
                    borderColor: 'var(--select-border)',
                    color: 'var(--input-text)'
                  }} className="focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{
                    background: 'var(--select-content-bg)',
                    borderColor: 'var(--select-border)'
                  }}>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value} data-testid={`currency-option-${curr.value}`}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  data-testid="cancel-wallet-button"
                  variant="outline"
                  onClick={onClose}
                  style={{
                    borderColor: 'var(--button-outline-border)',
                    color: 'var(--button-outline-text)',
                    background: 'transparent'
                  }}
                  className="flex-1 hover:bg-[var(--card-hover-bg)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-testid="create-wallet-button"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                >
                  {loading ? 'Creating...' : 'Create Wallet'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWalletModal;
