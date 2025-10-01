import axios from "axios";
import { logout } from "@/utils/auth";
export const APP_BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiClient = axios.create({
  baseURL: APP_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    // const persistData = AuthController.getSession();
    // if (persistData?.token && !config.headers.Authorization) {
    //   config.headers[`Authorization`] = `Bearer ${persistData.token}`;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);
