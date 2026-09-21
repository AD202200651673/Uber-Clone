import React from 'react'
import { FiClock, FiLogOut, FiMapPin, FiNavigation, FiUser } from 'react-icons/fi'

const CaptainDetails = ({ captain, isOnline }) => {
  const firstName = captain?.fullName?.firstName || 'Jeremiah'
  const lastName = captain?.fullName?.lastName || 'Curtis'
  const captainName = `${firstName} ${lastName}`.trim()

  return (
    <section className="absolute inset-x-0 bottom-0 z-40 rounded-t-[28px] border-t border-black/5 bg-[#fbf9f8] px-4 pb-6 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#d7d2ce]" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {firstName[0]}{lastName[0]}
          </div>
          <div>
            <p className="text-[16px] font-bold">{captainName}</p>
            <p className="text-[12px] text-[#5e5e5e]">Basic level · Captain</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold">$325.00</p>
          <p className="text-[11px] text-[#8f8f8f]">Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-black/10 rounded-xl bg-[#ffd83d] py-4">
        <div className="text-center">
          <FiClock className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold">10.2</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">Hours online</p>
        </div>
        <div className="text-center">
          <FiNavigation className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold">30 KM</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">Total distance</p>
        </div>
        <div className="text-center">
          <FiMapPin className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold">20</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">Total jobs</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#eeeeee] bg-white px-3 py-2.5 text-[12px]">
        <span className="flex items-center gap-2 text-[#5e5e5e]"><FiUser /> Vehicle status</span>
        <span className={`font-semibold ${isOnline ? 'text-[#0e8345]' : 'text-[#5e5e5e]'}`}>
          {isOnline ? 'Verified · Active' : 'Verified · Offline'}
        </span>
      </div>

      <button type="button" className="mt-3 flex w-full items-center justify-center gap-2 text-[12px] font-semibold text-[#5e5e5e]">
        <FiLogOut /> Sign out
      </button>
    </section>
  )
}

export default CaptainDetails
