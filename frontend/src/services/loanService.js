import axiosInstance from "../api/axiosInstance";

export const getLoans = () => axiosInstance.get("/loans");
export const applyForLoan = (data) => axiosInstance.post("/loans", data);