import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, formatCurrency, convertCurrency } from '../utils/storage';
import { getCategoryDetails } from '../utils/categories';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, Filter, Download, Settings, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import AddTransactionModal from '../components/AddTransactionModal';
import AddWalletModal from '../components/AddWalletModal';
import WalletSelector from '../components/WalletSelector';
import TransactionsList from '../components/TransactionsList';
import BudgetManager from '../components/BudgetManager';
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth, parseISO } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currentWalletId, setCurrentWalletId] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const userData = storage.getUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    loadData();
  }, [navigate]);

  const loadData = () => {
    const walletsData = storage.getWallets();
    const transactionsData = storage.getTransactions();
    const budgetsData = storage.getBudgets();
    const currentWallet = storage.getCurrentWallet();

    setWallets(walletsData);
    setTransactions(transactionsData);
    setBudgets(budgetsData);
    
    if (walletsData.length > 0) {
      setCurrentWalletId(currentWallet || walletsData[0].id);
    }
  };

  const handleLogout = () => {
    storage.clearAll();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const currentWallet = wallets.find(w => w.id === currentWalletId);
  
  const walletTransactions = transactions.filter(t => t.walletId === currentWalletId);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!currentWallet) return { totalExpense: 0, thisMonth: 0, lastMonth: 0, savings: 0 };

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTransactions = walletTransactions.filter(t => {
      const date = parseISO(t.date);
      return date >= thisMonthStart && date <= thisMonthEnd;
    });

    const lastMonthTransactions = walletTransactions.filter(t => {
      const date = parseISO(t.date);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    const thisMonthExpense = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpense = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = walletTransactions.reduce((sum, t) => sum + t.amount, 0);
    const savings = currentWallet.initialBalance - totalExpense;

    return {
      totalExpense,
      thisMonth: thisMonthExpense,
      lastMonth: lastMonthExpense,
      savings,
      percentChange: lastMonthExpense > 0 ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0
    };
  }, [currentWallet, walletTransactions]);

  // Category-wise spending
  const categoryData = useMemo(() => {
    const categoryMap = {};
    walletTransactions.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    });

    return Object.entries(categoryMap).map(([category, amount]) => {
      const details = getCategoryDetails(category);
      return {
        name: details.label,
        value: amount,
        color: details.color
      };
    });
  }, [walletTransactions]);

  // Monthly trend data (last 6 months)
  const monthlyTrendData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthTransactions = walletTransactions.filter(t => 
        isSameMonth(parseISO(t.date), date)
      );
      const expense = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: format(date, 'MMM'),
        expense: expense,
        savings: currentWallet ? (currentWallet.initialBalance / 6 - expense) : 0
      });
    }
    return months;
  }, [walletTransactions, currentWallet]);

  const exportTransactions = () => {
    if (walletTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const csvContent = [
      ['Date', 'Category', 'Amount', 'Label', 'Payment Method', 'Notes'].join(','),
      ...walletTransactions.map(t => [
        t.date,
        getCategoryDetails(t.category).label,
        t.amount,
        t.label,
        t.paymentMethod,
        t.notes
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Transactions exported successfully');
  };

  if (!user || wallets.length === 0) {
    return (
      <div className="min-h-screen expense-tracker-app flex items-center justify-center p-4">
        <Card className="glass-card p-8 max-w-md w-full text-center space-y-6" data-testid="welcome-card">
          <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center">
            <Wallet className="w-10 h-10 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Expense Tracker</h2>
            <p className="text-gray-400">Create your first wallet to start tracking expenses</p>
          </div>
          <Button
            data-testid="create-first-wallet-button"
            onClick={() => setShowAddWallet(true)}
            className="w-full bg-white hover:bg-gray-200 text-black text-white font-semibold py-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Wallet
          </Button>
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            variant="outline"
            className="w-full border-white/20 text-gray-300 hover:bg-[#141414]"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </Card>
        <AddWalletModal
          open={showAddWallet}
          onClose={() => setShowAddWallet(false)}
          onWalletAdded={loadData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen expense-tracker-app">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-black backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="mobile-menu-button"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </Button>
              <h1 className="text-xl lg:text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Expense Tracker</h1>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <WalletSelector
                wallets={wallets}
                currentWalletId={currentWalletId}
                onWalletChange={(id) => {
                  setCurrentWalletId(id);
                  storage.setCurrentWallet(id);
                }}
              />
              <Button
                data-testid="add-transaction-button"
                onClick={() => setShowAddTransaction(true)}
                className="bg-white hover:bg-gray-200 text-black text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">Add Expense</span>
              </Button>
              <Button
                data-testid="logout-header-button"
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/20 text-gray-300 hover:bg-[#141414]"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="glass-card p-4 lg:p-6" data-testid="total-balance-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Current Balance</span>
              <DollarSign className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              {currentWallet && formatCurrency(currentWallet.balance - stats.totalExpense, currentWallet.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">of {currentWallet && formatCurrency(currentWallet.balance, currentWallet.currency)}</p>
          </Card>

          <Card className="glass-card p-4 lg:p-6" data-testid="month-expense-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">This Month</span>
              <TrendingDown className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              {currentWallet && formatCurrency(stats.thisMonth, currentWallet.currency)}
            </div>
            <p className={`text-xs mt-1 flex items-center gap-1 ${
              stats.percentChange > 0 ? 'text-red-400' : 'text-green-400'
            }`}>
              {stats.percentChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(stats.percentChange).toFixed(1)}% vs last month
            </p>
          </Card>

          <Card className="glass-card p-4 lg:p-6" data-testid="savings-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Savings</span>
              <TrendingUp className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              {currentWallet && formatCurrency(stats.savings, currentWallet.currency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
          </Card>

          <Card className="glass-card p-4 lg:p-6" data-testid="total-transactions-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Transactions</span>
              <Calendar className="w-5 h-5 text-gray-300" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-white">
              {walletTransactions.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total entries</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[#141414] border border-[#2a2a2a] p-1" data-testid="dashboard-tabs">
            <TabsTrigger value="overview" data-testid="overview-tab" className="data-[state=active]:bg-white data-[state=active]:text-black">Overview</TabsTrigger>
            <TabsTrigger value="transactions" data-testid="transactions-tab" className="data-[state=active]:bg-white data-[state=active]:text-black">Transactions</TabsTrigger>
            <TabsTrigger value="budgets" data-testid="budgets-tab" className="data-[state=active]:bg-white data-[state=active]:text-black">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <Card className="glass-card p-4 lg:p-6" data-testid="monthly-trend-chart">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="expense" fill="#f97316" name="Expenses" />
                    <Bar dataKey="savings" fill="#10b981" name="Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Category Distribution */}
              <Card className="glass-card p-4 lg:p-6" data-testid="category-chart">
                <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      formatter={(value) => formatCurrency(value, currentWallet.currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Transactions Preview */}
            <Card className="glass-card p-4 lg:p-6" data-testid="recent-transactions">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTab('transactions')}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                  data-testid="view-all-button"
                >
                  View All
                </Button>
              </div>
              <TransactionsList
                transactions={walletTransactions.slice(0, 5)}
                currency={currentWallet.currency}
                onTransactionUpdated={loadData}
                onTransactionDeleted={loadData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="glass-card p-4 lg:p-6" data-testid="all-transactions">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-white">All Transactions</h3>
                <Button
                  data-testid="export-csv-button"
                  onClick={exportTransactions}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-gray-300 hover:bg-[#141414]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <TransactionsList
                transactions={walletTransactions}
                currency={currentWallet.currency}
                onTransactionUpdated={loadData}
                onTransactionDeleted={loadData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetManager
              walletId={currentWalletId}
              transactions={walletTransactions}
              currency={currentWallet.currency}
              budgets={budgets}
              onBudgetsUpdated={loadData}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <AddTransactionModal
        open={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        walletId={currentWalletId}
        currency={currentWallet?.currency}
        onTransactionAdded={loadData}
      />

      <AddWalletModal
        open={showAddWallet}
        onClose={() => setShowAddWallet(false)}
        onWalletAdded={loadData}
      />
    </div>
  );
};

export default Dashboard;
