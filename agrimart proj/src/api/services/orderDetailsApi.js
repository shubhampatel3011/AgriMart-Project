import axiosClient from "../axiosClient";

export const orderDetailsApi = {
  getOrderDetails: () => axiosClient.get("/orderDetail"),

  createOrderDetails: (data) => axiosClient.post("/orderDetail", data),

  updateOrderDetails: (id, data) =>
    axiosClient.put(`/orderDetail/${id}`, data),

  deleteOrderDetails: (id) => axiosClient.delete(`/orderDetail/${id}`),
};
