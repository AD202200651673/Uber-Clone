import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiNavigation,
  FiTarget,
  FiUser
} from "react-icons/fi";
import { useCaptain } from "../context/CaptainContext";
import { axiosInstance } from "../api/core/api";
import CaptainDetails from "../components/captain/CaptainDetails";
import RidePopUp from "../components/captain/RidePopUp";
import ConfirmRidePopUp from "../components/captain/ConfirmRidePopUp";
import mapImage from "../assets/map.png";

const CaptainHome = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = useCaptain();
  const [isOnline, setIsOnline] = useState(false);
  const [hasRideRequest, setHasRideRequest] = useState(false);
  const [isConfirmingRide, setIsConfirmingRide] = useState(false);

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

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[58vh] min-h-[390px] overflow-hidden bg-[#e6e2db]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${mapImage})` }}
          aria-label="Captain map"
        />
        <div className="absolute inset-0 bg-white/10" />

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
              setIsOnline((current) => !current);
              setHasRideRequest((current) => !isOnline && !current);
              setIsConfirmingRide(false);
            }}
            className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#1b1c1c] shadow-sm transition active:scale-95"
          >
            {isOnline ? "Go offline" : "Go online"}
          </button>
        </div>

        <div className="absolute left-0 right-0 top-[72px] z-20 flex items-center justify-between px-4">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <FiMenu className="text-xl" />
          </button>
          <button
            type="button"
            aria-label="Captain profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <FiUser className="text-[16px]" />
            </span>
          </button>
        </div>

        <div
          className={`absolute left-[48%] top-[52%] z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${isOnline ? "bg-[#0e8345]/20" : "bg-[#f3a12b]/25"}`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ${isOnline ? "bg-[#0e8345]" : "bg-[#1b1c1c]"}`}
          >
            <FiNavigation className="text-xl text-white" />
          </div>
        </div>
        <button
          type="button"
          aria-label="Recenter map"
          className="absolute bottom-5 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-lg transition active:scale-95"
        >
          <FiTarget className="text-xl" />
        </button>
      </section>

      {isConfirmingRide ? (
        <ConfirmRidePopUp
          onConfirm={() => {
            setIsConfirmingRide(false);
            setHasRideRequest(false);
            navigate('/captain-riding');
          }}
          onCancel={() => setIsConfirmingRide(false)}
        />
      ) : hasRideRequest ? (
        <RidePopUp
          onIgnore={() => setHasRideRequest(false)}
          onAccept={() => setIsConfirmingRide(true)}
        />
      ) : (
        <CaptainDetails captain={captain} isOnline={isOnline} />
      )}
    </main>
  );
};

export default CaptainHome;
