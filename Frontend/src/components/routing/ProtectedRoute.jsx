import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../../api/core/api'
import { API_ENDPOINTS } from '../../api/core/endpoints'

const ProtectedRoute = ({ children, role = 'user' }) => {
  const location = useLocation()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let isMounted = true

    const verifyRole = async () => {
      const profileEndpoint = role === 'user' ? API_ENDPOINTS.users.profile : API_ENDPOINTS.captains.profile

      try {
        const response = await axiosInstance.get(profileEndpoint)
        const isVerified = role === 'user' ? !!response?.data?.user : !!response?.data?.captain

        if (!isMounted) return

        if (isVerified) {
          setStatus('allowed')
          return
        }

        throw new Error('Invalid role payload')
      } catch (error) {
        if (!isMounted) return

        const otherRole = role === 'user' ? 'captain' : 'user'
        const otherEndpoint = otherRole === 'user' ? API_ENDPOINTS.users.profile : API_ENDPOINTS.captains.profile

        try {
          const response = await axiosInstance.get(otherEndpoint)
          const isOtherRoleVerified = otherRole === 'user' ? !!response?.data?.user : !!response?.data?.captain

          if (!isMounted) return

          if (isOtherRoleVerified) {
            setStatus(role === 'user' ? 'redirect-captain' : 'redirect-user')
            return
          }

          setStatus(role === 'user' ? 'redirect-login' : 'redirect-captain-login')
        } catch {
          if (!isMounted) return
          setStatus(role === 'user' ? 'redirect-login' : 'redirect-captain-login')
        }
      }
    }

    verifyRole()

    return () => {
      isMounted = false
    }
  }, [location.pathname, role])

  if (status === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#5e5e5e]">Checking access...</div>
  }

  if (status === 'allowed') {
    return children
  }

  if (status === 'redirect-captain') {
    return <Navigate to="/captain-home" replace />
  }

  if (status === 'redirect-user') {
    return <Navigate to="/home" replace />
  }

  if (status === 'redirect-login') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Navigate to="/captain-login" replace state={{ from: location }} />
}

export default ProtectedRoute
