import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status;

        if (!status) {
            toast.error("Network error. Please check your connection.");
        } else if (status >= 500) {
            toast.error("Server error. Please try again later.");
        } else if (status === 403) {
            toast.error("You do not have permission to perform this action.");
        } else if (status === 404) {
            toast.error("Requested resource not found.");
        } else if (status === 400) {
            toast.error("Bad request. Please check the data.");
        } else if (status === 401) {
            toast.error("Session expired. Please login again.");
        } else {
            toast.error(error?.response?.data?.message || "An error occurred.");
        }
        return Promise.reject(error);
    }
);

export default api;

