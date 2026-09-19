import React from 'react'

const AuthField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, trailing }) => (
  <label className="block text-[12px] font-semibold sm:text-sm">
    {label}
    <div className="mt-1 flex h-10 items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-12 sm:px-3">
      <Icon size={17} className="shrink-0 text-[#5e5e5e]" />
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required className="min-w-0 w-full bg-transparent text-[13px] font-normal outline-none placeholder:text-[#8f8f8f] sm:text-sm" />
      {trailing}
    </div>
  </label>
)

export default AuthField
