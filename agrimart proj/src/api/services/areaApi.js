import axiosClient from "../axiosClient";

export const areaApi = {
  getAreas: () => axiosClient.get("/area"),

  createAreas: (data) => axiosClient.post("/area", data),

  updateAreas: (id, data) => axiosClient.put(`/area/${id}`, data),

  deleteAreas: (id) => axiosClient.delete(`/area/${id}`),
};
