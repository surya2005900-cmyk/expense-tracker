import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function ClearHistoryButton() {
  const { dispatch, transactions } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  if (transactions.length === 0) return null;

  const handleClear = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className="utility-btn delete-all-btn"
        onClick={() => setShowConfirm(true)}
        id="clear-history"
      >
        <Trash2 size={15} /> Clear History
      </button>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowConfirm(false)}>
              <X size={18} />
            </button>
            <div className="modal-icon danger">
              <Trash2 size={32} />
            </div>
            <h3 className="modal-title">Clear All History?</h3>
            <p className="modal-desc">
              This will permanently delete all your transactions. Budgets and settings will remain. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm-danger" onClick={handleClear} id="confirm-clear">
                Delete All Transactions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
