import { useState } from 'react';
import { useApp } from './context/AppContext';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';
import Charts from './components/Charts';
import RecentActivity from './components/RecentActivity';
import ExportButton from './components/ExportButton';
import ResetButton from './components/ResetButton';
import ClearHistoryButton from './components/ClearHistoryButton';
import {
  Sun, Moon, LayoutDashboard, Menu, X,
  BarChart3, ListOrdered, Target, PlusCircle, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ListOrdered },
  { id: 'budgets', label: 'Budgets', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function App() {
  const { darkMode, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('transactions');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <SummaryCards />
            <div className="overview-grid">
              <RecentActivity />
              <Charts />
            </div>
          </>
        );
      case 'transactions':
        return (
          <>
            <TransactionForm
              editingTransaction={editingTransaction}
              onClose={() => setEditingTransaction(null)}
            />
            <TransactionList onEdit={handleEdit} />
          </>
        );
      case 'budgets':
        return <BudgetManager />;
      case 'analytics':
        return <Charts />;
      default:
        return null;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)} id="mobile-menu">
          <Menu size={22} />
        </button>
        <h1 className="mobile-logo">
          <span className="logo-icon">💰</span> ExpenseTracker
        </h1>
        <button
          className="dark-mode-btn"
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          id="dark-mode-toggle-mobile"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <span className="logo-icon">💰</span>
            <span>ExpenseTracker</span>
          </h1>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                id={`nav-${item.id}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="dark-mode-btn sidebar-dark-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            id="dark-mode-toggle"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="sidebar-utility-btns">
            <ExportButton />
            <ResetButton />
            <ClearHistoryButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2 className="page-title">
            {NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Overview'}
          </h2>
          <p className="page-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="content-body">{renderContent()}</div>
      </main>
    </div>
  );
}
