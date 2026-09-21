import React from 'react'
import { Route, Routes} from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import CaptainHome from './pages/CaptainHome'
import ProtectedRoute from './components/routing/ProtectedRoute'
import UserLogout from './pages/UserLogout'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/home' element={<ProtectedRoute role='user'><Home /></ProtectedRoute>} />
        <Route path='/captain-home' element={<ProtectedRoute role='captain'><CaptainHome /></ProtectedRoute>} />
        <Route path='/user-logout' element={<UserLogout />} />
        <Route path='/captain-logout' element={<CaptainLogout />} />
      </Routes>
    </div>
  )
}

export default App