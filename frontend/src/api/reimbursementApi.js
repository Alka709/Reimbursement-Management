import axiosInstance from './axios';

export const createReimbursement = async (reimbursementData) => {
  const response = await axiosInstance.post('/rest/reimbursements', reimbursementData);
  return response.data;
};

export const getReimbursements = async () => {
  const response = await axiosInstance.get('/rest/reimbursements');
  return response.data;
};

export const updateReimbursementStatus = async (reimbursementId, status) => {
  const response = await axiosInstance.patch('/rest/reimbursements', { reimbursementId, status });
  return response.data;
};

export const getEmployeeReimbursements = async (userId) => {
  const response = await axiosInstance.get(`/rest/reimbursements/${userId}`);
  return response.data;
};
