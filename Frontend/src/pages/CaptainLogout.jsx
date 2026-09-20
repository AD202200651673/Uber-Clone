import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCaptain } from '../context/CaptainContext'
import { authService } from '../services/auth.service'
import { tokenStorage } from '../utils/storage'

const CaptainLogout = () => {
  const navigate = useNavigate()
  const { setCaptain } = useCaptain()
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const logout = async () => {
      try {
        await authService.logoutCaptain()
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.message || 'Session ended locally.')
        }
      } finally {
        tokenStorage.captain.clear()
        tokenStorage.user.clear()
        setCaptain({
          email: '',
          fullName: {
            firstName: '',
            lastName: '',
          },
        })

        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'

        if (isMounted) {
          navigate('/captain-login', { replace: true })
        }
      }
    }

    logout()

    return () => {
      isMounted = false
    }
  }, [navigate, setCaptain])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-[#1b1c1c]">
      <p className="text-sm text-[#5e5e5e]">
        {error || 'Signing you out...'}
      </p>
    </main>
  )
}

export default CaptainLogout
