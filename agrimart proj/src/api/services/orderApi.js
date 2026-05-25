import axiosClient from "../axiosClient";

export const orderApi = {
  getOrders: () => axiosClient.get("/order"),

  getUserOrders: (userId) => axiosClient.get(`/order/user/${userId}`),

  getFarmerOrders: (farmerId) => axiosClient.get(`/order/farmer/${farmerId}`),

  getOrderById: (id) => axiosClient.get(`/order/${id}`),

  createOrders: (data) => axiosClient.post("/order", data),

  updateOrders: (id, data) => axiosClient.put(`/order/${id}`, data),

  deleteOrders: (id) => axiosClient.delete(`/order/${id}`),
};
