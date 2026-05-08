import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, EXPENSE_CATEGORIES } from '../data/categories';
import { Plus, X, Repeat, Calendar, IndianRupee, Tag, FileText, TrendingDown, TrendingUp } from 'lucide-react';

const emptyForm = {
  type: 'expense',
  amount: '',
  category: 'food',
  description: '',
  date: new Date().toISOString().split('T')[0],
  recurring: false,
};

export default function TransactionForm({ editingTransaction, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        description: editingTransaction.description,
        date: editingTransaction.date,
        recurring: editingTransaction.recurring || false,
      });
      setIsOpen(true);
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      category: form.type === 'income' ? 'income' : form.category,
    };

    if (editingTransaction) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: { ...payload, id: editingTransaction.id } });
      onClose?.();
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload });
    }

    setForm(emptyForm);
    if (!editingTransaction) setIsOpen(false);
  };

  const handleQuickAdd = (category) => {
    setForm((f) => ({ ...f, category, type: 'expense' }));
    setIsOpen(true);
  };

  const toggleOpen = () => {
    if (editingTransaction) {
      onClose?.();
    } else {
      setIsOpen(!isOpen);
      setForm(emptyForm);
    }
  };

  return (
    <div className="transaction-form-wrapper">
      {/* Quick Add Buttons */}
      {!isOpen && !editingTransaction && (
        <div className="quick-add-section">
          <h3 className="section-subtitle">Quick Add</h3>
          <div className="quick-add-grid">
            {EXPENSE_CATEGORIES.map((key) => {
              const cat = CATEGORIES[key];
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  className="quick-add-btn"
                  onClick={() => handleQuickAdd(key)}
                  style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
                >
                  <Icon size={16} />
                  <span>{cat.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button className="add-transaction-btn" onClick={toggleOpen} id="add-transaction-toggle">
        {isOpen || editingTransaction ? (
          <>
            <X size={18} /> Cancel
          </>
        ) : (
          <>
            <Plus size={18} /> Add Transaction
          </>
        )}
      </button>

      {(isOpen || editingTransaction) && (
        <form onSubmit={handleSubmit} className="transaction-form" id="transaction-form">
          {/* Type Toggle */}
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'expense' }))}
            >
              <TrendingDown size={16} /> Expense
            </button>
            <button
              type="button"
              className={`type-btn ${form.type === 'income' ? 'active income' : ''}`}
              onClick={() => setForm((f) => ({ ...f, type: 'income' }))}
            >
              <TrendingUp size={16} /> Income
            </button>
          </div>

          <div className="form-grid">
            {/* Amount */}
            <div className="form-group">
              <label className="form-label">
                <IndianRupee size={14} /> Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="form-input"
                id="transaction-amount"
                required
              />
            </div>

            {/* Category */}
            {form.type === 'expense' && (
              <div className="form-group">
                <label className="form-label">
                  <Tag size={14} /> Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="form-input"
                  id="transaction-category"
                >
                  {EXPENSE_CATEGORIES.map((key) => (
                    <option key={key} value={key}>
                      {CATEGORIES[key].name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={14} /> Description
              </label>
              <input
                type="text"
                placeholder="What was this for?"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="form-input"
                id="transaction-description"
                required
              />
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="form-input"
                id="transaction-date"
              />
            </div>
          </div>

          {/* Recurring */}
          <label className="recurring-checkbox" id="recurring-label">
            <input
              type="checkbox"
              checked={form.recurring}
              onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.checked }))}
            />
            <Repeat size={14} />
            <span>Recurring transaction</span>
          </label>

          <button type="submit" className="submit-btn" id="submit-transaction">
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      )}
    </div>
  );
}

