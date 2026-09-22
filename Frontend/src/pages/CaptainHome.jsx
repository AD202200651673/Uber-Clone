import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiNavigation,
  FiUser
} from "react-icons/fi";
import { useCaptain } from "../context/CaptainContext";
import { axiosInstance } from "../api/core/api";
import CaptainDetails from "../components/captain/CaptainDetails";
import RidePopUp from "../components/captain/RidePopUp";
import ConfirmRidePopUp from "../components/captain/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking/LiveTracking";
import { SocketContext } from "../context/SocketContext";

const CaptainHome = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useCaptain();
  const [isOnline, setIsOnline] = useState(false);
  const [hasRideRequest, setHasRideRequest] = useState(false);
  const [isConfirmingRide, setIsConfirmingRide] = useState(false);
  const [ride, setRide] = useState(null);

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
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[58vh] min-h-[390px] overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        <div
          className={`absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 transition-colors ${isOnline ? "bg-[#0e8345]" : "bg-[#f3a12b]"}`}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/15">
              <FiNavigation className="text-xl" />
            </div>
            <div>
              <p className="text-[15px] font-bold">
                {isOnline ? "You are online" : "You are offline"}
              </p>
              <p className="text-[11px] text-white/85">
                {isOnline
                  ? "Ready to accept new trips"
                  : "Go online to start accepting jobs"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOnline((current) => {
                const nextOnlineState = !current;
                if (!nextOnlineState) {
                  setHasRideRequest(false);
                  setIsConfirmingRide(false);
                  setRide(null);
                }
                return nextOnlineState;
              });
            }}
            className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#1b1c1c] shadow-sm transition active:scale-95"
          >
            {isOnline ? "Go offline" : "Go online"}
          </button>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-[72px] z-20 flex items-center justify-between px-4">
          <button
            type="button"
            aria-label="Open menu"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <FiMenu className="text-xl" />
          </button>
          <button
            type="button"
            aria-label="Captain profile"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <FiUser className="text-[16px]" />
            </span>
          </button>
        </div>
      </section>

      {isConfirmingRide ? (
        <ConfirmRidePopUp
          ride={ride}
          onConfirm={handleStartRide}
          onCancel={() => setIsConfirmingRide(false)}
        />
      ) : hasRideRequest ? (
        <RidePopUp
          ride={ride}
          onIgnore={() => setHasRideRequest(false)}
          onAccept={handleAcceptRide}
        />
      ) : (
        <CaptainDetails captain={captain} isOnline={isOnline} />
      )}
    </main>
  );
};

export default CaptainHome;
