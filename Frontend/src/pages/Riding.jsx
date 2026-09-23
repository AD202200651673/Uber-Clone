import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiMessageSquare, FiPhone, FiUser } from 'react-icons/fi'
import carImage from '../assets/car.png'
import LiveTracking from '../components/LiveTracking/LiveTracking'
import BottomSheet, { SNAP_POINTS } from '../components/common/BottomSheet'
import { SocketContext } from '../context/SocketContext'

const Riding = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const ride = location.state?.ride
  const { socket } = useContext(SocketContext)
  const [snapPoint, setSnapPoint] = useState(SNAP_POINTS.HALF)

  useEffect(() => {
    if (!socket) return

    const handleRideEnded = () => {
      console.log('🚖 Ride completed by captain, navigating to home')
      navigate('/home')
    }

    socket.on('ride-ended', handleRideEnded)

    return () => {
      socket.off('ride-ended', handleRideEnded)
    }
  }, [socket, navigate])

  const pickup = ride?.pickup || 'Pickup location'
  const destination = ride?.destination || 'Destination location'
  const captainName = ride?.captain?.fullName?.firstName
    ? `${ride.captain.fullName.firstName} ${ride.captain.fullName.lastName || ''}`
    : 'Captain'
  const vehiclePlate = ride?.captain?.vehicle?.plate || 'GJ-01-AB-1234'
  const vehicleType = ride?.captain?.vehicle?.vehicleType || 'Car'
  const vehicleColor = ride?.captain?.vehicle?.color || 'White'
  const fare = ride?.fare || '0'

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-full w-full overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3.5 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <Link
            to="/home"
            aria-label="Go home"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <FiArrowLeft size={18} />
          </Link>
          <button
            type="button"
            aria-label="Profile"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <FiUser className="text-[16px]" />
            </span>
          </button>
        </div>
      </section>

      <BottomSheet snapPoint={snapPoint} onSnapChange={setSnapPoint}>
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0e8345]" />
              <h1 className="text-[18px] sm:text-[20px] font-bold tracking-tight">You are on your way</h1>
            </div>
            <p className="mt-1 text-[12px] text-[#5e5e5e]">Arriving at your destination · ₹{fare}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold text-[#0e8345]">
            In progress
          </span>
        </div>

        <div className="mb-3.5 rounded-2xl bg-[#f3f1f0] p-3 sm:p-3.5">
          <div className="flex items-center gap-3">
            <img src={carImage} alt={vehicleType} className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-lg object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] sm:text-[15px] font-bold capitalize">{captainName}</p>
              <p className="truncate text-[11px] sm:text-[12px] text-[#5e5e5e] capitalize">{vehiclePlate} · {vehicleColor} {vehicleType}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Message driver"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
              >
                <FiMessageSquare size={16} />
              </button>
              <button
                type="button"
                aria-label="Call driver"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
              >
                <FiPhone size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 rounded-xl border border-[#eeeeee] bg-white p-3">
          <FiMapPin className="mt-0.5 text-[15px] text-black" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{pickup}</p>
          </div>
          <FiMapPin className="mt-0.5 text-[15px] text-[#0054cb]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{destination}</p>
          </div>
        </div>
      </BottomSheet>
    </main>
  )
}

export default Riding