import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatCurrency } from '../utils/storage';
import { Wallet } from 'lucide-react';

const WalletSelector = ({ wallets, currentWalletId, onWalletChange }) => {
  const currentWallet = wallets.find(w => w.id === currentWalletId);

  return (
    <Select value={currentWalletId} onValueChange={onWalletChange}>
      <SelectTrigger data-testid="wallet-selector" className="bg-[#141414] border-[#2a2a2a] text-white focus:border-white w-[180px] lg:w-[220px]">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-300" />
          <SelectValue>
            {currentWallet && (
              <span className="truncate">{currentWallet.name}</span>
            )}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#141414] border-[#2a2a2a] text-white">
        {wallets.map((wallet) => (
          <SelectItem key={wallet.id} value={wallet.id} data-testid={`wallet-option-${wallet.id}`}>
            <div className="flex items-center justify-between gap-4 w-full">
              <span className="font-medium">{wallet.name}</span>
              <span className="text-sm text-gray-400">
                {formatCurrency(wallet.balance, wallet.currency)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WalletSelector;
