import React from 'react';
import { isCFO, isRM } from '../../utils/roleUtils';

function EmployeeTable({ employees, currentUser, onRemoveAssignment }) {
  if (!employees || employees.length === 0) {
    return null;
  }

  const getManagerDisplay = (employee) => {
    if (employee.role !== 'EMP') {
      return '—';
    }

    if (isRM(currentUser.role)) {
      return currentUser.name || 'You';
    }

    return employee.managerName || 'Not assigned';
  };

  const showActions = isCFO(currentUser.role);

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Manager</th>
            {showActions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td style={{ fontWeight: '600', color: 'var(--color-text)' }}>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    backgroundColor: emp.role === 'CFO' ? '#FEF3C7' : emp.role === 'RM' ? '#E0F2FE' : emp.role === 'APE' ? '#F3E8FF' : '#DCFCE7',
                    color: emp.role === 'CFO' ? '#B45309' : emp.role === 'RM' ? '#0369A1' : emp.role === 'APE' ? '#6B21A8' : '#15803D',
                    border: `1px solid ${emp.role === 'CFO' ? '#FDE68A' : emp.role === 'RM' ? '#BAE6FD' : emp.role === 'APE' ? '#E9D5FF' : '#BBF7D0'}`,
                  }}
                >
                  {emp.role}
                </span>
              </td>
              <td>{getManagerDisplay(emp)}</td>
              {showActions && (
                <td style={{ textAlign: 'right' }}>
                  {emp.role === 'EMP' && emp.managerId ? (
                    <button
                      type="button"
                      onClick={() => onRemoveAssignment(emp.id, emp.managerId, emp.name, emp.managerName)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Remove
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      {emp.role === 'EMP' ? 'No assignment' : '—'}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
