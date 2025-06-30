import axios from 'axios';
import { getAuth } from '../auth/_helpers';
const token = getAuth()?.access_token;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://assistly.hostree.in/api';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: token,
    'Content-Type': 'multipart/form-data'
  }
});

// Add response interceptor for plan upgrade error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.code === 'PLAN_UPGRADE_REQUIRED') {
      window.dispatchEvent(new CustomEvent('plan-upgrade-required'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
