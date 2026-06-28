import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getEmployees, removeEmployeeAssignment } from '../../api/employeeApi';
import EmployeeTable from '../../components/EmployeeTable/EmployeeTable.jsx';
import AssignRoleForm from '../../components/AssignRoleForm/AssignRoleForm.jsx';
import AssignEmployeeForm from '../../components/AssignEmployeeForm/AssignEmployeeForm.jsx';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal.jsx';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Toast from '../../components/Toast/Toast.jsx';
import { isCFO } from '../../utils/roleUtils';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import { mergeEmployeesWithManagers, removeManagerAssignment } from '../../utils/managerAssignmentStorage';

function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const showToast = useCallback((message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast('');
    }, 3000);
  }, []);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getEmployees();
      if (response.status === 'success' || response.success) {
        const fetchedUsers = response.data.users || [];
        setEmployees(mergeEmployeesWithManagers(fetchedUsers));
      } else {
        throw new Error('Failed to retrieve employees list');
      }
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'Unable to load employees.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAdminSuccess = (message) => {
    showToast(message);
    fetchEmployees();
  };

  const handleRemoveClick = (employeeId, managerId, employeeName, managerName) => {
    setSelectedAssignment({ employeeId, managerId, employeeName, managerName });
    setIsModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedAssignment) return;
    setIsDeleting(true);
    setError('');

    try {
      const { employeeId, managerId } = selectedAssignment;
      const response = await removeEmployeeAssignment(employeeId, managerId);

      if (response.success) {
        removeManagerAssignment(employeeId);
        showToast('Employee assignment removed successfully.');
        setIsModalOpen(false);
        setSelectedAssignment(null);
        fetchEmployees();
      } else {
        throw new Error(response.message || 'Failed to remove assignment');
      }
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'Error occurred while removing assignment.'));
      setIsModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  const isUserCFO = isCFO(user.role);

  return (
    <div>
      <Toast message={successToast} onDismiss={() => setSuccessToast('')} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">
            {isUserCFO
              ? 'View system users, assign roles, and map employees to reporting managers.'
              : 'View corporate employees and team mappings.'}
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
        }}
        >
          ⚠️ Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="card" style={{ background: 'var(--color-bg-white)' }}>
          <LoadingSpinner message="Fetching employees..." />
        </div>
      ) : employees.length === 0 ? (
        <EmptyState
          title="No Employees Found"
          message="No employees found."
        />
      ) : (
        <div className={`employees-grid${isUserCFO ? ' employees-grid--admin' : ''}`}>
          <div className="card" style={{ background: 'var(--color-bg-white)', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
              Corporate Directory
            </h2>
            <EmployeeTable
              employees={employees}
              currentUser={user}
              onRemoveAssignment={handleRemoveClick}
            />
          </div>

          {isUserCFO && (
            <div className="employees-admin-panel">
              <AssignRoleForm
                users={employees}
                onSuccess={() => handleAdminSuccess('Role assigned successfully.')}
              />
              <AssignEmployeeForm
                users={employees}
                onSuccess={() => handleAdminSuccess('Employee assigned to manager successfully.')}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Remove Employee Assignment"
        message="Are you sure you want to remove this employee-manager assignment?"
        confirmText="Remove Assignment"
        cancelText="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAssignment(null);
        }}
        isProcessing={isDeleting}
      />
    </div>
  );
}

export default EmployeesPage;
