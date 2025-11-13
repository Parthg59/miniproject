import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import axios from 'axios';
import { storage } from '../utils/storage';
import { toast } from 'sonner';
import { Wallet, TrendingUp, PiggyBank, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        storage.setUser(response.data.user);
        toast.success('Welcome back! Login successful');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #1a1f35 100%)' }}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center animate-fade-in">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Track Every
              <span className="gradient-text block">Penny</span>
            </h1>
            <p className="text-lg text-gray-400">
              Take control of your finances with smart expense tracking, budget planning, and insightful analytics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="p-3 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Multi-Wallet Management</h3>
                <p className="text-sm text-gray-400">Manage multiple wallets with different currencies</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div className="p-3 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.2)' }}>
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Analytics</h3>
                <p className="text-sm text-gray-400">Visual insights into your spending patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <div className="p-3 rounded-full" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                <PiggyBank className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Budget Planning</h3>
                <p className="text-sm text-gray-400">Set limits and get notified when you exceed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="glass-card p-8 animate-slide-in" data-testid="login-card">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your expense tracker</p>
            </div>

            {/* Demo Credentials Info */}
            <div className="p-4 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <p className="text-sm text-blue-300 font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-200">Username: <span className="font-mono font-bold">parth</span></p>
              <p className="text-sm text-blue-200">Password: <span className="font-mono font-bold">12345</span></p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  data-testid="username-input"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  data-testid="password-input"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500"
                />
              </div>

              <Button
                type="submit"
                data-testid="login-button"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-6 text-lg group"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              This is a demonstration application. All data is stored locally.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
