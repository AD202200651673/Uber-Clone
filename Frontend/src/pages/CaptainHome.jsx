import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { useCaptain } from "../context/CaptainContext";
import { axiosInstance } from "../api/core/api";
import CaptainDetails from "../components/captain/CaptainDetails";
import RidePopUp from "../components/captain/RidePopUp";
import ConfirmRidePopUp from "../components/captain/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking/LiveTracking";
import BottomSheet, { SNAP_POINTS } from "../components/common/BottomSheet";
import { SocketContext } from "../context/SocketContext";

const CaptainHome = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useCaptain();
  const [hasRideRequest, setHasRideRequest] = useState(false);
  const [isConfirmingRide, setIsConfirmingRide] = useState(false);
  const [ride, setRide] = useState(null);
  const [snapPoint, setSnapPoint] = useState(SNAP_POINTS.HALF);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { socket, sendMessage, receiveMessage } = useContext(SocketContext);

  useEffect(() => {
    if (!captain?._id) return;

    sendMessage("join", {
      userId: captain._id,
      usertype: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          sendMessage("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [captain?._id, sendMessage]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log('🚖 New ride request received in CaptainHome:', data);
      setRide(data);
      setHasRideRequest(true);
      setSnapPoint(SNAP_POINTS.HALF);
    };

    socket.on('new-ride', handleNewRide);

    return () => {
      socket.off('new-ride', handleNewRide);
    };
  }, [socket]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/captains/profile');
        if (response.data?.captain) {
          setCaptain(response.data.captain);
        }
      } catch (error) {
        console.error('Failed to load captain profile:', error);
      }
    };

    if (!captain?.fullName?.firstName) {
      fetchProfile();
    }
  }, [captain, setCaptain]);

  const handleAcceptRide = async () => {
    if (!ride?._id) return;
    try {
      const response = await axiosInstance.post('/api/rides/confirm-ride', {
        rideId: ride._id,
      });
      setRide(response.data);
      setHasRideRequest(false);
      setIsConfirmingRide(true);
      setSnapPoint(SNAP_POINTS.FULL);
    } catch (error) {
      console.error('Failed to accept ride:', error);
      alert(error.response?.data?.message || 'Failed to accept ride');
    }
  };

  const handleStartRide = async (otp) => {
    if (!ride?._id || !otp) return;
    try {
      const response = await axiosInstance.get('/api/rides/start-ride', {
        params: {
          rideId: ride._id,
          otp: otp,
        },
      });
      setIsConfirmingRide(false);
      setHasRideRequest(false);
      navigate('/captain-riding', { state: { ride: response.data } });
    } catch (error) {
      console.error('Failed to start ride:', error);
      alert(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-full w-full overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        {/* Top Header Floating Profile Button */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-start px-3.5 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <div className="relative pointer-events-auto">
            <button
              type="button"
              aria-label="Captain profile"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95 hover:bg-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <FiUser className="text-[16px]" />
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
                      {captain?.fullName?.firstName ? captain.fullName.firstName[0].toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[#1b1c1c]">
                        {captain?.fullName?.firstName ? `${captain.fullName.firstName} ${captain.fullName.lastName || ''}`.trim() : 'Captain'}
                      </p>
                      <p className="truncate text-[11px] text-[#716e6b]">{captain?.email || 'Captain Account'}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false)
                        navigate('/captain-logout')
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

      <BottomSheet snapPoint={snapPoint} onSnapChange={setSnapPoint}>
        {isConfirmingRide ? (
          <ConfirmRidePopUp
            ride={ride}
            onConfirm={handleStartRide}
            onCancel={() => {
              setIsConfirmingRide(false);
              setSnapPoint(SNAP_POINTS.HALF);
            }}
          />
        ) : hasRideRequest ? (
          <RidePopUp
            ride={ride}
            onIgnore={() => {
              setHasRideRequest(false);
              setSnapPoint(SNAP_POINTS.HALF);
            }}
            onAccept={handleAcceptRide}
          />
        ) : (
          <CaptainDetails captain={captain} />
        )}
      </BottomSheet>
    </main>
  );
};

export default CaptainHome;
