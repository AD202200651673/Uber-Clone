import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  FiChevronDown,
  FiClock,
  FiMenu,
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiRepeat,
  FiSearch,
  FiTarget,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import SuggestionList from '../components/home/SuggestionList'
import VehicleSelection from '../components/home/VehicleSelection'
import ConfirmRide from '../components/home/ConfirmRide'
import LookingForDriver from '../components/home/LookingFordriver'
import WaitingForDriver from '../components/home/WaitingForDriver'
import mapImage from '../assets/map.png'
import { axiosInstance } from '../api/core/api'

const Home = () => {
  const navigate = useNavigate()

  // useEffect(() => {
  //   // Test API call to maps get-coordinates
  //   axiosInstance
  //     .get('/api/maps/get-coordinates', {
  //       params: {
  //         address: 'sheryians coding school indrapur',
  //       },
  //     })
  //     .then((res) => {
  //       console.log('Coordinates response:', res.data)
  //     })
  //     .catch((err) => {
  //       console.error('Coordinates error in browser:', err.response?.data || err.message)
  //     })
  // }, [])
  const [pickup, setPickup] = useState('Current Location')
  const [destination, setDestination] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [confirmedVehicle, setConfirmedVehicle] = useState(null)
  const [isLookingForDriver, setIsLookingForDriver] = useState(false)
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const sheetRef = useRef(null)
  const dragStartY = useRef(0)
  const dragStartExpanded = useRef(false)
  const pointerState = useRef({ active: false })

  const suggestions = useMemo(
    () => [
      { label: 'Work', subtitle: 'Office · 12 min away' },
      { label: 'SFO Terminal 2', subtitle: 'Airport · 18 min away' },
      { label: 'Set pin on map', subtitle: 'Choose a custom drop-off' },
    ],
    [],
  )

  useEffect(() => {
    if (!sheetRef.current) return undefined

    gsap.to(sheetRef.current, {
      height: isExpanded ? window.innerHeight : '48vh',
      duration: 0.45,
      ease: 'power3.inOut',
    })

    return undefined
  }, [isExpanded])

  useEffect(() => {
    if (!isLookingForDriver) return undefined

    const timer = window.setTimeout(() => {
      setIsLookingForDriver(false)
      setIsWaitingForDriver(true)
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [isLookingForDriver])

  const expandSheet = () => setIsExpanded(true)
  const collapseSheet = () => setIsExpanded(false)

  const handleLocationSelect = (location) => {
    setDestination(location)
    setSelectedDestination(location)
    setIsExpanded(true)
  }

  const handleChooseAnotherLocation = () => {
    setSelectedDestination('')
    setConfirmedVehicle(null)
    setIsLookingForDriver(false)
    setIsWaitingForDriver(false)
    setDestination('')
    setIsExpanded(true)
  }

  const handleVehicleConfirm = (vehicle) => {
    setConfirmedVehicle(vehicle)
    setIsExpanded(true)
  }

  const handleBackToVehicles = () => setConfirmedVehicle(null)

  const handleConfirmRide = (vehicle) => {
    setConfirmedVehicle(vehicle)
    setIsLookingForDriver(true)
    setIsWaitingForDriver(false)
    setIsExpanded(true)
  }

  const handleDestinationChange = (event) => {
    const value = event.target.value
    setDestination(value)
    setIsExpanded(value.trim().length > 0)
  }

  const handleDragStart = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragStartY.current = event.clientY
    dragStartExpanded.current = isExpanded
    pointerState.current.active = true
  }

  const handleDragMove = (event) => {
    if (!pointerState.current.active || !sheetRef.current) return

    const delta = event.clientY - dragStartY.current
    if (dragStartExpanded.current && delta > 0) {
      gsap.set(sheetRef.current, { y: Math.min(delta, window.innerHeight * 0.35) })
    } else if (!dragStartExpanded.current && delta < 0) {
      gsap.set(sheetRef.current, { y: Math.max(delta * 0.35, -80) })
    }
  }

  const handleDragEnd = (event) => {
    if (!sheetRef.current) return

    const delta = event.clientY - dragStartY.current
    gsap.to(sheetRef.current, { y: 0, duration: 0.2, ease: 'power2.out' })

    if (dragStartExpanded.current && delta > 90) collapseSheet()
    if (!dragStartExpanded.current && delta < -60) expandSheet()
    pointerState.current.active = false
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[50vh] min-h-[340px] w-full overflow-hidden bg-[#e6e2db]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mapImage})` }} aria-label="City map" />
        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute left-[42%] top-[54%] z-10 h-32 w-1 origin-top rotate-[48deg] border-l-4 border-dashed border-[#256df0]" />
        <div className="absolute left-[42%] top-[54%] z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0054cb]/30 animate-ping" />
        <div className="absolute left-[42%] top-[54%] z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[2.5px] border-white bg-[#0054cb] shadow-md"><span className="h-2.5 w-2.5 rounded-full bg-white" /></div>
        <div className="absolute left-[42%] top-[54%] z-10 -translate-x-1/2 -translate-y-[38px] whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-md">You are here</div>
        <FiTruck className="absolute left-[48%] top-[30%] z-10 rotate-[-15deg] rounded bg-[#1b1c1c] p-1 text-2xl text-white shadow" />
        <FiTruck className="absolute left-[58%] top-[54%] z-10 rounded bg-[#1b1c1c] p-1 text-2xl text-white shadow" />
        <FiMapPin className="absolute left-[76%] top-[18%] z-10 text-2xl text-black drop-shadow" />

        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pb-2 pt-4">
          <button type="button" aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition active:scale-95"><FiMenu className="text-xl" /></button>
          <button type="button" aria-label="User profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition active:scale-95"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiUser className="text-[17px]" /></span></button>
        </div>
        <button type="button" aria-label="Recenter map" className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-lg backdrop-blur-sm transition active:scale-95"><FiTarget className="text-xl" /></button>
      </section>

      <section
        ref={sheetRef}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onLostPointerCapture={handleDragEnd}
        style={{ touchAction: 'none' }}
        className="absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-[28px] border-t border-black/5 bg-[#fbf9f8] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="flex w-full justify-center pt-3 pb-1"><div className="h-1.5 w-10 rounded-full bg-[#d7d2ce]" /></div>
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-[20px] font-bold tracking-[-0.02em]">Plan your trip</h2><button type="button" className="flex items-center gap-1 rounded-full bg-[#f3f1f0] px-3 py-1.5 text-[12px] font-semibold"><FiClock className="text-[13px]" /><span>Now</span><FiChevronDown className="text-[14px]" /></button></div>
          {isWaitingForDriver ? (
            <WaitingForDriver
              pickup={pickup}
              destination={selectedDestination}
              vehicle={confirmedVehicle}
              onBack={() => {
                setIsWaitingForDriver(false)
                setIsLookingForDriver(true)
              }}
              onCancel={handleChooseAnotherLocation}
              onStartRide={() => navigate('/riding')}
            />
          ) : isLookingForDriver ? (
            <LookingForDriver
              pickup={pickup}
              destination={selectedDestination}
              vehicle={confirmedVehicle}
              onBack={() => setIsLookingForDriver(false)}
            />
          ) : confirmedVehicle ? (
            <ConfirmRide
              pickup={pickup}
              destination={selectedDestination}
              vehicle={confirmedVehicle}
              onBack={handleBackToVehicles}
              onConfirm={handleConfirmRide}
            />
          ) : selectedDestination ? (
            <VehicleSelection
              destination={selectedDestination}
              onBack={handleChooseAnotherLocation}
              onConfirm={handleVehicleConfirm}
            />
          ) : (
            <>
              <button type="button" onClick={() => (isExpanded ? collapseSheet() : expandSheet())} className="mb-3 flex w-full items-center justify-center rounded-[20px] bg-[#f3f1f0] py-2 text-sm font-medium">{isExpanded ? 'Collapse sheet' : 'Expand sheet'}</button>

              <div className="relative flex items-stretch gap-2.5 rounded-[20px] bg-[#f3f1f0] p-3">
            <div className="flex w-4 flex-col items-center justify-between py-2.5"><div className="h-2.5 w-2.5 rounded-full bg-[#0054cb] ring-4 ring-[#dfeafb]" /><div className="my-1 h-8 w-0.5 bg-[#d9d5d2]" /><div className="h-2.5 w-2.5 rounded-sm bg-[#1b1c1c]" /></div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p><input type="text" value={pickup} onChange={(event) => setPickup(event.target.value)} className="w-full bg-transparent text-[15px] font-medium outline-none" /></div><FiNavigation className="ml-3 text-[18px] text-[#5e5e5e]" /></div>
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p><input type="text" value={destination} onFocus={expandSheet} onChange={handleDestinationChange} placeholder="Where to?" className="w-full bg-transparent text-[15px] font-medium placeholder:text-[#8f8f8f] outline-none" /></div><FiSearch className="ml-3 text-[18px]" /></div>
            </div>
            <div className="flex flex-col items-center justify-around pl-1"><button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb]"><FiRepeat /></button><button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb]"><FiPlus /></button></div>
              </div>

              {isExpanded && <SuggestionList suggestions={suggestions} onSelect={handleLocationSelect} />}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
