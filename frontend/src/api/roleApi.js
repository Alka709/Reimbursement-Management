import axiosInstance from './axios';

export const assignRole = async (userId, role) => {
  const response = await axiosInstance.post('/rest/roles/assign', { userId, role });
  return response.data;
};
