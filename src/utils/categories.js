import {
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Heart,
  Smartphone,
  Plane,
  GraduationCap,
  Utensils,
  Dumbbell,
  Gift,
  Briefcase,
  Zap
} from 'lucide-react';

export const CATEGORIES = [
  {
    value: 'food-drinks',
    label: 'Food & Drinks',
    icon: Coffee,
    color: '#f97316'
  },
  {
    value: 'shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: '#ec4899'
  },
  {
    value: 'housing',
    label: 'Housing',
    icon: Home,
    color: '#8b5cf6'
  },
  {
    value: 'transportation',
    label: 'Transportation',
    icon: Car,
    color: '#3b82f6'
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    icon: Heart,
    color: '#ef4444'
  },
  {
    value: 'entertainment',
    label: 'Entertainment',
    icon: Smartphone,
    color: '#06b6d4'
  },
  {
    value: 'travel',
    label: 'Travel',
    icon: Plane,
    color: '#14b8a6'
  },
  {
    value: 'education',
    label: 'Education',
    icon: GraduationCap,
    color: '#f59e0b'
  },
  {
    value: 'dining',
    label: 'Dining Out',
    icon: Utensils,
    color: '#10b981'
  },
  {
    value: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    color: '#84cc16'
  },
  {
    value: 'gifts',
    label: 'Gifts & Donations',
    icon: Gift,
    color: '#a855f7'
  },
  {
    value: 'business',
    label: 'Business',
    icon: Briefcase,
    color: '#6366f1'
  },
  {
    value: 'utilities',
    label: 'Utilities',
    icon: Zap,
    color: '#eab308'
  }
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Digital Wallet',
  'Other'
];

export const RECURRENCE_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

export const getCategoryDetails = (categoryValue) => {
  return CATEGORIES.find(cat => cat.value === categoryValue) || CATEGORIES[0];
};
