import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { UserDataContext } from '../context/UserContext'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../validators/auth'

const UserLogin = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)
  const { loginUser, isLoading, error: requestError } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    loginUser(formData, (response) => {
      setUser(response.user)
      navigate('/home')
    }).catch((requestError) => {
      setError(getApiErrorMessage(requestError, 'Sign in failed. Please try again.'))
    })
  }

  return (
    <div className="min-h-screen bg-white text-[#1b1c1c]">
      <header className="h-14 border-b border-[#eeeeee] sm:h-16">
        <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <button type="button" aria-label="Go back" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6] sm:h-10 sm:w-10"><FiArrowLeft size={21} /></button>
          <span className="text-lg font-semibold tracking-tight">Sign in</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-9 sm:w-9"><FiUser size={17} /></div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col px-3 pb-5 pt-6 sm:min-h-[calc(100vh-4rem)] sm:px-6 sm:pb-6 sm:pt-12 lg:px-8">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">RideShare</p>
          <h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">Welcome back</h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-5 text-[#5e5e5e] sm:text-base sm:leading-6">Enter your email and password to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            <label className="block text-[13px] font-semibold sm:text-sm">Email address
              <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:gap-3 sm:px-4"><FiMail className="text-[#5e5e5e]" /><input name="email" type="email" autoComplete="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-[#8f8f8f] sm:text-base" /></div>
            </label>
            <label className="block text-[13px] font-semibold sm:text-sm">Password
              <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:gap-3 sm:px-4"><FiLock className="text-[#5e5e5e]" /><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-[#8f8f8f] sm:text-base" /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            </label>
            {(error || requestError) && <p className="text-sm font-medium text-[#ba1a1a]" role="alert">{error || requestError}</p>}
            <button type="submit" disabled={isLoading} className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-[#333333] disabled:opacity-60">{isLoading ? 'Signing in...' : 'Sign in'} {!isLoading && <FiArrowRight className="transition group-hover:translate-x-1" />}</button>
          </form>
        </div>
        <p className="mt-auto pt-10 text-center text-[13px] text-[#5e5e5e] sm:text-sm">Don't have an account? <Link to="/signup" className="font-semibold text-black underline">Create account</Link></p>
      </main>
    </div>
  )
}

export default UserLogin