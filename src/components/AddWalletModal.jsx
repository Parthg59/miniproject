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
      <DialogContent className="bg-[#0a0a0a] border-[#2a2a2a] text-white max-w-md" data-testid="add-wallet-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Create Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
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
              className={`p-4 rounded-lg border-2 transition-all ${
                walletType === 'manual'
                  ? 'border-white bg-[#1a1a1a]'
                  : 'border-[#2a2a2a] bg-[#141414] hover:border-white/20'
              }`}
            >
              <Wallet className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <div className="text-sm font-semibold">Manual Wallet</div>
            </button>

            <button
              type="button"
              data-testid="bank-wallet-button"
              onClick={() => setWalletType('bank')}
              className={`p-4 rounded-lg border-2 transition-all ${
                walletType === 'bank'
                  ? 'border-white bg-[#1a1a1a]'
                  : 'border-[#2a2a2a] bg-[#141414] hover:border-white/20'
              }`}
            >
              <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <div className="text-sm font-semibold">Bank Account</div>
            </button>
          </div>

          {walletType === 'bank' && (
            <Alert className="bg-blue-500/10 border-blue-500/30" data-testid="bank-demo-alert">
              <AlertDescription className="text-blue-300 text-sm">
                Bank integration is a demo feature. Please use Manual Wallet instead.
              </AlertDescription>
            </Alert>
          )}

          {walletType === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="wallet-form">
              <div className="space-y-2">
                <Label htmlFor="wallet-name">Wallet Name</Label>
                <Input
                  id="wallet-name"
                  data-testid="wallet-name-input"
                  type="text"
                  placeholder="e.g., Personal, Business, Savings"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#141414] border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-balance">Initial Balance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="initial-balance"
                    data-testid="initial-balance-input"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    required
                    className="bg-[#141414] border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-white pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger data-testid="currency-select" className="bg-[#141414] border-[#2a2a2a] text-white focus:border-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-[#2a2a2a] text-white">
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
                  className="flex-1 border-white/20 text-gray-300 hover:bg-[#141414]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-testid="create-wallet-button"
                  disabled={loading}
                  className="flex-1 bg-white hover:bg-gray-200 text-black text-white"
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
