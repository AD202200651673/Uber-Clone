import { useState } from 'react'
import { authService } from '../services/auth.service'
import { tokenStorage } from '../utils/storage'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const execute = async (request, onSuccess) => {
    setIsLoading(true)
    setError('')

    try {
      const data = await request()
      if (data.token) tokenStorage.set(data.token)
      onSuccess?.(data)
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Something went wrong. Please try again.')
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setError,
    registerUser: (payload, onSuccess) => execute(() => authService.registerUser(payload), onSuccess),
    loginUser: (payload, onSuccess) => execute(() => authService.loginUser(payload), onSuccess),
    registerCaptain: (payload, onSuccess) => execute(() => authService.registerCaptain(payload), onSuccess),
    loginCaptain: (payload, onSuccess) => execute(() => authService.loginCaptain(payload), onSuccess),
  }
}
