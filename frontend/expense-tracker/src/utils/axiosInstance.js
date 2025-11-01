import axios from "axios";
import { API_BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({ 
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // For 401 errors, we just want to pass the error along
            // so the calling component (e.g., Login.jsx) can handle it.
        } else if (error.response && error.response.status === 500) {
            console.error("Server error please try again later.");
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later");
        }
        
        // For all errors, we reject the promise so the .catch() block in the component is triggered
        return Promise.reject(error);
    }
);

export default axiosInstance;