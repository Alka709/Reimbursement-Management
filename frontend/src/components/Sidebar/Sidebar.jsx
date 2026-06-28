import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavItems = () => {
    switch (user.role) {
      case 'EMP':
        return [
          { label: 'Dashboard', to: '/dashboard', icon: '📊' },
          { label: 'Create Reimbursement', to: '/create-reimbursement', icon: '✍️' },
          { label: 'My Reimbursements', to: '/reimbursements', icon: '💸' },
        ];
      case 'RM':
        return [
          { label: 'Dashboard', to: '/dashboard', icon: '📊' },
          { label: 'Employees', to: '/employees', icon: '👥' },
          { label: 'Pending Requests', to: '/reimbursements', icon: '⏳' },
        ];
      case 'APE':
        return [
          { label: 'Dashboard', to: '/dashboard', icon: '📊' },
          { label: 'Employees', to: '/employees', icon: '👥' },
          { label: 'Approvals', to: '/reimbursements', icon: '✅' },
        ];
      case 'CFO':
        return [
          { label: 'Dashboard', to: '/dashboard', icon: '📊' },
          { label: 'Employees', to: '/employees', icon: '👥' },
          { label: 'Assign Role', to: '/assign-role', icon: '🔑' },
          { label: 'Assign Employee', to: '/assign-employee', icon: '🤝' },
          { label: 'Approved Requests', to: '/reimbursements', icon: '💵' },
        ];
      default:
        return [];
    }
  };

  const items = getNavItems();

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="sidebar-section-label">Navigation</div>
        <ul className="sidebar-nav">
          {items.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <span className="sidebar-link-icon" style={{ marginRight: '8px', fontSize: '1.1rem' }}>
                  {item.icon}
                </span>
                <span className="sidebar-link-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Fixed at Bottom */}
      <div style={{ padding: '0 0.75rem', marginTop: 'auto', marginBottom: '1rem' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            width: '100%',
            background: 'rgba(220, 38, 38, 0.15)',
            color: '#FEE2E2',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            transition: 'background 0.2s, color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.3)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
            e.currentTarget.style.color = '#FEE2E2';
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

