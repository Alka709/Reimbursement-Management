import React from 'react';

function ConfirmationModal({ isOpen, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isProcessing = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(20, 83, 45, 0.4)', // Dark forest green tint backdrop
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="card" style={{
        maxWidth: '440px',
        width: '100%',
        background: 'var(--color-bg-white)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
        animation: 'modalFadeIn 0.2s ease-out'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isProcessing}
            style={{ padding: '0.5rem 1rem' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isProcessing}
            style={{ padding: '0.5rem 1rem' }}
          >
            {isProcessing ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default ConfirmationModal;
