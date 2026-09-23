import React from 'react'

const AuthField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, trailing, min }) => (
  <label className="block text-[13px] font-semibold text-[#1b1c1c] sm:text-sm">
    {label}
    <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl bg-[#f6f6f6] px-3 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-13 sm:px-3.5">
      {Icon && <Icon size={18} className="shrink-0 text-[#5e5e5e]" />}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        required
        className="min-w-0 w-full bg-transparent text-[16px] sm:text-sm font-normal outline-none placeholder:text-[#8f8f8f]"
      />
      {trailing}
    </div>
  </label>
)

export default AuthField
