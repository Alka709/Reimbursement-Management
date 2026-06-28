import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Generate a premium styling for each role's badge
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'EMP':
        return { backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' };
      case 'RM':
        return { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' };
      case 'APE':
        return { backgroundColor: '#F3E8FF', color: '#6B21A8', border: '1px solid #E9D5FF' };
      case 'CFO':
        return { backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' };
    }
  };

  // Clean fallback for display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.name) return user.name;
    // If it's a UUID, display a friendly short ID representation
    if (user.userId && user.userId.length > 8) {
      return `User (${user.userId.substring(0, 8)})`;
    }
    return user.userId || 'User';
  };

  return (
    <nav className="navbar" style={{ justifyContent: 'space-between' }}>
      <span className="navbar-brand">Reimbursement Management</span>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
            {getDisplayName()}
            <span 
              className="badge" 
              style={{ 
                marginLeft: '0.5rem', 
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                ...getRoleBadgeStyle(user.role) 
              }}
            >
              {user.role}
            </span>
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;


