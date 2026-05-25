import axiosClient from "../axiosClient";

export const productApi = {
  // Fetch only products belonging to the authenticated farmer
  getFarmerProducts: (farmerId) => axiosClient.get(`/products/my-products?farmerId=${farmerId}`),

  getProducts: () => axiosClient.get("/products"),

  createProducts: (data) => axiosClient.post("/products", data),

  updateProducts: (id, data) => axiosClient.put(`/products/${id}`, data),

  deleteProducts: (id) => axiosClient.delete(`/products/${id}`),
};
