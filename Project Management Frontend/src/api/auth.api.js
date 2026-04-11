import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const logoutUser = () => {
  return axiosInstance.post("/auth/logout");
};

export const getCurrentUser = () => {
  return axiosInstance.get("/auth/current-user");
};

export const changePassword = (data) => {
  return axiosInstance.post("/auth/change-password", data);
};

export const refreshToken = () => {
  return axiosInstance.post("/auth/refresh-token");
};

export const verifyEmail = (verificationToken) => {
  return axiosInstance.get(`/auth/verify-email/${verificationToken}`);
};

export const forgotPassword = (data) => {
  return axiosInstance.post("/auth/forgot-password", data);
};

export const resetPassword = (resetToken, data) => {
  return axiosInstance.post(`/auth/reset-password/${resetToken}`, data);
};

export const resendEmailVerification = () => {
  return axiosInstance.post("/auth/resend-email-verification");
};