import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.rawatmukul5000.workers.dev", // ✅ your backend URL here :-> http://localhost:8787 (DEV)
  withCredentials: true,                // ✅ send cookies (refresh token)
});


// ❗ Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) { // prevent infinite loop
            originalRequest._retry = true;
            try {
                // 👇 Hit refresh route
                await api.post("/api/v1/user/refresh-token");

                // 👇 Retry original request with refreshed cookie
                return api(originalRequest);
            }
            catch (refreshErr) {
                // 👇 If refresh fails
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
