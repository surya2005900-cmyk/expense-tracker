import { createContext, useContext, useReducer, useEffect } from 'react';
import { demoTransactions, demoBudgets } from '../data/demoData';

const AppContext = createContext();

const STORAGE_KEY = 'expense-tracker-data';

/**
 * Utility functions for financial calculations
 */
const calculateIncome = (transactions, base = 0) => {
  const transactionIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  return base + transactionIncome;
};

const calculateExpenses = (transactions) => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

const calculateBalance = (income, expenses) => {
  return income - expenses;
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return {
    transactions: demoTransactions,
    budgets: demoBudgets,
    monthlyIncomeBase: 50000,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    nextId: demoTransactions.length + 1,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { ...action.payload, id: state.nextId },
          ...state.transactions,
        ],
        nextId: state.nextId + 1,
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.category]: action.payload.limit },
      };
    case 'SET_MONTHLY_INCOME':
      return {
        ...state,
        monthlyIncomeBase: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'RESET_ALL':
      return {
        transactions: demoTransactions,
        budgets: demoBudgets,
        darkMode: state.darkMode,
        nextId: demoTransactions.length + 1,
      };
    case 'CLEAR_HISTORY':
      return {
        ...state,
        transactions: [],
        nextId: 1,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  // Computed values
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // Filter transactions for the current month
  const monthlyTransactions = state.transactions.filter(
    (t) => t.date && t.date.startsWith(currentMonth)
  );

  // Calculate Total values (All time)
  // Fix: Total Income now includes the monthlyIncomeBase to ensure consistent balance
  const totalIncome = calculateIncome(state.transactions, state.monthlyIncomeBase);
  const totalExpenses = calculateExpenses(state.transactions);
  const balance = calculateBalance(totalIncome, totalExpenses);

  // Calculate Monthly values
  const monthlyIncome = calculateIncome(monthlyTransactions, state.monthlyIncomeBase);
  const monthlyExpenses = calculateExpenses(monthlyTransactions);
  const monthlySavings = calculateBalance(monthlyIncome, monthlyExpenses);

  const value = {
    ...state,
    dispatch,
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    monthlyTransactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
