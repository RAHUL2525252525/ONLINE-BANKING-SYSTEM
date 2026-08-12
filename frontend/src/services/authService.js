import axiosInstance from "../api/axiosInstance";

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const forgotPassword = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

export const resetPassword = (token, newPassword) => {
  return axiosInstance.post("/auth/reset-password", { token, newPassword });
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};