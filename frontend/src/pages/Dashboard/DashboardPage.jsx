import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';

function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const getDisplayName = () => {
    if (user.name) return user.name;
    if (user.userId && user.userId.length > 8) {
      return `User (${user.userId.substring(0, 8)})`;
    }
    return user.userId || 'Employee';
  };

  // 1. Employee Dashboard (EMP)
  const renderEMPDashboard = () => (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome Back, {getDisplayName()}!</h1>
          <p className="page-subtitle">Here is a summary of your recent reimbursement claims.</p>
        </div>
      </div>

      <div className="stat-cards-grid">
        <StatCard title="Pending Claims" value="2" icon="⏳" />
        <StatCard title="Approved Claims" value="5" icon="✅" />
        <StatCard title="Rejected Claims" value="1" icon="❌" />
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Recent Reimbursements</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CLM-9081</td>
                <td>2026-06-25</td>
                <td>Travel</td>
                <td>Flight tickets to conference</td>
                <td>$350.00</td>
                <td><span className="badge badge-pending">Pending</span></td>
              </tr>
              <tr>
                <td>#CLM-8902</td>
                <td>2026-06-20</td>
                <td>Office Supplies</td>
                <td>Ergonomic keyboard & mouse</td>
                <td>$120.00</td>
                <td><span className="badge badge-approved">Approved</span></td>
              </tr>
              <tr>
                <td>#CLM-8761</td>
                <td>2026-06-15</td>
                <td>Meals</td>
                <td>Client dinner at Tokyo Sushi</td>
                <td>$85.50</td>
                <td><span className="badge badge-approved">Approved</span></td>
              </tr>
              <tr>
                <td>#CLM-8540</td>
                <td>2026-06-10</td>
                <td>Software</td>
                <td>IDE premium license subscription</td>
                <td>$45.00</td>
                <td><span className="badge badge-rejected">Rejected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 2. Reporting Manager Dashboard (RM)
  const renderRMDashboard = () => (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="page-subtitle">Overview of your reporting team and pending reimbursement approvals.</p>
        </div>
      </div>

      <div className="stat-cards-grid">
        <StatCard title="Reporting Employees" value="8" icon="👥" />
        <StatCard title="Pending Approvals" value="3" icon="⏳" />
        <StatCard title="Awaiting Review" value="3" icon="📋" />
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Pending Requests queue</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CLM-9120</td>
                <td>Jane Doe</td>
                <td>2026-06-26</td>
                <td>Travel</td>
                <td>$450.00</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>Reject</button>
                </td>
              </tr>
              <tr>
                <td>#CLM-9099</td>
                <td>Bob Smith</td>
                <td>2026-06-24</td>
                <td>Meals</td>
                <td>$65.00</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>Reject</button>
                </td>
              </tr>
              <tr>
                <td>#CLM-9012</td>
                <td>Alice Cooper</td>
                <td>2026-06-22</td>
                <td>Equipment</td>
                <td>$1,200.00</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 3. Approval Processing Employee Dashboard (APE)
  const renderAPEDashboard = () => (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Finance & Processing Dashboard</h1>
          <p className="page-subtitle">Process manager-approved claims for disbursement and accounting.</p>
        </div>
      </div>

      <div className="stat-cards-grid">
        <StatCard title="RM Approved Claims" value="12" icon="🤝" />
        <StatCard title="Pending Disbursement" value="4" icon="⏳" />
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Claims Ready for Disbursement</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Employee</th>
                <th>Manager Approved By</th>
                <th>Amount</th>
                <th>Disbursement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CLM-8991</td>
                <td>Sarah Jenkins</td>
                <td>Manager Robert</td>
                <td>$520.00</td>
                <td><button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Process Pay</button></td>
              </tr>
              <tr>
                <td>#CLM-8972</td>
                <td>Michael Chang</td>
                <td>Manager Clara</td>
                <td>$175.50</td>
                <td><button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Process Pay</button></td>
              </tr>
              <tr>
                <td>#CLM-8940</td>
                <td>David Miller</td>
                <td>Manager Clara</td>
                <td>$90.00</td>
                <td><button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Process Pay</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 4. CFO Executive Dashboard (CFO)
  const renderCFODashboard = () => (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">CFO Executive Dashboard</h1>
          <p className="page-subtitle">High-level financial oversight, role mapping, and user administration.</p>
        </div>
      </div>

      <div className="stat-cards-grid">
        <StatCard title="Total System Users" value="45" icon="👥" />
        <StatCard title="Employees" value="38" icon="🧑‍💼" />
        <StatCard title="Managers" value="6" icon="👔" />
        <StatCard title="Total Approved Claims" value="27" icon="💵" />
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Administrative Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Role Allocations</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Map employees to Manager, Finance (APE), or CFO roles to govern permissions.</p>
            <a href="/assign-role" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>Go to Role Assignment</a>
          </div>
          <div style={{ padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Manager Mapping</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Bind employees to Reporting Managers (RM) to establish approval chains.</p>
            <a href="/assign-employee" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>Go to Employee Assignment</a>
          </div>
        </div>
      </div>
    </div>
  );

  // Switch based on role
  switch (user.role) {
    case 'EMP':
      return renderEMPDashboard();
    case 'RM':
      return renderRMDashboard();
    case 'APE':
      return renderAPEDashboard();
    case 'CFO':
      return renderCFODashboard();
    default:
      return (
        <div>
          <h1>Welcome to Reimbursement System</h1>
          <p>Your role is being configured. Please contact the administrator.</p>
        </div>
      );
  }
}

export default DashboardPage;
