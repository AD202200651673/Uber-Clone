import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import CaptainHome from './pages/CaptainHome'
import ProtectedRoute from './components/routing/ProtectedRoute'
import PublicRoute from './components/routing/PublicRoute'
import UserLogout from './pages/UserLogout'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-white">
      <Routes>
        <Route path='/' element={<PublicRoute><Start /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><UserLogin /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><UserSignup /></PublicRoute>} />
        <Route path='/captain-login' element={<PublicRoute><CaptainLogin /></PublicRoute>} />
        <Route path='/captain-signup' element={<PublicRoute><CaptainSignup /></PublicRoute>} />
        <Route path='/riding' element={<ProtectedRoute role='user'><Riding /></ProtectedRoute>} />
        <Route path='/captain-riding' element={<ProtectedRoute role='captain'><CaptainRiding /></ProtectedRoute>} />
        <Route path='/home' element={<ProtectedRoute role='user'><Home /></ProtectedRoute>} />
        <Route path='/captain-home' element={<ProtectedRoute role='captain'><CaptainHome /></ProtectedRoute>} />
        <Route path='/user-logout' element={<UserLogout />} />
        <Route path='/captain-logout' element={<CaptainLogout />} />
      </Routes>
    </div>
  )
}

export default App