import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiLogOut,
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
import BottomSheet, { SNAP_POINTS } from '../components/common/BottomSheet'
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
  const [snapPoint, setSnapPoint] = useState(SNAP_POINTS.HALF)
  const [activeField, setActiveField] = useState('destination')
  const [suggestions, setSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [fare, setFare] = useState({})
  const [ride, setRide] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

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
      setSnapPoint(SNAP_POINTS.FULL);
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
        if (response.data && response.data.length > 0) {
          setSnapPoint(SNAP_POINTS.FULL)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error.response?.data?.message || error.message)
        setSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [pickup, destination, activeField])

  const handleLocationSelect = (location) => {
    if (activeField === 'pickup') {
      setPickup(location)
      setSuggestions([])
    } else {
      setDestination(location)
      setSuggestions([])
      setSnapPoint(SNAP_POINTS.FULL)
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
      setSnapPoint(SNAP_POINTS.FULL)
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
    setSnapPoint(SNAP_POINTS.HALF)
  }

  const handleVehicleConfirm = (vehicle) => {
    setConfirmedVehicle(vehicle)
    setSnapPoint(SNAP_POINTS.FULL)
  }

  const handleBackToVehicles = () => {
    setConfirmedVehicle(null)
    setSnapPoint(SNAP_POINTS.FULL)
  }

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
      setSnapPoint(SNAP_POINTS.FULL)
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
    setSnapPoint(SNAP_POINTS.FULL)
  }

  const handleDestinationChange = (event) => {
    const value = event.target.value
    setDestination(value)
    setActiveField('destination')
    setSnapPoint(SNAP_POINTS.FULL)
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      {/* Live Map Area */}
      <section className="relative h-full w-full overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        {/* Top Header Floating Controls with Safe Area Insets */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-start px-3.5 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <div className="relative pointer-events-auto">
            <button
              type="button"
              aria-label="User profile"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-md transition active:scale-95 hover:bg-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <FiUser className="text-[17px]" />
              </span>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute left-0 top-13 z-50 w-[calc(100vw-2.5rem)] max-w-xs sm:w-64 rounded-2xl border border-black/5 bg-white p-3.5 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      {user?.fullName?.firstName ? user.fullName.firstName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[#1b1c1c]">
                        {user?.fullName?.firstName ? `${user.fullName.firstName} ${user.fullName.lastName || ''}`.trim() : 'User'}
                      </p>
                      <p className="truncate text-[11px] text-[#716e6b]">{user?.email || 'Rider Account'}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false)
                        navigate('/user-logout')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-rose-600 transition hover:bg-rose-50 active:scale-[0.98]"
                    >
                      <FiLogOut className="text-[16px]" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3-Stage Responsive Bottom Sheet Component */}
      <BottomSheet snapPoint={snapPoint} onSnapChange={setSnapPoint}>
        {/* Peek State Quick Bar */}
        {snapPoint === SNAP_POINTS.PEEK && !isWaitingForDriver && !isLookingForDriver && !confirmedVehicle && !selectedDestination && (
          <button
            type="button"
            onClick={() => setSnapPoint(SNAP_POINTS.FULL)}
            className="mt-1 flex w-full items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition hover:bg-neutral-50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0054cb]/10 text-[#0054cb]">
                <FiSearch className="text-[17px]" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-[14px] font-bold text-[#1b1c1c]">Where to?</p>
                <p className="truncate text-[11px] text-[#716e6b]">Tap to plan your ride & see fares</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#f3f1f0] px-3 py-1 text-[11px] font-semibold text-[#1b1c1c]">
              Search
            </span>
          </button>
        )}

        {/* Main Flow Content */}
        {(snapPoint !== SNAP_POINTS.PEEK || isWaitingForDriver || isLookingForDriver || confirmedVehicle || selectedDestination) && (
          <>
            <div className="mb-3">
              <h2 className="text-[19px] sm:text-[21px] font-bold tracking-tight">Plan your trip</h2>
            </div>

            {isWaitingForDriver ? (
              <WaitingForDriver
                ride={ride}
                pickup={pickup}
                destination={selectedDestination}
                vehicle={confirmedVehicle}
                onBack={() => {
                  setIsWaitingForDriver(false)
                  setIsLookingForDriver(true)
                  setSnapPoint(SNAP_POINTS.FULL)
                }}
                onCancel={handleChooseAnotherLocation}
              />
            ) : isLookingForDriver ? (
              <LookingForDriver
                ride={ride}
                pickup={pickup}
                destination={selectedDestination}
                vehicle={confirmedVehicle}
                onBack={() => {
                  setIsLookingForDriver(false)
                  setSnapPoint(SNAP_POINTS.FULL)
                }}
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
                <div className="relative flex items-stretch gap-2 rounded-[20px] bg-[#f3f1f0] p-2.5 sm:gap-2.5 sm:p-3 shadow-inner">
                  <div className="flex w-3.5 sm:w-4 flex-col items-center justify-between py-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0054cb] ring-4 ring-[#dfeafb]" />
                    <div className="my-1 h-8 w-0.5 bg-[#d9d5d2]" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-[#1b1c1c]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p>
                        <input
                          type="text"
                          value={pickup}
                          onFocus={() => {
                            setActiveField('pickup')
                            setSnapPoint(SNAP_POINTS.FULL)
                          }}
                          onChange={handlePickupChange}
                          placeholder="Pickup location"
                          className="w-full bg-transparent text-[16px] sm:text-[15px] font-medium outline-none placeholder:text-[#999]"
                        />
                      </div>
                      <FiNavigation className="ml-2 shrink-0 text-[18px] text-[#5e5e5e]" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p>
                        <input
                          type="text"
                          value={destination}
                          onFocus={() => {
                            setActiveField('destination')
                            setSnapPoint(SNAP_POINTS.FULL)
                          }}
                          onChange={handleDestinationChange}
                          placeholder="Where to?"
                          className="w-full bg-transparent text-[16px] sm:text-[15px] font-medium placeholder:text-[#8f8f8f] outline-none"
                        />
                      </div>
                      <FiSearch className="ml-2 shrink-0 text-[18px]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-around pl-0.5">
                    <button
                      type="button"
                      aria-label="Swap locations"
                      onClick={() => {
                        const temp = pickup
                        setPickup(destination)
                        setDestination(temp)
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb] transition active:scale-95 hover:bg-[#e4e0de]"
                    >
                      <FiRepeat size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Add stop"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeceb] transition active:scale-95 hover:bg-[#e4e0de]"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFindTrip}
                  className="mt-4 flex min-h-[48px] h-12 w-full items-center justify-center rounded-xl bg-black text-sm font-semibold text-white shadow-md transition active:scale-[0.99] hover:bg-neutral-800"
                >
                  Find Trip
                </button>

                {suggestions.length > 0 && (
                  <SuggestionList
                    suggestions={suggestions}
                    onSelect={handleLocationSelect}
                    isLoading={isLoadingSuggestions}
                  />
                )}
              </>
            )}
          </>
        )}
      </BottomSheet>
    </div>
  )
}

export default Home
