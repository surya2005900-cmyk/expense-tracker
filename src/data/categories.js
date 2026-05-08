import {
  Utensils, Plane, ShoppingBag, Receipt, Heart, GraduationCap,
  Film, MoreHorizontal, Wallet, TrendingUp
} from 'lucide-react';

export const CATEGORIES = {
  food: {
    name: 'Food & Dining',
    icon: Utensils,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
  },
  travel: {
    name: 'Travel',
    icon: Plane,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  shopping: {
    name: 'Shopping',
    icon: ShoppingBag,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
  },
  bills: {
    name: 'Bills & Utilities',
    icon: Receipt,
    color: '#eab308',
    bg: 'rgba(234,179,8,0.12)',
  },
  health: {
    name: 'Health',
    icon: Heart,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
  },
  education: {
    name: 'Education',
    icon: GraduationCap,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  entertainment: {
    name: 'Entertainment',
    icon: Film,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
  },
  others: {
    name: 'Others',
    icon: MoreHorizontal,
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.12)',
  },
  income: {
    name: 'Income',
    icon: Wallet,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
  },
};

export const EXPENSE_CATEGORIES = Object.keys(CATEGORIES).filter(k => k !== 'income');

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Amount' },
  { value: 'lowest', label: 'Lowest Amount' },
];
