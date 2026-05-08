import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Edit3, Check } from 'lucide-react';

function Card({ title, amount, icon: Icon, gradient, trend, onEdit, isEditable }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return (
    <div className={`summary-card ${gradient}`}>
      <div className="summary-card-inner">
        <div className="summary-card-info">
          <div className="summary-card-header">
            <p className="summary-card-label">{title}</p>
            {isEditable && (
              <button className="summary-card-edit" onClick={onEdit}>
                <Edit3 size={12} />
              </button>
            )}
          </div>
          <h3 className="summary-card-amount">{amount < 0 ? `-${formatted}` : formatted}</h3>
          {trend !== undefined && (
            <p className={`summary-card-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% this month
            </p>
          )}
        </div>
        <div className="summary-card-icon">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { balance, monthlyIncome, monthlyExpenses, monthlySavings, monthlyIncomeBase, dispatch } = useApp();
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncomeBase);

  const handleSaveIncome = () => {
    dispatch({ type: 'SET_MONTHLY_INCOME', payload: parseFloat(tempIncome) || 0 });
    setIsEditingIncome(false);
  };

  return (
    <div className="summary-grid">
      <Card
        title="Total Balance"
        amount={balance}
        icon={Wallet}
        gradient="gradient-balance"
      />
      
      {isEditingIncome ? (
        <div className="summary-card gradient-income editing">
          <div className="summary-card-inner">
            <div className="summary-card-info">
              <p className="summary-card-label">Set Monthly Income</p>
              <div className="income-edit-input-wrapper">
                <input
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  className="income-edit-input"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveIncome()}
                />
                <button className="income-save-btn" onClick={handleSaveIncome}>
                  <Check size={16} />
                </button>
              </div>
            </div>
            <div className="summary-card-icon">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      ) : (
        <Card
          title="Monthly Income"
          amount={monthlyIncome}
          icon={TrendingUp}
          gradient="gradient-income"
          isEditable={true}
          onEdit={() => {
            setTempIncome(monthlyIncomeBase);
            setIsEditingIncome(true);
          }}
        />
      )}

      <Card
        title="Monthly Expenses"
        amount={monthlyExpenses}
        icon={TrendingDown}
        gradient="gradient-expense"
      />
      <Card
        title="Monthly Savings"
        amount={monthlySavings}
        icon={PiggyBank}
        gradient="gradient-savings"
      />
    </div>
  );
}
