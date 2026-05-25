import axiosClient from "../axiosClient";

export const cityApi = {
  getCities: () => axiosClient.get("/city"),

  createCities: (data) => axiosClient.post("/city", data),

  updateCities: (id, data) => axiosClient.put(`/city/${id}`, data),

  deleteCities: (id) => axiosClient.delete(`/city/${id}`),
};
