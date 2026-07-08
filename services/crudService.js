import api from "./api";

export const getAll = (endpoint) => {
  return api.get(endpoint);
};

export const getById = (endpoint, id) => {
  return api.get(`${endpoint}/${id}`);
};

export const createData = (endpoint, data) => {
  return api.post(endpoint, data);
};

export const updateData = (endpoint, id, data) => {
  return api.put(`${endpoint}/${id}`, data);
};

export const deleteData = (endpoint, id) => {
  return api.delete(`${endpoint}/${id}`);
};