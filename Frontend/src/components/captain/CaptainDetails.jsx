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
    <div className="flex flex-col min-h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {initials}
          </div>
          <div>
            <p className="text-[16px] font-bold">{captainName}</p>
            <p className="text-[12px] text-[#5e5e5e]">{vehicleType} · {plateNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold">₹0.00</p>
          <p className="text-[11px] text-[#8f8f8f]">Today's Earned</p>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-black/10 rounded-xl bg-[#ffd83d] py-4">
        <div className="text-center">
          <FiClock className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold">10.2</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">Hours Online</p>
        </div>
        <div className="text-center">
          <FiTruck className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold">{vehicleType}</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">{capacity} {capacity === 1 ? 'Seat' : 'Seats'}</p>
        </div>
        <div className="text-center">
          <FiMapPin className="mx-auto mb-2 text-xl" />
          <p className="text-[16px] font-bold truncate px-1">{plateNumber}</p>
          <p className="mt-1 text-[9px] font-semibold uppercase text-black/60">Plate No.</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#eeeeee] bg-white px-3 py-2.5 text-[12px]">
        <span className="flex items-center gap-2 text-[#5e5e5e]"><FiUser /> Vehicle & Status</span>
        <span className="font-semibold text-[#0e8345]">Verified · Active</span>
      </div>
    </div>
  )
}

export default CaptainDetails
