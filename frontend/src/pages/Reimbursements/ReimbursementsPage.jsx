import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  getReimbursements, 
  getEmployeeReimbursements, 
  updateReimbursementStatus 
} from '../../api/reimbursementApi';
import { getEmployees } from '../../api/employeeApi';
import ReimbursementTable from '../../components/ReimbursementTable/ReimbursementTable.jsx';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal.jsx';
import Toast from '../../components/Toast/Toast.jsx';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import { isEMP, isRM, isAPE, isCFO } from '../../utils/roleUtils';

function ReimbursementsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const subordinateId = searchParams.get('userId');

  const [reimbursements, setReimbursements] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // { id, status }

  const showToast = useCallback((message) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(''), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      let fetchedReimbursements = [];
      let fetchedEmployees = {};

      // 1. Fetch Reimbursements
      if (subordinateId && isRM(user?.role)) {
        const res = await getEmployeeReimbursements(subordinateId);
        if (res.status === 'success') {
          fetchedReimbursements = res.data.reimbursements || [];
        }
      } else {
        const res = await getReimbursements();
        if (res.status === 'success') {
          fetchedReimbursements = res.data.reimbursements || [];
        }
      }

      // 2. Fetch Employees for mapping (if not EMP)
      if (!isEMP(user?.role)) {
        try {
          const empRes = await getEmployees();
          if (empRes.success || empRes.status === 'success') {
            const users = empRes.data.users || [];
            users.forEach((u) => {
              fetchedEmployees[u.id] = u.name;
            });
          }
        } catch (e) {
          console.warn('Failed to fetch employees mapping', e);
        }
      }

      setEmployeesMap(fetchedEmployees);
      setReimbursements(fetchedReimbursements);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'Unable to load reimbursements.'));
    } finally {
      setIsLoading(false);
    }
  }, [user, subordinateId]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

  const reimbursementsWithNames = useMemo(() => {
    return reimbursements.map((r) => ({
      ...r,
      employeeName: employeesMap[r.employeeId] || '',
    }));
  }, [reimbursements, employeesMap]);

  const handleActionClick = (id, status) => {
    setSelectedAction({ id, status });
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAction) return;
    setIsProcessing(true);
    setError('');

    try {
      const response = await updateReimbursementStatus(selectedAction.id, selectedAction.status);
      if (response.status === 'success' || response.success) {
        showToast(`Reimbursement successfully ${selectedAction.status.toLowerCase()}.`);
        setIsModalOpen(false);
        setSelectedAction(null);
        fetchData(); // Refresh list
      } else {
        throw new Error('Action failed');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update reimbursement status.'));
      setIsModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  const isPendingQueue = !subordinateId;
  const showEmployeeName = !isEMP(user.role);
  const showDescription = !isAPE(user.role);
  const showAllStatuses = subordinateId || !isRM(user.role);
  const showActions = (isRM(user.role) && isPendingQueue) || isAPE(user.role) || isCFO(user.role);

  return (
    <div>
      <Toast message={successToast} onDismiss={() => setSuccessToast('')} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {subordinateId 
              ? 'Subordinate History' 
              : isEMP(user.role) 
                ? 'My Reimbursements' 
                : isRM(user.role) 
                  ? 'Pending Requests' 
                  : isAPE(user.role) 
                    ? 'Approvals' 
                    : 'Approved Requests'}
          </h1>
          <p className="page-subtitle">
            {subordinateId 
              ? 'Viewing reimbursement history for a subordinate.' 
              : 'Manage and review corporate expenses.'}
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          border: '1px solid #FCA5A5',
          fontWeight: '500',
        }}>
          ⚠️ Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="card" style={{ background: 'var(--color-bg-white)' }}>
          <LoadingSpinner message="Fetching reimbursements..." />
        </div>
      ) : reimbursements.length === 0 ? (
        <EmptyState
          title="No Reimbursements Found"
          message="There are currently no reimbursement requests to display."
        />
      ) : (
        <div className="card" style={{ background: 'var(--color-bg-white)', padding: '1.5rem' }}>
          <ReimbursementTable
            reimbursements={reimbursementsWithNames}
            showEmployeeName={showEmployeeName}
            showDescription={showDescription}
            showAllStatuses={showAllStatuses}
            showActions={showActions}
            onApprove={(id) => handleActionClick(id, 'APPROVED')}
            onReject={(id) => handleActionClick(id, 'REJECTED')}
            isProcessingId={isProcessing ? selectedAction?.id : null}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title={`Confirm ${selectedAction?.status === 'APPROVED' ? 'Approval' : 'Rejection'}`}
        message={`Are you sure you want to ${selectedAction?.status === 'APPROVED' ? 'approve' : 'reject'} this reimbursement request?`}
        confirmText={selectedAction?.status === 'APPROVED' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAction(null);
        }}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default ReimbursementsPage;
