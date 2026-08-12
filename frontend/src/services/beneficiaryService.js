import axiosInstance from "../api/axiosInstance";

export const getBeneficiaries = () => axiosInstance.get("/beneficiaries");
export const addBeneficiary = (data) => axiosInstance.post("/beneficiaries", data);
export const deleteBeneficiary = (id) => axiosInstance.delete(`/beneficiaries/${id}`);