import axiosClient from "../axiosClient";

export const shippingsApi = {
  getShippings: () => axiosClient.get("/shipping"),

  createShippings: (data) => axiosClient.post("/shipping", data),

  updateShippings: (id, data) => axiosClient.put(`/shipping/${id}`, data),

  deleteShippings: (id) => axiosClient.delete(`/shipping/${id}`),
};
