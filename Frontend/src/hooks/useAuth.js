import { useState } from 'react'
import { authService } from '../services/auth.service'
import { tokenStorage } from '../utils/storage'

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const execute = async (request, onSuccess, tokenType = 'user') => {
    setIsLoading(true)
    setError('')

    try {
      const data = await request()
      if (data.token) {
        if (tokenType === 'captain') {
          tokenStorage.captain.set(data.token)
          tokenStorage.user.clear()
        } else {
          tokenStorage.user.set(data.token)
          tokenStorage.captain.clear()
        }
      }
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
    registerUser: (payload, onSuccess) => execute(() => authService.registerUser(payload), onSuccess, 'user'),
    loginUser: (payload, onSuccess) => execute(() => authService.loginUser(payload), onSuccess, 'user'),
    registerCaptain: (payload, onSuccess) => execute(() => authService.registerCaptain(payload), onSuccess, 'captain'),
    loginCaptain: (payload, onSuccess) => execute(() => authService.loginCaptain(payload), onSuccess, 'captain'),
  }
}
