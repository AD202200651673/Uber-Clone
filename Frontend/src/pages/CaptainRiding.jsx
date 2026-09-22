import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import FinishRide from "../components/captain/FinishRide";
import LiveTracking from "../components/LiveTracking/LiveTracking";
import { axiosInstance } from "../api/core/api";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;

  const [isFinishingRide, setIsFinishingRide] = useState(false);
  const destination = ride?.destination || "Destination location";
  const pickup = ride?.pickup || "Pickup location";

  const handleEndRide = async () => {
    if (!ride?._id) {
      navigate('/captain-home');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/rides/end-ride', {
        rideId: ride._id,
      });

      if (response.status === 200) {
        navigate('/captain-home');
      }
    } catch (error) {
      console.error('Failed to end ride:', error);
      alert(error.response?.data?.message || 'Failed to complete ride');
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <Link
            to="/captain-home"
            aria-label="Go back"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition active:scale-95"
          >
            <FiArrowLeft />
          </Link>
          <button
            type="button"
            aria-label="Captain profile"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <FiUser />
            </span>
          </button>
        </div>
      </section>

      {isFinishingRide ? (
        <FinishRide
          ride={ride}
          pickup={pickup}
          destination={destination}
          onBack={() => setIsFinishingRide(false)}
          onComplete={handleEndRide}
        />
      ) : (
      <section className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] border-t border-black/5 bg-[#fbf9f8] px-4 pb-7 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#d7d2ce]" />
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#f3f1f0] px-3 py-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">
              Destination
            </p>
            <p className="mt-1 text-[15px] font-bold">{destination}</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold">4 km</p>
            <p className="text-[11px] text-[#5e5e5e]">12 min away</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFinishingRide(true)}
          className="mt-5 h-12 w-full rounded-xl bg-[#ffd83d] text-sm font-bold text-black transition active:scale-[0.99]"
        >
          Finish ride
        </button>
      </section>
      )}
    </main>
  );
};

export default CaptainRiding;
