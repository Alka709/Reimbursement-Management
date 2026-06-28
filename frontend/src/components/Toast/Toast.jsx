import React from 'react';

function Toast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        padding: '0.8rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 2000,
        fontWeight: '600',
        animation: 'toastSlideIn 0.3s ease-out',
      }}
    >
      🌿 {message}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            marginLeft: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: '700',
          }}
        >
          ×
        </button>
      )}
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Toast;
