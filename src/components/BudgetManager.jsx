import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, EXPENSE_CATEGORIES } from '../data/categories';
import { AlertTriangle, CheckCircle, Edit3, Save } from 'lucide-react';

export default function BudgetManager() {
  const { budgets, monthlyTransactions, dispatch } = useApp();
  const [editingCat, setEditingCat] = useState(null);
  const [editValue, setEditValue] = useState('');

  const getSpent = (category) =>
    monthlyTransactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((s, t) => s + t.amount, 0);

  const startEdit = (cat) => {
    setEditingCat(cat);
    setEditValue(budgets[cat]?.toString() || '0');
  };

  const saveEdit = (cat) => {
    dispatch({
      type: 'SET_BUDGET',
      payload: { category: cat, limit: parseFloat(editValue) || 0 },
    });
    setEditingCat(null);
  };

  return (
    <div className="budget-manager">
      <h2 className="section-title">Monthly Budgets</h2>
      <div className="budget-list">
        {EXPENSE_CATEGORIES.map((key) => {
          const cat = CATEGORIES[key];
          const Icon = cat.icon;
          const limit = budgets[key] || 0;
          const spent = getSpent(key);
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const overBudget = spent > limit && limit > 0;
          const nearLimit = pct >= 80 && !overBudget;

          let barColor = cat.color;
          if (overBudget) barColor = '#ef4444';
          else if (nearLimit) barColor = '#f59e0b';

          return (
            <div key={key} className={`budget-item ${overBudget ? 'over' : ''}`} id={`budget-${key}`}>
              <div className="budget-item-header">
                <div className="budget-item-left">
                  <div className="budget-icon" style={{ backgroundColor: cat.bg, color: cat.color }}>
                    <Icon size={16} />
                  </div>
                  <span className="budget-name">{cat.name}</span>
                </div>
                <div className="budget-item-right">
                  {editingCat === key ? (
                    <div className="budget-edit-inline">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="budget-edit-input"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(key)}
                      />
                      <button className="budget-save-btn" onClick={() => saveEdit(key)}>
                        <Save size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="budget-amounts">
                      <span className="budget-spent">₹{spent.toFixed(0)}</span>
                      <span className="budget-separator">/</span>
                      <span className="budget-limit">₹{limit.toFixed(0)}</span>
                      <button className="budget-edit-btn" onClick={() => startEdit(key)}>
                        <Edit3 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="budget-bar-bg">
                <div
                  className="budget-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
              {overBudget && (
                <div className="budget-alert over">
                  <AlertTriangle size={12} /> Budget exceeded by ₹{(spent - limit).toFixed(0)}
                </div>
              )}
              {nearLimit && (
                <div className="budget-alert near">
                  <AlertTriangle size={12} /> {pct.toFixed(0)}% of budget used
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
