const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

export const storage = {
  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },

  getWallets: () => {
    const wallets = sessionStorage.getItem('wallets');
    return wallets ? JSON.parse(wallets) : [];
  },

  setWallets: (wallets) => {
    sessionStorage.setItem('wallets', JSON.stringify(wallets));
  },

  getTransactions: () => {
    const transactions = sessionStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  },

  setTransactions: (transactions) => {
    sessionStorage.setItem('transactions', JSON.stringify(transactions));
  },

  getBudgets: () => {
    const budgets = sessionStorage.getItem('budgets');
    return budgets ? JSON.parse(budgets) : [];
  },

  setBudgets: (budgets) => {
    sessionStorage.setItem('budgets', JSON.stringify(budgets));
  },

  getCurrentWallet: () => {
    return sessionStorage.getItem('currentWallet');
  },

  setCurrentWallet: (walletId) => {
    sessionStorage.setItem('currentWallet', walletId);
  },

  clearAll: () => {
    sessionStorage.clear();
  }
};

export const formatCurrency = (amount, currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥'
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${Number(amount).toFixed(2)}`;
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  return amount;
};
