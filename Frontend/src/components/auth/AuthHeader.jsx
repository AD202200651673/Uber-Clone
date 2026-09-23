import React from 'react'

const AuthHeader = ({ title, icon: Icon, onBack }) => (
  <header className="border-b border-[#eeeeee] bg-white pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
    <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-[#f6f6f6] active:scale-95"
      >
        <span className="text-xl">←</span>
      </button>
      <span className="text-[17px] font-semibold tracking-tight text-[#1b1c1c] sm:text-lg">{title}</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-9 sm:w-9">
        <Icon size={16} />
      </div>
    </div>
  </header>
)

export default AuthHeader
