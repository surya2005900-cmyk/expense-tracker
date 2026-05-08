import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { Clock, Repeat } from 'lucide-react';

export default function RecentActivity() {
  const { transactions } = useApp();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr + 'T00:00:00');
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <div className="recent-activity">
      <div className="section-header">
        <h2 className="section-title">
          <Clock size={18} /> Recent Activity
        </h2>
      </div>
      <div className="recent-list">
        {recent.map((t) => {
          const cat = CATEGORIES[t.category] || CATEGORIES.others;
          const Icon = cat.icon;
          return (
            <div key={t.id} className="recent-item">
              <div className="recent-icon" style={{ backgroundColor: cat.bg, color: cat.color }}>
                <Icon size={16} />
              </div>
              <div className="recent-info">
                <span className="recent-desc">
                  {t.description}
                  {t.recurring && <Repeat size={10} className="recurring-inline" />}
                </span>
                <span className="recent-time">{timeAgo(t.date)}</span>
              </div>
              <span className={`recent-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
