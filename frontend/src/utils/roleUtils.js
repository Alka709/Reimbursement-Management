export const ROLES = {
  EMP: 'EMP',
  RM: 'RM',
  APE: 'APE',
  CFO: 'CFO'
};

// Map roles to their allowed route paths
export const ROLE_PERMISSIONS = {
  [ROLES.EMP]: [
    '/dashboard',
    '/create-reimbursement',
    '/reimbursements'
  ],
  [ROLES.RM]: [
    '/dashboard',
    '/employees',
    '/reimbursements'
  ],
  [ROLES.APE]: [
    '/dashboard',
    '/employees',
    '/reimbursements'
  ],
  [ROLES.CFO]: [
    '/dashboard',
    '/employees',
    '/assign-role',
    '/assign-employee',
    '/reimbursements'
  ]
};

// Centralized helpers for clean role checks
export const isEMP = (role) => role === ROLES.EMP;
export const isRM = (role) => role === ROLES.RM;
export const isAPE = (role) => role === ROLES.APE;
export const isCFO = (role) => role === ROLES.CFO;

// Navigation check to verify if a role has access to a path
export const isRouteAllowed = (role, path) => {
  if (!role) return false;
  const allowedPaths = ROLE_PERMISSIONS[role] || [];
  return allowedPaths.some(allowedPath => {
    if (allowedPath === '/') return path === '/';
    return path.startsWith(allowedPath);
  });
};
