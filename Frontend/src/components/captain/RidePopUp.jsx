import React from 'react'
import { FiArrowDown, FiMapPin } from 'react-icons/fi'

const RidePopUp = ({ ride, onAccept, onIgnore }) => {
  const passengerName = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ''}`
    : 'Passenger';
  const userInitials = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName[0]}${ride.user.fullName.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1b1c1c] text-sm font-bold text-white">
            {userInitials}
          </div>
          <div>
            <p className="text-[16px] font-bold">{passengerName}</p>
            <div className="mt-1 flex gap-1.5">
              <span className="rounded-full bg-[#ffd83d] px-2 py-0.5 text-[10px] font-bold">Cash</span>
              <span className="rounded-full bg-[#ffd83d] px-2 py-0.5 text-[10px] font-bold">Ride Request</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold">₹{ride?.fare || '0'}</p>
          <p className="text-[12px] text-[#8f8f8f]">{(ride?.distance ? (ride.distance / 1000).toFixed(1) + ' km' : 'Nearby')}</p>
        </div>
      </div>

      <div className="divide-y divide-[#eeeeee] rounded-xl border border-[#eeeeee] bg-[#fbf9f8]">
        <div className="flex items-start gap-3 px-3 py-3">
          <FiMapPin className="mt-0.5 shrink-0 text-[16px]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">Pick up</p>
            <p className="mt-1 text-[14px] font-semibold">{ride?.pickup || 'Pickup Location'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-3">
          <FiArrowDown className="mt-0.5 shrink-0 text-[16px] text-[#0054cb]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">Drop off</p>
            <p className="mt-1 text-[14px] font-semibold">{ride?.destination || 'Drop Location'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1.35fr] gap-3">
        <button type="button" onClick={onIgnore} className="h-12 rounded-xl bg-[#f3f1f0] text-sm font-semibold text-[#8f8f8f] transition hover:bg-[#e9e7e5] active:scale-[0.99]">Ignore</button>
        <button type="button" onClick={onAccept} className="h-12 rounded-xl bg-[#ffd21f] text-sm font-bold text-[#1b1c1c] transition hover:bg-[#f5c400] active:scale-[0.99]">Accept ride</button>
      </div>
    </div>
  )
}

export default RidePopUp