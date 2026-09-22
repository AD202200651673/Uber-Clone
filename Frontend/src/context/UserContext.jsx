import React, { createContext, useContext, useState } from 'react'

export const UserDataContext = createContext(null)
export const UserContext = UserDataContext

export const useUser = () => {
    const context = useContext(UserDataContext)

    if (!context) {
        throw new Error('useUser must be used inside UserContext')
    }

    return context
}

const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState({
        email: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    })

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserProvider