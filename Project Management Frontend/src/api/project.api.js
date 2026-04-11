import axiosInstance from "./axiosInstance";

// project CRUD
export const getAllProjects = () => {
  return axiosInstance.get("/projects");
};

export const createProject = (data) => {
  return axiosInstance.post("/projects", data);
};

export const getProjectById = (projectId) => {
  return axiosInstance.get(`/projects/${projectId}`);
};

export const updateProject = (projectId, data) => {
  return axiosInstance.put(`/projects/${projectId}`, data);
};

export const deleteProject = (projectId) => {
  return axiosInstance.delete(`/projects/${projectId}`);
};

// member management
export const getProjectMembers = (projectId) => {
  return axiosInstance.get(`/projects/${projectId}/members`);
};

export const addProjectMember = (projectId, data) => {
  return axiosInstance.post(`/projects/${projectId}/members`, data);
};

export const updateMemberRole = (projectId, userId, data) => {
  return axiosInstance.put(`/projects/${projectId}/members/${userId}`, data);
};

export const removeProjectMember = (projectId, userId) => {
  return axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
};