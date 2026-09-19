import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiTruck, FiUser } from 'react-icons/fi'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (Object.values(formData).some((value) => !value.trim())) {
      setError('Please complete all required fields.')
      return
    }
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white text-[#1b1c1c]"><header className="h-14 border-b border-[#eeeeee] sm:h-16"><div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8"><button type="button" aria-label="Go back" onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6]"><FiArrowLeft size={21} /></button><span className="text-lg font-semibold">Captain registration</span><div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiTruck size={17} /></div></div></header><main className="mx-auto max-w-2xl px-3 pb-5 pt-4 sm:px-6 sm:pt-8 lg:px-8"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">Driver portal</p><h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">Create captain account</h1><p className="mt-1.5 text-[13px] text-[#5e5e5e] sm:text-base">Register to start accepting rides.</p><form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:mt-6 sm:space-y-4"><div className="grid grid-cols-2 gap-2.5"><Field label="First name" name="firstName" value={formData.firstName} onChange={handleChange} icon={FiUser} placeholder="First name" /><Field label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} icon={FiUser} placeholder="Last name" /></div><Field label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} icon={FiMail} placeholder="name@example.com" /><Field label="Phone number" name="phone" type="tel" value={formData.phone} onChange={handleChange} icon={FiPhone} placeholder="Phone number" /><Field label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} icon={FiLock} placeholder="Enter your password" trailing={<button type="button" onClick={() => setShowPassword((current) => !current)} aria-label="Toggle password visibility">{showPassword ? <FiEyeOff /> : <FiEye />}</button>} />{error && <p className="text-sm text-[#ba1a1a]" role="alert">{error}</p>}<button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white hover:bg-[#333333]">Create account <FiArrowRight className="transition group-hover:translate-x-1" /></button></form><p className="pt-5 text-center text-[13px] text-[#5e5e5e] sm:pt-8 sm:text-sm">Already a captain? <Link to="/captain-login" className="font-semibold text-black underline">Sign in</Link></p></main></div>
  )
}

const Field = ({ label, name, type = 'text', value, onChange, icon: Icon, placeholder, trailing }) => <label className="block text-[12px] font-semibold sm:text-sm">{label}<div className="mt-1 flex h-10 items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-12 sm:px-3"><Icon size={17} className="shrink-0 text-[#5e5e5e]" /><input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required className="min-w-0 w-full bg-transparent text-[13px] font-normal outline-none placeholder:text-[#8f8f8f] sm:text-sm" />{trailing}</div></label>

export default CaptainSignup