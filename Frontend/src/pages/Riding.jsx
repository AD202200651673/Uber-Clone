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
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-full w-full overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <Link to="/home" aria-label="Go home" className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95">
            <FiArrowLeft />
          </Link>
          <button type="button" aria-label="Profile" className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiUser className="text-[16px]" /></span>
          </button>
        </div>
      </section>

      <BottomSheet snapPoint={snapPoint} onSnapChange={setSnapPoint}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0e8345]" />
              <h1 className="text-[20px] font-bold tracking-[-0.02em]">You are on your way</h1>
            </div>
            <p className="mt-1 text-[12px] text-[#5e5e5e]">Arriving at your destination · ₹{fare}</p>
          </div>
          <span className="rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold text-[#0e8345]">In progress</span>
        </div>

        <div className="mb-4 rounded-2xl bg-[#f3f1f0] p-3">
          <div className="flex items-center gap-3">
            <img src={carImage} alt={vehicleType} className="h-14 w-20 rounded-lg object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold capitalize">{captainName}</p>
              <p className="text-[12px] text-[#5e5e5e] capitalize">{vehiclePlate} · {vehicleColor} {vehicleType}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Message driver" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><FiMessageSquare /></button>
              <button type="button" aria-label="Call driver" className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><FiPhone /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3">
          <FiMapPin className="mt-0.5 text-[16px] text-black" />
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p><p className="text-[14px] font-semibold">{pickup}</p></div>
          <FiMapPin className="mt-0.5 text-[16px] text-[#0054cb]" />
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p><p className="text-[14px] font-semibold">{destination}</p></div>
        </div>
      </BottomSheet>
    </main>
  )
}

export default Riding