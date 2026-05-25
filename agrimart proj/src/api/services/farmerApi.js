import axiosClient from "../axiosClient";

export const farmerApi = {
  // Authentication
  login: (email, password) =>
    axiosClient.post("/farmer/login", { email, password }),

  registerFarmer: (Data) => axiosClient.post("/farmer/register", Data),

  addProductToFarmer: (farmerId, productId) => {
    return axiosClient.put(`/farmer/${farmerId}/add-product`, { productId });
  },

  // CRUD operation
  getFarmers: () => axiosClient.get("/farmer"),

  createFarmers: (data) => axiosClient.post("/farmer", data),

  updateFarmers: (id, data) => axiosClient.put(`/farmer/${id}`, data),

  deleteFarmers: (id) => axiosClient.delete(`/farmer/${id}`),
};
