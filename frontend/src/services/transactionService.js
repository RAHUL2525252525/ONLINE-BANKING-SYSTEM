import axiosInstance from "../api/axiosInstance";

export const getTransactionHistory = (accountNumber) =>
  axiosInstance.get(`/transactions/history/${accountNumber}`);

export const transferFunds = (data) => axiosInstance.post("/transactions/transfer", data);

export const depositFunds = (data) => axiosInstance.post("/transactions/deposit", data);

export const withdrawFunds = (data) => axiosInstance.post("/transactions/withdraw", data);