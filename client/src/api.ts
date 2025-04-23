import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

function createApiService(baseURL: string): {
    get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>>;
    post<T>(url: string, data?: any): Promise<AxiosResponse<T>>;
    put<T>(url: string, data?: any): Promise<AxiosResponse<T>>;
    delete<T>(url: string): Promise<AxiosResponse<T>>;
} {
    const axiosInstance: AxiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => {
            console.error('API Error:', error.response || error.message);
            return Promise.reject(error);
        }
    );

    return {
        get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
            return axiosInstance.get<T>(url, { params });
        },
        post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
            return axiosInstance.post<T>(url, data);
        },
        put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
            return axiosInstance.put<T>(url, data);
        },
        delete<T>(url: string): Promise<AxiosResponse<T>> {
            return axiosInstance.delete<T>(url);
        },
    };
}

// Example usage
const apiService = createApiService('http://localhost:3000/');

export default apiService;
