import React, { useState, useMemo } from 'react';
import { assignRole } from '../../api/roleApi';
import { ROLES } from '../../utils/roleUtils';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

const ROLE_OPTIONS = [
  { value: ROLES.EMP, label: 'EMP (Employee)' },
  { value: ROLES.RM, label: 'RM (Reporting Manager)' },
  { value: ROLES.APE, label: 'APE (Finance / Processing)' },
  { value: ROLES.CFO, label: 'CFO (Executive Admin)' },
];

function AssignRoleForm({ users, onSuccess }) {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const selectedUser = users.find((u) => u.id === userId);

  const validRoleOptions = useMemo(() => {
    if (!selectedUser) {
      return ROLE_OPTIONS;
    }
    return ROLE_OPTIONS.filter((option) => option.value !== selectedUser.role);
  }, [selectedUser]);

  const handleUserChange = (nextUserId) => {
    setUserId(nextUserId);
    const user = users.find((u) => u.id === nextUserId);
    if (user && role === user.role) {
      setRole('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setValidationErrors({});

    const errors = {};
    if (!userId) {
      errors.userId = 'Please select a user';
    }
    if (!role) {
      errors.role = 'Please select a role';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await assignRole(userId, role);
      if (response.success) {
        setUserId('');
        setRole('');

        if (onSuccess) {
          onSuccess();
        } else {
          setSuccessMsg('Role assigned successfully.');
          setTimeout(() => setSuccessMsg(''), 1500);
        }
      } else {
        throw new Error(response.message || 'Failed to assign role');
      }
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'An error occurred while assigning the role.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ background: 'var(--color-bg-white)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--color-text)' }}>
        Assign User Role
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
          <label className="form-label" htmlFor="role-user-select">Select User</label>
          <select
            id="role-user-select"
            className="form-select"
            value={userId}
            onChange={(e) => handleUserChange(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Choose User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email}) - {u.role}
              </option>
            ))}
          </select>
          {validationErrors.userId && (
            <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              {validationErrors.userId}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="role-select">Select New Role</label>
          <select
            id="role-select"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSubmitting || !userId}
          >
            <option value="">-- Choose Role --</option>
            {validRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {validationErrors.role && (
            <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              {validationErrors.role}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating Role...' : 'Assign Role'}
        </button>
      </form>
    </div>
  );
}

export default AssignRoleForm;
