import axiosInstance from "../api/axiosInstance";

export const getAllUsers = () => axiosInstance.get("/admin/users");
export const getUserDetails = (id) => axiosInstance.get(`/admin/users/${id}/details`);
export const deleteUser = (id) => axiosInstance.delete(`/admin/users/${id}`);
export const lockUser = (id) => axiosInstance.put(`/admin/users/${id}/lock`);
export const unlockUser = (id) => axiosInstance.put(`/admin/users/${id}/unlock`);

export const getAllAccounts = () => axiosInstance.get("/admin/accounts");
export const deleteAccount = (id) => axiosInstance.delete(`/admin/accounts/${id}`);

// Loan approvals
export const getAllLoans = () => axiosInstance.get("/admin/loans");
export const approveLoan = (id) => axiosInstance.put(`/admin/loans/${id}/approve`);
export const rejectLoan = (id, rejectionReason) =>
  axiosInstance.put(`/admin/loans/${id}/reject`, { rejectionReason });