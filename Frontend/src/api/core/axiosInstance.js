import axios from 'axios'
import { ENV } from '../../config/env'

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('captainToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const isAuthEndpoint =
      originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/register') ||
      originalRequest.url?.includes('/refresh-token') ||
      originalRequest.url?.includes('/logout')

    if (isAuthEndpoint) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const isCaptain = !!localStorage.getItem('captainToken') || !!localStorage.getItem('captainRefreshToken')
    const refreshEndpoint = isCaptain ? '/api/captains/refresh-token' : '/api/users/refresh-token'
    const refreshToken = isCaptain
      ? localStorage.getItem('captainRefreshToken')
      : localStorage.getItem('userRefreshToken')

    try {
      const { data } = await axios.post(
        `${ENV.API_BASE_URL}${refreshEndpoint}`,
        { refreshToken },
        { withCredentials: true }
      )

      const newToken = data.token
      if (isCaptain) {
        localStorage.setItem('captainToken', newToken)
      } else {
        localStorage.setItem('userToken', newToken)
      }

      processQueue(null, newToken)
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      localStorage.removeItem('userToken')
      localStorage.removeItem('userRefreshToken')
      localStorage.removeItem('captainToken')
      localStorage.removeItem('captainRefreshToken')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance
