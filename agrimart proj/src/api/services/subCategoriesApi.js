import axiosClient from "../axiosClient";

export const subCategoriesApi = {
  getSubCategories: () => axiosClient.get("/subCategory"),

  createSubCategories: (data) => axiosClient.post("/subCategory", data),

  updateSubCategories: (id, data) => axiosClient.put(`/subCategory/${id}`, data),

  deleteSubCategories: (id) => axiosClient.delete(`/subCategory/${id}`),
};
