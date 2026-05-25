import axiosClient from "../axiosClient";

export const categoryApi = {
  getCategories: () => axiosClient.get("/category"),

  createCategories: (data) => axiosClient.post("/category", data),

  updateCategories: (id, data) => axiosClient.put(`/category/${id}`, data),

  deleteCategories: (id) => axiosClient.delete(`/category/${id}`),
};
