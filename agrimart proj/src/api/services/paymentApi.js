import axiosClient from "../axiosClient";

export const paymentApi = {
  getPayments: () => axiosClient.get("/payment"),

  createPayments: (data) => axiosClient.post("/payment", data),

  updatePayments: (id, data) => axiosClient.put(`/payment/${id}`, data),

  deletePayments: (id) => axiosClient.delete(`/payment/${id}`),
};
