import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiTruck } from 'react-icons/fi'

const CaptainLogin = () => {
  const navigate = useNavigate()
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
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white text-[#1b1c1c]"><header className="h-14 border-b border-[#eeeeee] sm:h-16"><div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8"><button type="button" aria-label="Go back" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6]"><FiArrowLeft size={21} /></button><span className="text-lg font-semibold">Captain sign in</span><div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiTruck size={17} /></div></div></header><main className="mx-auto max-w-2xl px-3 pb-5 pt-6 sm:px-6 sm:pt-12 lg:px-8"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">Driver portal</p><h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">Welcome back</h1><p className="mt-1.5 text-[13px] text-[#5e5e5e] sm:text-base">Enter your captain credentials to continue.</p><form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"><label className="block text-[13px] font-semibold sm:text-sm">Email address<div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:px-4"><FiMail className="text-[#5e5e5e]" /><input name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-[#8f8f8f] sm:text-base" /></div></label><label className="block text-[13px] font-semibold sm:text-sm">Password<div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-lg bg-[#f6f6f6] px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:px-4"><FiLock className="text-[#5e5e5e]" /><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-[#8f8f8f] sm:text-base" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label="Toggle password visibility">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div></label>{error && <p className="text-sm text-[#ba1a1a]" role="alert">{error}</p>}<button type="submit" className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-[#333333]">Sign in <FiArrowRight className="transition group-hover:translate-x-1" /></button></form><p className="mt-10 text-center text-[13px] text-[#5e5e5e] sm:text-sm">New captain? <Link to="/captain-signup" className="font-semibold text-black underline">Create account</Link></p></main></div>
  )
}

export default CaptainLogin