import React, { useState } from 'react';
import { assignEmployee } from '../../api/employeeApi';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';
import { saveManagerAssignment } from '../../utils/managerAssignmentStorage';

function AssignEmployeeForm({ users, onSuccess }) {
  const [employeeId, setEmployeeId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const employees = users.filter((u) => u.role === 'EMP' && !u.managerId);
  const managers = users.filter((u) => u.role === 'RM');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setValidationErrors({});

    const errors = {};
    if (!employeeId) {
      errors.employeeId = 'Employee is required';
    }
    if (!managerId) {
      errors.managerId = 'Manager is required';
    }
    if (employeeId && managerId && employeeId === managerId) {
      errors.employeeId = 'Employee cannot equal manager';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await assignEmployee(employeeId, managerId);
      if (response.success) {
        const selectedMgr = managers.find((m) => m.id === managerId);
        saveManagerAssignment(
          employeeId,
          managerId,
          selectedMgr ? selectedMgr.name : 'Manager'
        );

        setEmployeeId('');
        setManagerId('');

        if (onSuccess) {
          onSuccess();
        } else {
          setSuccessMsg('Employee assigned to manager successfully.');
          setTimeout(() => setSuccessMsg(''), 1500);
        }
      } else {
        throw new Error(response.message || 'Failed to assign employee');
      }
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'An error occurred while assigning the employee.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ background: 'var(--color-bg-white)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--color-text)' }}>
        Assign Manager to Employee
      </h3>

      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          border: '1px solid #FCA5A5',
          textAlign: 'center',
        }}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
          fontWeight: '600',
        }}
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="emp-select">Select Employee (EMP)</label>
          <select
            id="emp-select"
            className="form-select"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          {validationErrors.employeeId && (
            <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              {validationErrors.employeeId}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="mgr-select">Select Reporting Manager (RM)</label>
          <select
            id="mgr-select"
            className="form-select"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Choose Manager --</option>
            {managers.map((mgr) => (
              <option key={mgr.id} value={mgr.id}>
                {mgr.name} ({mgr.email})
              </option>
            ))}
          </select>
          {validationErrors.managerId && (
            <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              {validationErrors.managerId}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Assigning...' : 'Assign Manager'}
        </button>
      </form>
    </div>
  );
}

export default AssignEmployeeForm;
