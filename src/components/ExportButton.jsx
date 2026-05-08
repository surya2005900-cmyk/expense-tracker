import { useApp } from '../context/AppContext';
import { Download } from 'lucide-react';

export default function ExportButton() {
  const { transactions } = useApp();

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Recurring'];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.category,
      `"${t.description}"`,
      t.amount.toFixed(2),
      t.recurring ? 'Yes' : 'No',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="utility-btn export-btn" onClick={exportCSV} id="export-csv">
      <Download size={15} /> Export CSV
    </button>
  );
}
