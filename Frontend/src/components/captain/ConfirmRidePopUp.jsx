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
    <section className="absolute inset-x-3 bottom-4 z-50 rounded-2xl border border-[#eeeeee] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d7d2ce]" />
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
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter 4-digit OTP"
          className="h-11 w-full rounded-xl border border-[#eeeeee] bg-[#f3f1f0] px-3 text-center text-[18px] font-bold tracking-[0.35em] outline-none transition focus:border-black focus:bg-white"
        />
      </label>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => onConfirm?.(otp)}
          disabled={otp.length !== 4}
          className="h-10 rounded-md bg-[#4da35b] text-[12px] font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#b7cdb9]"
        >
          Confirm
        </button>
        <button type="button" onClick={onCancel} className="h-10 rounded-md bg-[#d33b2c] text-[12px] font-bold text-white transition active:scale-[0.99]">Cancel</button>
      </div>
    </section>
  )
}

export default ConfirmRidePopUp