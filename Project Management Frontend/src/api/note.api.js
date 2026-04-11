import axiosInstance from "./axiosInstance";

export const getAllNotes = (projectId) => {
  return axiosInstance.get(`/notes/${projectId}`);
};

export const createNote = (projectId, data) => {
  return axiosInstance.post(`/notes/${projectId}`, data);
};

export const getNoteById = (projectId, noteId) => {
  return axiosInstance.get(`/notes/${projectId}/n/${noteId}`);
};

export const updateNote = (projectId, noteId, data) => {
  return axiosInstance.put(`/notes/${projectId}/n/${noteId}`, data);
};

export const deleteNote = (projectId, noteId) => {
  return axiosInstance.delete(`/notes/${projectId}/n/${noteId}`);
};