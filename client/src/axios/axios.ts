import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return { ...response.data, status: response.status };
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
