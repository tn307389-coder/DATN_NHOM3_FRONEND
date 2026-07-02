import api from "./api";

export const getAllTaiKhoan = () => api.get("/tai-khoan");

export const addTaiKhoan = (data) => api.post("/tai-khoan", data);

export const updateTaiKhoan = (id, data) =>
  api.put(`/tai-khoan/${id}`, data);

export const deleteTaiKhoan = (id) =>
  api.delete(`/tai-khoan/${id}`);