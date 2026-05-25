import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add interceptor to handle FormData
axiosClient.interceptors.request.use(
  (config) => {
    // If data is FormData, don't set Content-Type header
    // Let the browser set it automatically

    const token = localStorage.getItem("token");

    if(token){
      config.headers.Authorization = `bearer ${token}`;
    }

    localStorage.getItem("token");
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
