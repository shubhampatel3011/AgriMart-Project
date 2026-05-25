import axiosClient from "../axiosClient";

export const thirdCategoriesApi = {
  getThirdCategories: () => axiosClient.get("/thirdCategory"),

  createThirdCategories: (data) => axiosClient.post("/thirdCategory", data),

  updateThirdCategories: (id, data) => axiosClient.put(`/thirdCategory/${id}`, data),

  deleteThirdCategories: (id) => axiosClient.delete(`/thirdCategory/${id}`),
};
