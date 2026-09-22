import React, { useState } from 'react'
import { FiCheck, FiMapPin } from 'react-icons/fi'

const ConfirmRidePopUp = ({ ride, onConfirm, onCancel }) => {
  const [otp, setOtp] = useState('')

  const handleOtpChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))
  }

  const passengerName = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ''}`
    : 'Passenger';
  const userInitials = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName[0]}${ride.user.fullName.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <div className="flex flex-col min-h-full">
      <h2 className="mb-4 text-[18px] font-bold tracking-[-0.02em]">Confirm this ride to Start</h2>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-[#ffd83d] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b1c1c] text-[10px] font-bold text-white">
            {userInitials}
          </div>
          <p className="text-[13px] font-semibold">{passengerName}</p>
        </div>
        <p className="text-[12px] font-bold">{(ride?.distance ? (ride.distance / 1000).toFixed(1) + ' KM' : 'Nearby')}</p>
      </div>

      <div className="divide-y divide-[#eeeeee] rounded-xl border border-[#eeeeee] bg-[#fbf9f8]">
        <div className="flex items-start gap-3 px-3 py-2.5">
          <FiMapPin className="mt-0.5 shrink-0 text-[14px]" />
          <div>
            <p className="text-[13px] font-bold">{ride?.pickup || 'Pickup'}</p>
            <p className="text-[10px] text-[#5e5e5e]">Pickup Location</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <FiMapPin className="mt-0.5 shrink-0 text-[14px]" />
          <div>
            <p className="text-[13px] font-bold">{ride?.destination || 'Destination'}</p>
            <p className="text-[10px] text-[#5e5e5e]">Destination Location</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <FiCheck className="shrink-0 text-[14px]" />
          <div>
            <p className="text-[13px] font-bold">₹{ride?.fare || '0'}</p>
            <p className="text-[10px] text-[#5e5e5e]">Cash Payment</p>
          </div>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Enter OTP</span>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter 4-digit OTP"
          className="h-12 w-full rounded-xl bg-[#f3f1f0] px-3 font-mono text-[18px] font-bold tracking-[0.25em] text-center outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-black"
          maxLength={4}
        />
      </label>

      <div className="mt-5 grid grid-cols-[1fr_1.35fr] gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-12 rounded-xl bg-[#f3f1f0] text-sm font-semibold text-[#8f8f8f] transition hover:bg-[#e9e7e5] active:scale-[0.99]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={otp.length !== 4}
          onClick={() => onConfirm(otp)}
          className="h-12 rounded-xl bg-[#0e8345] text-sm font-bold text-white transition hover:bg-[#0c733c] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start trip
        </button>
      </div>
    </div>
  )
}

export default ConfirmRidePopUp