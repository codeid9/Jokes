import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;
        if (prevRequest?.url?.includes("/users/refresh-token")) {
            return Promise.reject(error);
        }
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;

            try {
                await axiosInstance.post("/users/refresh-token");
                return axiosInstance(prevRequest);
            } catch (refreshError) {
                console.error("Refresh token expired, please login again.");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
export default axiosInstance;