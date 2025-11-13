import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { storage } from '../utils/storage';
import { CATEGORIES, PAYMENT_METHODS, RECURRENCE_TYPES } from '../utils/categories';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const AddTransactionModal = ({ open, onClose, walletId, currency, onTransactionAdded, editTransaction }) => {
  const [amount, setAmount] = useState(editTransaction?.amount || '');
  const [category, setCategory] = useState(editTransaction?.category || 'food-drinks');
  const [label, setLabel] = useState(editTransaction?.label || '');
  const [notes, setNotes] = useState(editTransaction?.notes || '');
  const [paymentMethod, setPaymentMethod] = useState(editTransaction?.paymentMethod || 'Cash');
  const [date, setDate] = useState(editTransaction ? new Date(editTransaction.date) : new Date());
  const [isRecurring, setIsRecurring] = useState(editTransaction?.isRecurring || false);
  const [recurrenceType, setRecurrenceType] = useState(editTransaction?.recurrenceType || 'monthly');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transaction = {
        id: editTransaction?.id || uuidv4(),
        walletId,
        amount: parseFloat(amount),
        category,
        label,
        notes,
        paymentMethod,
        date: date.toISOString(),
        isRecurring,
        recurrenceType: isRecurring ? recurrenceType : null
      };

      const transactions = storage.getTransactions();
      
      if (editTransaction) {
        const index = transactions.findIndex(t => t.id === editTransaction.id);
        transactions[index] = transaction;
        toast.success('Transaction updated successfully!');
      } else {
        transactions.push(transaction);
        toast.success('Transaction added successfully!');
      }

      storage.setTransactions(transactions);
      onTransactionAdded();
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (!editTransaction) {
      setAmount('');
      setCategory('food-drinks');
      setLabel('');
      setNotes('');
      setPaymentMethod('Cash');
      setDate(new Date());
      setIsRecurring(false);
      setRecurrenceType('monthly');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0f1e] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto" data-testid="add-transaction-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Record your expense details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4" data-testid="transaction-form">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currency})</Label>
            <Input
              id="amount"
              data-testid="amount-input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="category-select" className="bg-white/5 border-white/10 text-white focus:border-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f35] border-white/10 text-white max-h-[300px]">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} data-testid={`category-${cat.value}`}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: cat.color }} />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label/Tag</Label>
            <Input
              id="label"
              data-testid="label-input"
              type="text"
              placeholder="e.g., coffee, must-have, subscription"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger data-testid="payment-method-select" className="bg-white/5 border-white/10 text-white focus:border-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1f35] border-white/10 text-white">
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method} data-testid={`payment-${method}`}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  data-testid="date-picker-button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1a1f35] border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              data-testid="notes-input"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <Label htmlFor="recurring" className="text-white font-semibold">Recurring Transaction</Label>
              <p className="text-sm text-gray-400">Mark as recurring expense</p>
            </div>
            <Switch
              id="recurring"
              data-testid="recurring-switch"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2 animate-slide-in">
              <Label htmlFor="recurrence-type">Recurrence Type</Label>
              <Select value={recurrenceType} onValueChange={setRecurrenceType}>
                <SelectTrigger data-testid="recurrence-type-select" className="bg-white/5 border-white/10 text-white focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1f35] border-white/10 text-white">
                  {RECURRENCE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} data-testid={`recurrence-${type.value}`}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              data-testid="cancel-transaction-button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="save-transaction-button"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            >
              {loading ? 'Saving...' : editTransaction ? 'Update' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
