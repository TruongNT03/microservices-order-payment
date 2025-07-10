import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

instance.interceptors.request.use(
  (config) => {
    const access_token =
      localStorage.getItem("access_token") || Cookies.get("access_token");
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return { ...response.data, status: response.status };
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
