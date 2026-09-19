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

  registerCaptain: async (payload) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.register, payload)
    return data
  },

  loginCaptain: async ({ email, password }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.captains.login, { email, password })
    return data
  },
}
