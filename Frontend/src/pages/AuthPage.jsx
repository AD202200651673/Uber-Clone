import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiTruck,
  FiUser,
} from 'react-icons/fi'

const AuthPage = ({ mode = 'login', role = 'user' }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'
  const isCaptain = role === 'captain'
  const loginPath = isCaptain ? '/captain-login' : '/login'
  const signupPath = isCaptain ? '/captain-signup' : '/signup'
  const dashboardLabel = isCaptain ? 'captain' : 'rider'

  const title = isSignup ? 'Create your account' : 'Welcome back'
  const description = isSignup
    ? `Enter your details to start riding as a ${dashboardLabel}.`
    : 'Enter your email and password to continue.'
  const fieldHeight = isSignup ? 'h-10 sm:h-12' : 'h-12 sm:h-14'
  const fieldRadius = isSignup ? 'rounded-lg' : 'rounded-lg sm:rounded-xl'
  const formSpacing = isSignup ? 'space-y-3 sm:space-y-4' : 'space-y-4 sm:space-y-5'

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    setFormError('')
    setIsSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    if (isSignup && (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim())) {
      setFormError('Please complete all required fields.')
      return
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)

    window.setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 700)
  }

  return (
    <div className="min-h-screen bg-white text-[#1b1c1c]">
      <header className="h-14 border-b border-[#eeeeee] bg-white sm:h-16">
        <div className="mx-auto flex h-full w-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1b1c1c] transition hover:bg-[#f6f6f6] active:scale-95 sm:h-10 sm:w-10"
          >
            <FiArrowLeft size={21} />
          </button>

          <span className="truncate px-4 text-lg font-semibold tracking-tight">
            {isSignup ? 'Create account' : 'Sign in'}
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-9 sm:w-9" aria-hidden="true">
            {isCaptain ? <FiTruck size={17} /> : <FiUser size={17} />}
          </div>
        </div>
      </header>

      <main className={`mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-2xl flex-col px-3 pb-5 sm:min-h-[calc(100vh-4rem)] sm:px-6 sm:pb-6 lg:px-8 ${isSignup ? 'pt-4 sm:pt-8' : 'pt-6 sm:pt-12'}`}>
        <div className="w-full">
          <div className={`${isSignup ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8'}`}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f] sm:mb-3 sm:text-xs sm:tracking-[0.16em]">
              {isCaptain ? 'Driver portal' : 'RideShare'}
            </p>
            <h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">{title}</h1>
            <p className="mt-1.5 max-w-md text-[13px] leading-5 text-[#5e5e5e] sm:mt-2 sm:text-base sm:leading-6">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className={formSpacing}>
            {isSignup && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-[12px] font-semibold text-black sm:mb-1.5 sm:text-sm">First name</label>
                  <div className={`flex ${fieldHeight} items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:gap-2.5 sm:px-3`}>
                    <FiUser className="shrink-0 text-[#5e5e5e]" size={17} />
                    <input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="First name" value={formData.firstName} onChange={handleChange} required className="min-w-0 w-full bg-transparent text-[13px] text-black outline-none placeholder:text-[#8f8f8f] sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-[12px] font-semibold text-black sm:mb-1.5 sm:text-sm">Last name</label>
                  <div className={`flex ${fieldHeight} items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:gap-2.5 sm:px-3`}>
                    <FiUser className="shrink-0 text-[#5e5e5e]" size={17} />
                    <input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Last name" value={formData.lastName} onChange={handleChange} required className="min-w-0 w-full bg-transparent text-[13px] text-black outline-none placeholder:text-[#8f8f8f] sm:text-sm" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-black sm:mb-2 sm:text-sm">Email address</label>
              <div className={`flex ${fieldHeight} items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:gap-3 sm:px-4 ${isSignup ? '' : 'sm:rounded-xl'}`}>
                <FiMail className="shrink-0 text-[#5e5e5e]" size={19} />
                <input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="w-full bg-transparent text-sm text-black outline-none placeholder:text-[#8f8f8f] sm:text-base" />
              </div>
            </div>

            {isSignup && (
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold text-black sm:mb-2 sm:text-sm">Phone number</label>
                <div className="flex h-12 items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:gap-3 sm:rounded-xl sm:px-4">
                  <FiPhone className="shrink-0 text-[#5e5e5e]" size={19} />
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required className="w-full bg-transparent text-sm text-black outline-none placeholder:text-[#8f8f8f] sm:text-base" />
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="password" className="block text-[13px] font-semibold text-black sm:text-sm">Password</label>
                {!isSignup && <Link to="#forgot-password" className="text-[11px] font-semibold text-black underline underline-offset-2 hover:opacity-70 sm:text-xs">Forgot password?</Link>}
              </div>
              <div className={`flex ${fieldHeight} items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:gap-3 sm:px-4 ${isSignup ? '' : 'sm:rounded-xl'}`}>
                <FiLock className="shrink-0 text-[#5e5e5e]" size={19} />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="w-full bg-transparent text-sm text-black outline-none placeholder:text-[#8f8f8f] sm:text-base" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((currentValue) => !currentValue)} className="shrink-0 p-1 text-[#5e5e5e] transition hover:text-black">
                  {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                </button>
              </div>
            </div>

            {formError && <p className="text-sm font-medium text-[#ba1a1a]" role="alert">{formError}</p>}
            {isSubmitted && <p className="text-sm font-medium text-[#0e8345]" role="status">{isSignup ? 'Account details saved.' : 'Sign-in details submitted.'}</p>}

            <button type="submit" disabled={isSubmitting} className={`group flex ${isSignup ? 'h-12' : 'h-13'} w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition hover:bg-[#333333] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-xl`}>
              <span>{isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</span>
              {!isSubmitting && <FiArrowRight size={19} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>

        <div className={`mt-auto ${isSignup ? 'pt-4 sm:pt-7' : 'pt-7 sm:pt-10'}`}>
          <p className="py-2 text-center text-[13px] text-[#5e5e5e] sm:text-sm">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link to={isSignup ? loginPath : signupPath} className="font-semibold text-black underline underline-offset-2 hover:opacity-70">{isSignup ? 'Sign in' : 'Create account'}</Link>
          </p>
          <p className="mt-1.5 text-center text-[11px] leading-4 text-[#8f8f8f] sm:mt-2 sm:text-xs sm:leading-5">
            By continuing, you agree to our <Link to="#terms" className="font-medium text-black underline underline-offset-2">Terms of Service</Link> and <Link to="#privacy" className="font-medium text-black underline underline-offset-2">Privacy Notice</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default AuthPage