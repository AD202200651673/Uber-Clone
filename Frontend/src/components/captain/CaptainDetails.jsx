import React from 'react'
import { FiClock, FiMapPin, FiTruck, FiUser } from 'react-icons/fi'

const CaptainDetails = ({ captain }) => {
  const firstName = captain?.fullName?.firstName || ''
  const lastName = captain?.fullName?.lastName || ''
  const captainName = `${firstName} ${lastName}`.trim() || 'Captain'
  const initials = `${firstName[0] || 'C'}${lastName[0] || ''}`.toUpperCase()

  const vehicleType = captain?.vehicle?.vehicleType
    ? captain.vehicle.vehicleType.charAt(0).toUpperCase() + captain.vehicle.vehicleType.slice(1)
    : 'Vehicle'
  const plateNumber = captain?.vehicle?.plate || 'Not registered'
  const capacity = captain?.vehicle?.capacity || 1

  return (
    <div className="flex flex-col min-h-full pb-2">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] sm:text-[16px] font-bold text-[#1b1c1c]">{captainName}</p>
            <p className="truncate text-[11px] sm:text-[12px] text-[#5e5e5e]">{vehicleType} · {plateNumber}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[17px] sm:text-[18px] font-bold text-[#1b1c1c]">₹0.00</p>
          <p className="text-[10px] sm:text-[11px] text-[#8f8f8f]">Today's Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-black/10 rounded-xl bg-[#ffd83d] py-3 sm:py-4">
        <div className="text-center px-1">
          <FiClock className="mx-auto mb-1 text-lg sm:text-xl" />
          <p className="text-[14px] sm:text-[16px] font-bold">10.2</p>
          <p className="mt-0.5 text-[8.5px] sm:text-[9px] font-semibold uppercase text-black/60">Hours Online</p>
        </div>
        <div className="text-center px-1">
          <FiTruck className="mx-auto mb-1 text-lg sm:text-xl" />
          <p className="truncate text-[14px] sm:text-[16px] font-bold">{vehicleType}</p>
          <p className="mt-0.5 text-[8.5px] sm:text-[9px] font-semibold uppercase text-black/60">{capacity} {capacity === 1 ? 'Seat' : 'Seats'}</p>
        </div>
        <div className="text-center px-1">
          <FiMapPin className="mx-auto mb-1 text-lg sm:text-xl" />
          <p className="truncate text-[13px] sm:text-[15px] font-bold">{plateNumber}</p>
          <p className="mt-0.5 text-[8.5px] sm:text-[9px] font-semibold uppercase text-black/60">Plate No.</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#eeeeee] bg-white px-3 py-2.5 text-[12px]">
        <span className="flex items-center gap-2 text-[#5e5e5e]"><FiUser size={14} /> Vehicle & Status</span>
        <span className="font-semibold text-[#0e8345]">Verified · Active</span>
      </div>
    </div>
  )
}

export default CaptainDetails
