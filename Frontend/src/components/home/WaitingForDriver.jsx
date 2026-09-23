import React from 'react'
import { FiArrowLeft, FiMessageSquare, FiPhone, FiStar } from 'react-icons/fi'
import carImage from '../../assets/car.png'

const WaitingForDriver = ({ ride, pickup, destination, vehicle, onBack, onCancel }) => {
  const rideVehicle = vehicle ?? {
    name: 'UberGo',
    price: `₹${ride?.fare || '193.20'}`,
    image: carImage,
  }

  const captainName = ride?.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
    : 'Captain'

  const captainInitials = ride?.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName[0]}${ride.captain.fullName.lastName?.[0] || ''}`.toUpperCase()
    : 'CP'

  const vehiclePlate = ride?.captain?.vehicle?.plate || 'GJ-01-AB-1234'
  const vehicleType = ride?.captain?.vehicle?.vehicleType || 'Car'
  const vehicleColor = ride?.captain?.vehicle?.color || 'White'
  const otp = ride?.otp || '----'

  return (
    <div className="flex min-h-full flex-col pb-2">
      <div className="mb-3 flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            aria-label="Back to driver search"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
          >
            <FiArrowLeft size={16} />
          </button>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 text-left">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0e8345]" />
              <h2 className="truncate text-[17px] sm:text-[19px] font-bold tracking-tight">Captain is on the way</h2>
            </div>
            <p className="mt-0.5 text-[11px] sm:text-[12px] text-[#5e5e5e]">Estimated arrival: 3-5 mins away</p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl bg-[#ffd83d] px-2.5 py-1.5 sm:px-3 sm:py-2 text-center shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#1b1c1c]">OTP</p>
          <p className="text-[18px] sm:text-[20px] font-extrabold tracking-[0.15em] text-[#1b1c1c]">{otp}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#f3f1f0] p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[12px] font-bold tracking-[0.08em] shadow-sm">
              <span className="text-[10px] text-[#0054cb]">IND</span>
              {vehiclePlate}
            </div>
            <p className="text-[15px] sm:text-[17px] font-bold capitalize">{vehicleType}</p>
            <p className="text-[11px] sm:text-[12px] text-[#5e5e5e] capitalize">{vehicleColor} · {vehicleType}</p>
          </div>
          <img src={rideVehicle.image} alt={`${rideVehicle.name} vehicle`} className="h-12 w-20 sm:h-16 sm:w-24 shrink-0 rounded-lg object-contain" />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b1c1c] text-xs font-bold text-white">
              {captainInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold">{captainName}</p>
              <p className="flex items-center gap-1 text-[11px] text-[#5e5e5e]"><FiStar className="text-[#1b1c1c]" size={12} /> 4.95 · Verified Driver</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              aria-label="Message driver"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
            >
              <FiMessageSquare size={15} />
            </button>
            <button
              type="button"
              aria-label="Call driver"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
            >
              <FiPhone size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-[#f3f1f0] p-3 sm:p-4">
        <div className="flex gap-3">
          <div className="flex w-3 flex-col items-center pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-black" />
            <span className="my-1 h-7 w-px bg-[#cfc4c5]" />
            <span className="h-2.5 w-2.5 bg-[#0054cb]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup spot</p>
              <span className="text-[10px] font-semibold text-[#0054cb]">Wait at curb</span>
            </div>
            <p className="mt-0.5 truncate text-[13px] sm:text-[14px] font-semibold">{pickup || 'Corner of Market & 4th St'}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Destination</p>
            <p className="mt-0.5 truncate text-[13px] sm:text-[14px] font-semibold">{destination || 'Financial District · 555 California St'}</p>
          </div>
        </div>
      </div>

      <div className="mt-3.5 text-center">
        <button
          type="button"
          onClick={onCancel}
          className="flex min-h-[46px] h-11 w-full items-center justify-center rounded-xl bg-[#fee2e2] text-sm font-semibold text-[#ba1a1a] transition active:scale-[0.99]"
        >
          Cancel ride
        </button>
      </div>
    </div>
  )
}

export default WaitingForDriver
