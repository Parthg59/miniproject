import { v4 as uuidv4 } from 'uuid';
import { subDays, subMonths } from 'date-fns';

export const initializeSampleData = () => {
  const walletId = uuidv4();
  
  const sampleWallet = {
    id: walletId,
    name: 'Personal Wallet',
    balance: 5000,
    currency: 'USD',
    initialBalance: 5000,
    createdAt: subMonths(new Date(), 2).toISOString()
  };

  const categories = [
    'food-drinks',
    'shopping',
    'transportation',
    'entertainment',
    'utilities',
    'housing',
    'healthcare',
    'dining'
  ];

  const labels = {
    'food-drinks': ['Groceries', 'Coffee', 'Snacks', 'Market'],
    'shopping': ['Clothing', 'Electronics', 'Books', 'Home Decor'],
    'transportation': ['Gas', 'Uber', 'Parking', 'Maintenance'],
    'entertainment': ['Movies', 'Streaming', 'Games', 'Concert'],
    'utilities': ['Electric', 'Water', 'Internet', 'Phone'],
    'housing': ['Rent', 'Maintenance', 'Insurance', 'Furniture'],
    'healthcare': ['Pharmacy', 'Checkup', 'Gym', 'Supplements'],
    'dining': ['Restaurant', 'Takeout', 'Fast Food', 'Cafe']
  };

  const sampleTransactions = [];
  for (let i = 0; i < 45; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const label = labels[category][Math.floor(Math.random() * labels[category].length)];
    const amount = parseFloat((Math.random() * 150 + 10).toFixed(2));
    const daysAgo = Math.floor(Math.random() * 60);
    
    sampleTransactions.push({
      id: uuidv4(),
      walletId: walletId,
      amount: amount,
      category: category,
      label: label,
      notes: '',
      paymentMethod: ['Cash', 'Credit Card', 'Debit Card', 'UPI'][Math.floor(Math.random() * 4)],
      date: subDays(new Date(), daysAgo).toISOString(),
      isRecurring: Math.random() > 0.9,
      recurrenceType: Math.random() > 0.5 ? 'monthly' : 'weekly'
    });
  }

  const sampleBudgets = [
    { category: 'food-drinks', limit: 500, walletId },
    { category: 'transportation', limit: 300, walletId },
    { category: 'entertainment', limit: 200, walletId },
    { category: 'dining', limit: 400, walletId }
  ];

  return {
    wallet: sampleWallet,
    transactions: sampleTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
    budgets: sampleBudgets
  };
};
