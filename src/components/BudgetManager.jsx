import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { storage, formatCurrency } from '../utils/storage';
import { CATEGORIES, getCategoryDetails } from '../utils/categories';
import { Plus, AlertTriangle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const BudgetManager = ({ walletId, transactions, currency, budgets, onBudgetsUpdated }) => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('food-drinks');
  const [budgetLimit, setBudgetLimit] = useState('');

  const categorySpending = useMemo(() => {
    const spending = {};
    transactions.forEach(t => {
      spending[t.category] = (spending[t.category] || 0) + t.amount;
    });
    return spending;
  }, [transactions]);

  const budgetData = useMemo(() => {
    return budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      const percentage = (spent / budget.limit) * 100;
      const categoryDetails = getCategoryDetails(budget.category);
      
      return {
        ...budget,
        spent,
        percentage,
        categoryDetails,
        isOverBudget: spent > budget.limit
      };
    });
  }, [budgets, categorySpending]);

  const handleAddBudget = () => {
    if (!budgetLimit || parseFloat(budgetLimit) <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    const existingBudget = budgets.find(b => b.category === selectedCategory);
    if (existingBudget) {
      toast.error('Budget already exists for this category');
      return;
    }

    const newBudget = {
      category: selectedCategory,
      limit: parseFloat(budgetLimit),
      walletId
    };

    const allBudgets = storage.getBudgets();
    allBudgets.push(newBudget);
    storage.setBudgets(allBudgets);
    
    toast.success('Budget created successfully');
    onBudgetsUpdated();
    setShowAddBudget(false);
    setBudgetLimit('');
    setSelectedCategory('food-drinks');
  };

  const handleDeleteBudget = (category) => {
    const allBudgets = storage.getBudgets();
    const filtered = allBudgets.filter(b => b.category !== category);
    storage.setBudgets(filtered);
    toast.success('Budget deleted successfully');
    onBudgetsUpdated();
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6" data-testid="budget-manager">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Budget Planner</h3>
          <Button
            data-testid="add-budget-button"
            onClick={() => setShowAddBudget(!showAddBudget)}
            className="bg-white hover:bg-gray-200 text-black text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>

        {showAddBudget && (
          <div className="mb-6 p-4 rounded-lg bg-[#141414] border border-[#2a2a2a] space-y-4 animate-slide-in" data-testid="add-budget-form">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="budget-category-select" className="bg-[#141414] border-[#2a2a2a] text-white focus:border-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-[#2a2a2a] text-white">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value} data-testid={`budget-cat-${cat.value}`}>
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
              <Label htmlFor="budget-limit">Monthly Limit ({currency})</Label>
              <Input
                id="budget-limit"
                data-testid="budget-limit-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="bg-[#141414] border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-white"
              />
            </div>

            <div className="flex gap-3">
              <Button
                data-testid="cancel-budget-button"
                variant="outline"
                onClick={() => {
                  setShowAddBudget(false);
                  setBudgetLimit('');
                }}
                className="flex-1 border-white/20 text-gray-300 hover:bg-[#141414]"
              >
                Cancel
              </Button>
              <Button
                data-testid="save-budget-button"
                onClick={handleAddBudget}
                className="flex-1 bg-white hover:bg-gray-200 text-black text-white"
              >
                Save Budget
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {budgetData.length === 0 ? (
            <div className="text-center py-12" data-testid="no-budgets">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#141414] flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">No budgets set yet</p>
              <p className="text-sm text-gray-500 mt-1">Create budgets to track your spending limits</p>
            </div>
          ) : (
            budgetData.map((budget) => {
              const Icon = budget.categoryDetails.icon;
              
              return (
                <div
                  key={budget.category}
                  data-testid={`budget-item-${budget.category}`}
                  className="p-4 rounded-lg bg-[#141414] border border-[#2a2a2a] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-full"
                        style={{ background: `${budget.categoryDetails.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: budget.categoryDetails.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{budget.categoryDetails.label}</h4>
                        <p className="text-sm text-gray-400">
                          {formatCurrency(budget.spent, currency)} of {formatCurrency(budget.limit, currency)}
                        </p>
                      </div>
                    </div>
                    <Button
                      data-testid={`delete-budget-${budget.category}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.category)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={Math.min(budget.percentage, 100)}
                      className="h-2"
                      data-testid={`budget-progress-${budget.category}`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className={budget.isOverBudget ? 'text-red-400 font-semibold' : 'text-gray-400'}>
                        {budget.percentage.toFixed(1)}% used
                      </span>
                      {budget.isOverBudget && (
                        <span className="flex items-center gap-1 text-red-400" data-testid={`over-budget-${budget.category}`}>
                          <AlertTriangle className="w-4 h-4" />
                          Over budget!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default BudgetManager;
