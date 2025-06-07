import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backend_url,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;