import { axiosInstance } from '../api/core/api'
import { API_ENDPOINTS } from '../api/core/endpoints'
import { tokenStorage } from '../utils/storage'

export const authService = {
  registerUser: async ({ firstName, lastName, email, password }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.users.register, {
      fullName: { firstName, lastName },
      email,
      password,
    })

    return data
  },

  loginUser: async ({ email, password }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.users.login, { email, password })
    return data
  },

  refreshUserToken: async () => {
    const refreshToken = tokenStorage.user.getRefreshToken()
    const { data } = await axiosInstance.post(API_ENDPOINTS.users.refreshToken, { refreshToken })
    if (data?.token) {
      tokenStorage.user.set(data.token)
    }
    return data
  },

  logoutUser: async () => {
    const refreshToken = tokenStorage.user.getRefreshToken()
    const { data } = await axiosInstance.post(API_ENDPOINTS.users.logout, { refreshToken })
    return data
  },

  registerCaptain: async ({
    firstName,
    lastName,
    email,
    password,
    vehicleColor,
    vehiclePlate,
    vehicleCapacity,
    vehicleType,
  }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.register, {
      fullName: { firstName, lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType,
      },
    })

    return data
  },

  loginCaptain: async ({ email, password }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.login, { email, password })
    return data
  },

  refreshCaptainToken: async () => {
    const refreshToken = tokenStorage.captain.getRefreshToken()
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.refreshToken, { refreshToken })
    if (data?.token) {
      tokenStorage.captain.set(data.token)
    }
    return data
  },

  logoutCaptain: async () => {
    const refreshToken = tokenStorage.captain.getRefreshToken()
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.logout, { refreshToken })
    return data
  },
}
