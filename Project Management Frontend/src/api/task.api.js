import axiosInstance from "./axiosInstance";

// task CRUD
export const getAllTasks = (projectId) => {
  return axiosInstance.get(`/tasks/${projectId}`);
};

export const createTask = (projectId, data) => {
  return axiosInstance.post(`/tasks/${projectId}`, data);
};

export const getTaskById = (projectId, taskId) => {
  return axiosInstance.get(`/tasks/${projectId}/t/${taskId}`);
};

export const updateTask = (projectId, taskId, data) => {
  return axiosInstance.put(`/tasks/${projectId}/t/${taskId}`, data);
};

export const deleteTask = (projectId, taskId) => {
  return axiosInstance.delete(`/tasks/${projectId}/t/${taskId}`);
};

// subtask CRUD
export const createSubTask = (projectId, taskId, data) => {
  return axiosInstance.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data);
};

export const updateSubTask = (projectId, subTaskId, data) => {
  return axiosInstance.put(`/tasks/${projectId}/st/${subTaskId}`, data);
};

export const deleteSubTask = (projectId, subTaskId) => {
  return axiosInstance.delete(`/tasks/${projectId}/st/${subTaskId}`);
};

// file attachment — naya task banate waqt
export const createTaskWithAttachment = (projectId, formData) => {
  return axiosInstance.post(`/tasks/${projectId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// existing task mein file upload karne ke liye
export const uploadTaskAttachment = (projectId, taskId, formData) => {
  return axiosInstance.put(`/tasks/${projectId}/t/${taskId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};