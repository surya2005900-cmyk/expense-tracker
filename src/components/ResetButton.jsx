import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

export default function ResetButton() {
  const { dispatch } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className="utility-btn reset-btn"
        onClick={() => setShowConfirm(true)}
        id="reset-data"
      >
        <RotateCcw size={15} /> Reset Data
      </button>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowConfirm(false)}>
              <X size={18} />
            </button>
            <div className="modal-icon warning">
              <AlertTriangle size={32} />
            </div>
            <h3 className="modal-title">Reset All Data?</h3>
            <p className="modal-desc">
              This will delete all your transactions and budgets and replace them with demo data. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleReset} id="confirm-reset">
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
