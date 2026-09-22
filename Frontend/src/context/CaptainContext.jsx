import React, { createContext, useContext, useState } from 'react'

export const CaptainDataContext = createContext(null)
export const CaptainContext = CaptainDataContext

export const useCaptain = () => {
  const context = useContext(CaptainDataContext)

  if (!context) {
    throw new Error('useCaptain must be used inside CaptainContext')
  }

  return context
}

const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
  })

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  )
}

export default CaptainProvider