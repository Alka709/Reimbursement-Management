const STORAGE_KEY = 'reimbursement_mgr_assignments';

export const getManagerAssignments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveManagerAssignment = (employeeId, managerId, managerName) => {
  const assignments = getManagerAssignments();
  assignments[employeeId] = { managerId, managerName };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
};

export const removeManagerAssignment = (employeeId) => {
  const assignments = getManagerAssignments();
  delete assignments[employeeId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
};

export const mergeEmployeesWithManagers = (users) => {
  const localAssignments = getManagerAssignments();

  return users.map((user) => {
    if (user.role !== 'EMP' || !localAssignments[user.id]) {
      return user;
    }

    const { managerId, managerName } = localAssignments[user.id];
    const managerExists = users.find((m) => m.id === managerId && m.role === 'RM');

    if (managerExists) {
      return {
        ...user,
        managerId,
        managerName: managerExists.name || managerName,
      };
    }

    removeManagerAssignment(user.id);
    return user;
  });
};
