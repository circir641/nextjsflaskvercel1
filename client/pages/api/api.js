import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Your API base URL
});

// Add the interceptor code here
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken(); // Implement token refresh logic
      localStorage.setItem('token', newToken);
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
