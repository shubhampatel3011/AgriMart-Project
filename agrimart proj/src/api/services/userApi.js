import axiosClient from "../axiosClient";

export const userApi = {
  // Authentication
  loginUser: (email, password) => 
    axiosClient.post("/users/login", { email, password }),

  registerUser: (userData) => 
    axiosClient.post("/users/register", userData),

  // CRUD Operations
  getUsers: () => axiosClient.get("/users"),

  createUser: (data) => axiosClient.post("/users", data),

  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),

  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
};
