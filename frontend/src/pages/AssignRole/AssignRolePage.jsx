import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../../api/employeeApi';
import AssignRoleForm from '../../components/AssignRoleForm/AssignRoleForm.jsx';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import { getApiErrorMessage } from '../../utils/apiErrorUtils';

function AssignRolePage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getEmployees();
      if (response.status === 'success' || response.success) {
        setUsers(response.data.users || []);
      } else {
        throw new Error('Failed to retrieve user list');
      }
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, 'Unable to load user directories.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = () => {
    navigate('/employees');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Role Assignment</h1>
          <p className="page-subtitle">Map users to corporate roles governing application access permissions.</p>
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
        }}
        >
          ⚠️ Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="card" style={{ background: 'var(--color-bg-white)' }}>
          <LoadingSpinner message="Fetching user list..." />
        </div>
      ) : (
        <AssignRoleForm users={users} onSuccess={handleSuccess} />
      )}
    </div>
  );
}

export default AssignRolePage;
