import React from 'react'
import { FiArrowLeft, FiMessageSquare, FiPhone, FiStar } from 'react-icons/fi'
import carImage from '../../assets/car.png'

const WaitingForDriver = ({ pickup, destination, vehicle, onBack, onCancel, onStartRide }) => {
  const rideVehicle = vehicle ?? {
    name: 'UberGo',
    price: '₹193.20',
    image: carImage,
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-label="Back to driver search"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
          >
            <FiArrowLeft />
          </button>
          <div className="min-w-0 text-left">
            <div className="flex items-center justify-start gap-1.5 text-left">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0e8345]" />
              <h2 className="text-[20px] font-bold tracking-[-0.02em]">Driver is on the way</h2>
            </div>
            <p className="mt-1 text-[12px] text-[#5e5e5e]">Estimated arrival at 12:38 PM (3 min away)</p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl bg-[#f3f1f0] px-3 py-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-[#5e5e5e]">Pin code</p>
          <p className="text-[20px] font-bold tracking-[0.08em]">4819</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#f3f1f0] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[13px] font-bold tracking-[0.08em]">
              <span className="text-[10px] text-[#0054cb]">CA</span>
              7XYZ892
            </div>
            <p className="text-[17px] font-bold">Toyota Camry</p>
            <p className="text-[12px] text-[#5e5e5e]">Midnight Black · Executive Sedan</p>
          </div>
          <img src={rideVehicle.image} alt={`${rideVehicle.name} vehicle`} className="h-16 w-24 rounded-lg object-contain" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1c1c] text-sm font-bold text-white">MV</div>
            <div>
              <p className="text-[15px] font-bold">Marcus Vance</p>
              <p className="flex items-center gap-1 text-[12px] text-[#5e5e5e]"><FiStar className="text-[#1b1c1c]" /> 4.98 · 1,420+ trips</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Message driver" className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><FiMessageSquare /></button>
            <button type="button" aria-label="Call driver" className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><FiPhone /></button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f3f1f0] p-4">
        <div className="flex gap-3">
          <div className="flex w-3 flex-col items-center pt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-black" />
            <span className="my-1 h-8 w-px bg-[#cfc4c5]" />
            <span className="h-2.5 w-2.5 bg-[#0054cb]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup spot</p>
              <span className="text-[11px] font-semibold text-[#0054cb]">Wait at curb</span>
            </div>
            <p className="mt-1 text-[14px] font-semibold">{pickup || 'Corner of Market & 4th St'}</p>
            <p className="mt-1 text-[11px] text-[#5e5e5e]">Meet driver at designated loading zone</p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Destination</p>
            <p className="mt-1 text-[14px] font-semibold">{destination || 'Financial District · 555 California St'}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '8px' }} className="text-center">
        <button type="button" onClick={onStartRide} className="mb-4 block w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition active:scale-[0.99]">
          Start ride
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-[#ba1a1a] transition hover:underline">
          Cancel ride
        </button>
      </div>
    </div>
  )
}

export default WaitingForDriver
