import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, EXPENSE_CATEGORIES, SORT_OPTIONS } from '../data/categories';
import { Search, SlidersHorizontal, Edit3, Trash2, Repeat, ArrowUpDown, Filter, Inbox } from 'lucide-react';

export default function TransactionList({ onEdit }) {
  const { transactions, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter
  let filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchCategory && matchType;
  });

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.date) - new Date(a.date);
      case 'oldest': return new Date(a.date) - new Date(b.date);
      case 'highest': return b.amount - a.amount;
      case 'lowest': return a.amount - b.amount;
      default: return 0;
    }
  });

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="transaction-list-wrapper">
      <div className="transaction-list-header">
        <h2 className="section-title">Transactions</h2>
        <span className="transaction-count">{filtered.length} items</span>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            id="search-transactions"
          />
        </div>
        <button
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          id="toggle-filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-row">
          <div className="filter-group">
            <label><Filter size={12} /> Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
              id="filter-category"
            >
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map((key) => (
                <option key={key} value={key}>{CATEGORIES[key].name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label><Filter size={12} /> Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
              id="filter-type"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="filter-group">
            <label><ArrowUpDown size={12} /> Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
              id="sort-transactions"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Transaction Items */}
      <div className="transaction-items">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} />
            <p>No transactions found</p>
            <span>Try adjusting your filters or add a new transaction</span>
          </div>
        ) : (
          filtered.map((t) => {
            const cat = CATEGORIES[t.category] || CATEGORIES.others;
            const Icon = cat.icon;
            return (
              <div key={t.id} className="transaction-item" id={`transaction-${t.id}`}>
                <div className="transaction-item-left">
                  <div
                    className="transaction-icon"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="transaction-details">
                    <p className="transaction-desc">
                      {t.description}
                      {t.recurring && (
                        <span className="recurring-badge" title="Recurring">
                          <Repeat size={11} />
                        </span>
                      )}
                    </p>
                    <span className="transaction-meta">
                      {cat.name} • {formatDate(t.date)}
                    </span>
                  </div>
                </div>
                <div className="transaction-item-right">
                  <span className={`transaction-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <div className="transaction-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(t)}
                      title="Edit"
                      id={`edit-${t.id}`}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(t.id)}
                      title="Delete"
                      id={`delete-${t.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
