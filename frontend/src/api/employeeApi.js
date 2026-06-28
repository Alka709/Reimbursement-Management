import axiosInstance from './axios';

export const getEmployees = async () => {
  const response = await axiosInstance.get('/rest/employees');
  return response.data;
};

export const assignEmployee = async (employeeId, managerId) => {
  const response = await axiosInstance.post('/rest/employees/assign', { employeeId, managerId });
  return response.data;
};

export const removeEmployeeAssignment = async (employeeId, managerId) => {
  // Axios DELETE requests pass the body payload inside the config.data parameter
  const response = await axiosInstance.delete('/rest/employees/assign', {
    data: { employeeId, managerId }
  });
  return response.data;
};
