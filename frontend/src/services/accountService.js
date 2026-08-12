import axiosInstance from "../api/axiosInstance";

export const getAccounts = () => axiosInstance.get("/accounts");
export const getAccountById = (id) => axiosInstance.get(`/accounts/${id}`);
export const createAccount = (data) => axiosInstance.post("/accounts", data);