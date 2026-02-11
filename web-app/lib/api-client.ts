import axios from 'axios';
import { useAuthStore } from './auth-store';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // Access token from Zustand store
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized (e.g., logout)
            useAuthStore.getState().logout();
            // Optional: Redirect to login page
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
