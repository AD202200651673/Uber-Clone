import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import FinishRide from "../components/captain/FinishRide";
import LiveTracking from "../components/LiveTracking/LiveTracking";
import BottomSheet, { SNAP_POINTS } from "../components/common/BottomSheet";
import { axiosInstance } from "../api/core/api";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;

  const [snapPoint, setSnapPoint] = useState(SNAP_POINTS.HALF);
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
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-full w-full overflow-hidden bg-[#e6e2db]">
        <LiveTracking className="h-full w-full" />

        <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-3.5 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <Link
            to="/captain-home"
            aria-label="Go back"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <FiArrowLeft size={18} />
          </Link>
          <button
            type="button"
            aria-label="Captain profile"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <FiUser size={16} />
            </span>
          </button>
        </div>
      </section>

      <BottomSheet snapPoint={snapPoint} onSnapChange={setSnapPoint}>
        <FinishRide
          ride={ride}
          pickup={pickup}
          destination={destination}
          onComplete={handleEndRide}
        />
      </BottomSheet>
    </main>
  );
};

export default CaptainRiding;
