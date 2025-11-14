import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { storage } from '../utils/storage';
import { initializeSampleData } from '../utils/sampleData';
import { toast } from 'sonner';
import { Wallet, TrendingUp, PiggyBank, ArrowRight, Lock, User } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userData = { username, id: 'user-1' };
      storage.setUser(userData);
      
      const existingWallets = storage.getWallets();
      if (existingWallets.length === 0) {
        const sampleData = initializeSampleData();
        storage.setWallets([sampleData.wallet]);
        storage.setTransactions(sampleData.transactions);
        storage.setBudgets(sampleData.budgets);
        storage.setCurrentWallet(sampleData.wallet.id);
      }
      
      toast.success('Welcome back! Login successful');
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 expense-tracker-app">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 lg:gap-8 items-center animate-fade-in">
        
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Track Every
              <span className="block">Penny</span>
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Take control of your finances with smart expense tracking, budget planning, and insightful analytics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-105" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
              <div className="p-3 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                <Wallet className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Multi-Wallet Management</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Manage multiple wallets with different currencies</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-105" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
              <div className="p-3 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Smart Analytics</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Visual insights into your spending patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-105" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
              <div className="p-3 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                <PiggyBank className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Budget Planning</h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Set limits and get notified when you exceed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Mobile Features Section */}
          <div className="lg:hidden space-y-4 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Why Choose Expense Tracker?</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg text-center" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
                <div className="p-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <Wallet className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Multi-Wallet</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Manage wallets</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-lg text-center" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
                <div className="p-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Analytics</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Spending insights</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-lg text-center" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
                <div className="p-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <PiggyBank className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Budgets</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Set & track</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-lg text-center" style={{ background: 'var(--card-bg)', border: `1px solid var(--card-border)` }}>
                <div className="p-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Reports</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>View history</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <Card className="glass-card p-6 lg:p-8 animate-slide-in" data-testid="login-card">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your expense tracker</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
                <div className="space-y-2">
                  <Label htmlFor="username" style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    data-testid="username-input"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="focus:border-emerald-500"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: 'var(--text-secondary)' }} className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    data-testid="password-input"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus:border-emerald-500"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--input-text)'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="login-button"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg group transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ height: '1px', background: 'var(--border-light)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span style={{ background: 'var(--card-bg)', color: 'var(--text-tertiary)', padding: '0 0.5rem' }}>Demo Credentials</span>
                </div>
              </div>

              <div className="text-center text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                <p>Username: <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>user</span></p>
                <p>Password: <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>password</span></p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
