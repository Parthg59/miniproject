import { useState } from 'react';
import { getCategoryDetails } from '../utils/categories';
import { formatCurrency } from '../utils/storage';
import { storage } from '../utils/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import AddTransactionModal from './AddTransactionModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const TransactionsList = ({ transactions, currency, onTransactionUpdated, onTransactionDeleted }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filteredTransactions = transactions.filter(t => {
    const categoryLabel = getCategoryDetails(t.category).label.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      categoryLabel.includes(query) ||
      t.label.toLowerCase().includes(query) ||
      t.notes.toLowerCase().includes(query)
    );
  });

  const handleDelete = (transactionId) => {
    const allTransactions = storage.getTransactions();
    const filtered = allTransactions.filter(t => t.id !== transactionId);
    storage.setTransactions(filtered);
    toast.success('Transaction deleted successfully');
    onTransactionDeleted();
    setDeleteId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12" data-testid="no-transactions">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#141414] flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-400">No transactions yet</p>
        <p className="text-sm text-gray-500 mt-1">Start tracking your expenses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <Input
            data-testid="search-transactions-input"
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--input-text)',
              '--placeholder-color': 'var(--input-placeholder)'
            }}
            className="pl-10 focus:border-emerald-500"
          />
        </div>
      )}

      <div className="space-y-2 sm:space-y-3">
        {filteredTransactions.map((transaction) => {
          const categoryDetails = getCategoryDetails(transaction.category);
          const Icon = categoryDetails.icon;
          
          return (
            <div
              key={transaction.id}
              data-testid={`transaction-item-${transaction.id}`}
              className="transaction-item flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
              }}
            >
              <div className="transaction-icon-section flex items-center gap-4 flex-1 min-w-0 sm:flex-shrink-0">
                <div
                  className="p-3 rounded-full category-icon flex-shrink-0"
                  style={{ background: `${categoryDetails.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: categoryDetails.color }} />
                </div>
                
                <div className="transaction-details flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>{transaction.label}</span>
                    {transaction.isRecurring && (
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="truncate">{categoryDetails.label}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{format(parseISO(transaction.date), 'MMM dd')}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline truncate">{transaction.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="transaction-amount-section flex items-center gap-1 flex-shrink-0 sm:ml-auto">
                <Button
                  data-testid={`edit-transaction-${transaction.id}`}
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingTransaction(transaction)}
                  style={{ color: 'var(--text-secondary)' }}
                  className="h-8 w-8 hover:text-white hover:bg-white/10"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  data-testid={`delete-transaction-${transaction.id}`}
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleteId(transaction.id)}
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <span className="text-base sm:text-lg font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(transaction.amount, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && searchQuery && (
        <div className="text-center py-8" data-testid="no-search-results">
          <p className="text-gray-400">No transactions found for "{searchQuery}"</p>
        </div>
      )}

      {editingTransaction && (
        <AddTransactionModal
          open={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          walletId={editingTransaction.walletId}
          currency={currency}
          onTransactionAdded={() => {
            onTransactionUpdated();
            setEditingTransaction(null);
          }}
          editTransaction={editingTransaction}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent style={{
          background: 'var(--modal-bg)',
          borderColor: 'var(--modal-border)',
          color: 'var(--text-primary)'
        }} className="border" data-testid="delete-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'var(--text-primary)' }}>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{
              borderColor: 'var(--button-outline-border)',
              color: 'var(--button-outline-text)',
              background: 'transparent'
            }} className="border hover:bg-[var(--card-hover-bg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-button"
              onClick={() => handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsList;
