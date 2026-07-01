import React from 'react';

function StatusBadge({ status }) {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case 'APPROVED':
      return <span className="badge badge-approved">Approved</span>;
    case 'REJECTED':
      return <span className="badge badge-rejected">Rejected</span>;
    case 'PENDING':
    default:
      return <span className="badge badge-pending">Pending</span>;
  }
}

export default StatusBadge;
