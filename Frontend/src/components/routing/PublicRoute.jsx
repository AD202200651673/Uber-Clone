import React from 'react'
import { Navigate } from 'react-router-dom'
import { tokenStorage } from '../../utils/storage'

const PublicRoute = ({ children }) => {
  const userToken = tokenStorage.user.get()
  const captainToken = tokenStorage.captain.get()

  if (userToken) {
    return <Navigate to="/home" replace />
  }

  if (captainToken) {
    return <Navigate to="/captain-home" replace />
  }

  return children
}

export default PublicRoute
