import React from 'react';

function ApprovalActions({ onApprove, onReject, isProcessing = false }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      {onApprove && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          onClick={onApprove}
          disabled={isProcessing}
        >
          Approve
        </button>
      )}
      {onReject && (
        <button
          type="button"
          className="btn btn-danger"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          onClick={onReject}
          disabled={isProcessing}
        >
          Reject
        </button>
      )}
    </div>
  );
}

export default ApprovalActions;
