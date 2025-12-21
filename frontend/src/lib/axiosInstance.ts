import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    // Check if response exists (network errors won't have error.response)
    if (!error.response) {
      return Promise.reject(error)
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      (error.response.data.message === "Unauthorized" ||
        error.response.data.message === "Unauthorized: Invalid or expired token")
    ) {
      originalRequest._retry = true

      try {
        await axios.post(
          `${BASE_URL}/v1/user/refresh-token`,
          {},
          { withCredentials: true }
        )

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
