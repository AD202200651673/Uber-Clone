import React, { useState } from 'react'
import { FiArrowLeft, FiCreditCard, FiMapPin } from 'react-icons/fi'
import carImage from '../../assets/car.png'

const ConfirmRide = ({ pickup, destination, vehicle, onBack, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rideVehicle = vehicle ?? {
    id: 'car',
    name: 'UberGo',
    price: '₹193.20',
    image: carImage,
  }

  const handleConfirmClick = async () => {
    try {
      setIsSubmitting(true)
      await onConfirm?.(rideVehicle)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col pb-2">
      <div className="mb-2 flex items-center gap-3">
        <button
          type="button"
          aria-label="Back to vehicle selection"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95 disabled:opacity-50"
        >
          <FiArrowLeft size={16} />
        </button>
        <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight">Confirm your Ride</h2>
      </div>

      <div className="flex flex-col items-center py-1.5 sm:py-2">
        <img src={rideVehicle.image} alt={`${rideVehicle.name} vehicle`} className="h-14 sm:h-16 w-24 sm:w-28 object-contain" />
        <p className="mt-1 text-[13px] font-bold text-[#1b1c1c]">{rideVehicle.name}</p>
      </div>

      <div className="mt-2 overflow-hidden rounded-xl border border-[#eeeeee] bg-white">
        <div className="flex min-h-14 items-center gap-3 border-b border-[#eeeeee] px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]">
            <FiMapPin className="text-[15px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{pickup || 'Current Location'}</p>
          </div>
        </div>
        <div className="flex min-h-14 items-center gap-3 border-b border-[#eeeeee] px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]">
            <FiMapPin className="text-[15px] text-[#0054cb]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{destination}</p>
          </div>
        </div>
        <div className="flex min-h-14 items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]">
            <FiCreditCard className="text-[15px]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Payment</p>
              <p className="text-[13px] font-semibold">Cash</p>
            </div>
            <p className="text-[15px] font-bold text-[#1b1c1c]">{rideVehicle.price}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleConfirmClick}
        className="mt-4 sm:mt-5 flex min-h-[48px] h-12 w-full items-center justify-center rounded-xl bg-black text-sm font-semibold text-white shadow-md transition active:scale-[0.99] hover:bg-neutral-800 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating Ride...' : 'Confirm Ride'}
      </button>
    </div>
  )
}

export default ConfirmRide
