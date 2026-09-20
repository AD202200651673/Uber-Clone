import { axiosInstance } from '../api/core/api'
import { API_ENDPOINTS } from '../api/core/endpoints'

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

  logoutUser: async () => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.users.logout)
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

  logoutCaptain: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.captains.logout)
    return data
  },
}
