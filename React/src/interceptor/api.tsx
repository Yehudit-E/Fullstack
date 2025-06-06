import axios from "axios";
import { BASE_URL } from "../Global";

const api = axios.create({
    baseURL: BASE_URL+"/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;