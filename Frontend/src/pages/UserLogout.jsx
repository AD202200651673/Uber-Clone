import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useUser } from '../context/UserContext'
import { tokenStorage } from '../utils/storage'

const UserLogout = () => {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const logout = async () => {
      try {
        await authService.logoutUser()
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.message || 'Session ended locally.')
        }
      } finally {
        tokenStorage.clear()
        setUser({
          email: '',
          fullName: {
            firstName: '',
            lastName: '',
          },
        })

        if (isMounted) {
          navigate('/login', { replace: true })
        }
      }
    }

    logout()

    return () => {
      isMounted = false
    }
  }, [navigate, setUser])

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-white px-4 text-[#1b1c1c]">
      <p className="text-sm font-medium text-[#5e5e5e]">
        {error || 'Signing you out...'}
      </p>
    </main>
  )
}

export default UserLogout