import React from 'react'

const AuthHeader = ({ title, icon: Icon, onBack }) => (
  <header className="h-14 border-b border-[#eeeeee] sm:h-16">
    <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
      <button type="button" aria-label="Go back" onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6] sm:h-10 sm:w-10">←</button>
      <span className="text-lg font-semibold">{title}</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><Icon size={17} /></div>
    </div>
  </header>
)

export default AuthHeader
