import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge.jsx';
import ApprovalActions from '../ApprovalActions/ApprovalActions.jsx';

function ReimbursementTable({ 
  reimbursements, 
  showEmployeeName = false,
  showDescription = true,
  showAllStatuses = true,
  showActions = false,
  onApprove, 
  onReject, 
  isProcessingId 
}) {
  if (!reimbursements || reimbursements.length === 0) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `$${num.toFixed(2)}`;
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {showEmployeeName && <th>Employee Name</th>}
            <th>Title</th>
            {showDescription && <th>Description</th>}
            <th>Amount</th>
            <th>Date</th>
            {!showAllStatuses && <th>RM Status</th>}
            {showAllStatuses && (
              <>
                <th>RM Status</th>
                <th>APE Status</th>
                <th>Final Status</th>
              </>
            )}
            {showActions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reimbursements.map((item) => (
            <tr key={item.id}>
              {showEmployeeName && (
                <td style={{ fontWeight: '500', color: 'var(--color-text)' }}>
                  {item.employeeName || `User (${item.employeeId.substring(0,8)})`}
                </td>
              )}
              <td style={{ fontWeight: '600', color: 'var(--color-text)' }}>{item.title}</td>
              {showDescription && <td>{item.description}</td>}
              <td style={{ fontWeight: '600' }}>{formatAmount(item.amount)}</td>
              <td>{formatDate(item.createdAt)}</td>
              
              {!showAllStatuses && (
                <td><StatusBadge status={item.rmApproval} /></td>
              )}

              {showAllStatuses && (
                <>
                  <td><StatusBadge status={item.rmApproval} /></td>
                  <td><StatusBadge status={item.apeApproval} /></td>
                  <td><StatusBadge status={item.finalStatus} /></td>
                </>
              )}

              {showActions && (
                <td style={{ textAlign: 'right' }}>
                  <ApprovalActions 
                    onApprove={onApprove ? () => onApprove(item.id) : null}
                    onReject={onReject ? () => onReject(item.id) : null}
                    isProcessing={isProcessingId === item.id}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReimbursementTable;
