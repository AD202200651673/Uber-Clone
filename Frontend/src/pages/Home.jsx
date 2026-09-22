import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  FiChevronDown,
  FiClock,
  FiMenu,
  FiNavigation,
  FiPlus,
  FiRepeat,
  FiSearch,
  FiUser,
} from 'react-icons/fi'
import SuggestionList from '../components/home/SuggestionList'
import VehicleSelection from '../components/home/VehicleSelection'
import ConfirmRide from '../components/home/ConfirmRide'
import LookingForDriver from '../components/home/LookingFordriver'
import WaitingForDriver from '../components/home/WaitingForDriver'
import LiveTracking from '../components/LiveTracking/LiveTracking'
import { axiosInstance } from '../api/core/api'
import { SocketContext } from '../context/SocketContext'
import { UserContext } from '../context/UserContext'

const Home = () => {
  const navigate = useNavigate()
  
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [confirmedVehicle, setConfirmedVehicle] = useState(null)
  const [isLookingForDriver, setIsLookingForDriver] = useState(false)
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeField, setActiveField] = useState('destination')
  const [suggestions, setSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [fare, setFare] = useState({})
  const [ride, setRide] = useState(null)

  const sheetRef = useRef(null)
  const dragStartY = useRef(0)
  const dragStartExpanded = useRef(false)
  const pointerState = useRef({ active: false })

  const { socket, sendMessage, receiveMessage } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/users/profile');
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    if (!user?._id) {
      fetchUserProfile();
    }
  }, [user, setUser]);

  useEffect(() => {
    if (!user?._id) return;

    sendMessage("join", {
      userId: user._id,
      usertype: "user"
    });

    receiveMessage("message", (data) => {
      console.log('Socket message received:', data);
    });
  }, [user?._id, sendMessage, receiveMessage]);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (confirmedRide) => {
      console.log('🚖 Ride confirmed by captain:', confirmedRide);
      setRide(confirmedRide);
      setIsLookingForDriver(false);
      setIsWaitingForDriver(true);
      setIsExpanded(true);
    };

    socket.on('ride-confirmed', handleRideConfirmed);

    const handleRideStarted = (startedRide) => {
      console.log('🚖 Ride started by captain:', startedRide);
      setIsWaitingForDriver(false);
      navigate('/riding', { state: { ride: startedRide } });
    };

    socket.on('ride-started', handleRideStarted);

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed);
      socket.off('ride-started', handleRideStarted);
    };
  }, [socket, navigate]);

  useEffect(() => {
    const query = activeField === 'pickup' ? pickup : destination
    if (!query || query.trim().length < 3) {
      setSuggestions([])
      return undefined
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true)
        const response = await axiosInstance.get('/api/maps/get-suggestions', {
          params: { address: query },
        })
        setSuggestions(response.data || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error.response?.data?.message || error.message)
        setSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [pickup, destination, activeField])

  useEffect(() => {
    if (!sheetRef.current) return undefined

    gsap.to(sheetRef.current, {
      height: isExpanded ? window.innerHeight : '48vh',
      duration: 0.45,
      ease: 'power3.inOut',
    })

    return undefined
  }, [isExpanded])



  const expandSheet = () => setIsExpanded(true)
  const collapseSheet = () => setIsExpanded(false)

  const handleLocationSelect = (location) => {
    if (activeField === 'pickup') {
      setPickup(location)
      setSuggestions([])
    } else {
      setDestination(location)
      setSuggestions([])
      setIsExpanded(true)
    }
  }

  const handleFindTrip = async () => {
    if (!pickup.trim()) {
      alert('Please enter a pickup location')
      return
    }
    if (!destination.trim()) {
      alert('Please enter a destination')
      return
    }
    
    try {
      const response = await axiosInstance.get('/api/rides/get-fare', {
        params: {
          pickup,
          destination,
        },
      })
      setFare(response.data || {})
      setSelectedDestination(destination)
      setSuggestions([])
      setIsExpanded(true)
    } catch (error) {
      console.error('Error fetching fare:', error.response?.data?.message || error.message)
      alert(error.response?.data?.message || 'Failed to fetch fare for the selected route')
    }
  }

  const handleChooseAnotherLocation = () => {
    setSelectedDestination('')
    setConfirmedVehicle(null)
    setIsLookingForDriver(false)
    setIsWaitingForDriver(false)
    setSuggestions([])
    setIsExpanded(true)
  }

  const handleVehicleConfirm = (vehicle) => {
    setConfirmedVehicle(vehicle)
    setIsExpanded(true)
  }

  const handleBackToVehicles = () => setConfirmedVehicle(null)

  const handleConfirmRide = async (vehicle) => {
    try {
      const response = await axiosInstance.post('/api/rides/create', {
        pickup,
        destination: selectedDestination || destination,
        vehicleType: vehicle?.id || confirmedVehicle?.id || 'car',
      })
      console.log('Ride created successfully:', response.data)
      setRide(response.data)
      setConfirmedVehicle(vehicle)
      setIsLookingForDriver(true)
      setIsWaitingForDriver(false)
      setIsExpanded(true)
    } catch (error) {
      console.error('Error creating ride:', error.response?.data?.message || error.message)
      alert(error.response?.data?.message || 'Failed to create ride')
      throw error
    }
  }

  const handlePickupChange = (event) => {
    const value = event.target.value
    setPickup(value)
    setActiveField('pickup')
    setIsExpanded(true)
  }

  const handleDestinationChange = (event) => {
    const value = event.target.value
    setDestination(value)
    setActiveField('destination')
    setIsExpanded(true)
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
        <LiveTracking className="h-full w-full" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pb-2 pt-4">
          <button type="button" aria-label="Open menu" className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition active:scale-95"><FiMenu className="text-xl" /></button>
          <button type="button" aria-label="User profile" className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition active:scale-95"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiUser className="text-[17px]" /></span></button>
        </div>
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
              ride={ride}
              pickup={pickup}
              destination={selectedDestination}
              vehicle={confirmedVehicle}
              onBack={() => {
                setIsWaitingForDriver(false)
                setIsLookingForDriver(true)
              }}
              onCancel={handleChooseAnotherLocation}
            />
          ) : isLookingForDriver ? (
            <LookingForDriver
              ride={ride}
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
              fare={fare}
              onBack={handleChooseAnotherLocation}
              onConfirm={handleVehicleConfirm}
            />
          ) : (
            <>
              <button type="button" onClick={() => (isExpanded ? collapseSheet() : expandSheet())} className="mb-3 flex w-full items-center justify-center rounded-[20px] bg-[#f3f1f0] py-2 text-sm font-medium">{isExpanded ? 'Collapse sheet' : 'Expand sheet'}</button>

              <div className="relative flex items-stretch gap-2.5 rounded-[20px] bg-[#f3f1f0] p-3">
                <div className="flex w-4 flex-col items-center justify-between py-2.5"><div className="h-2.5 w-2.5 rounded-full bg-[#0054cb] ring-4 ring-[#dfeafb]" /><div className="my-1 h-8 w-0.5 bg-[#d9d5d2]" /><div className="h-2.5 w-2.5 rounded-sm bg-[#1b1c1c]" /></div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p>
                      <input
                        type="text"
                        value={pickup}
                        onFocus={() => {
                          setActiveField('pickup')
                          setIsExpanded(true)
                        }}
                        onChange={handlePickupChange}
                        placeholder="Pickup location"
                        className="w-full bg-transparent text-[15px] font-medium outline-none"
                      />
                    </div>
                    <FiNavigation className="ml-3 text-[18px] text-[#5e5e5e]" />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p>
                      <input
                        type="text"
                        value={destination}
                        onFocus={() => {
                          setActiveField('destination')
                          expandSheet()
                        }}
                        onChange={handleDestinationChange}
                        placeholder="Where to?"
                        className="w-full bg-transparent text-[15px] font-medium placeholder:text-[#8f8f8f] outline-none"
                      />
                    </div>
                    <FiSearch className="ml-3 text-[18px]" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-around pl-1"><button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb]"><FiRepeat /></button><button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb]"><FiPlus /></button></div>
              </div>

              <button
                type="button"
                onClick={handleFindTrip}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition active:scale-[0.99]"
              >
                Find Trip
              </button>

              {isExpanded && suggestions.length > 0 && (
                <SuggestionList
                  suggestions={suggestions}
                  onSelect={handleLocationSelect}
                  isLoading={isLoadingSuggestions}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
