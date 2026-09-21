import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiNavigation,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import mapImage from "../assets/map.png";
import FinishRide from "../components/captain/FinishRide";

const CaptainRiding = () => {
  const navigate = useNavigate();
  const [isFinishingRide, setIsFinishingRide] = useState(false);
  const destination = "Financial District · 555 California St";
  const pickup = "Corner of Market & 4th St";

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#e6e2db]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${mapImage})` }}
          aria-label="Captain ride map"
        />
        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute left-[25%] top-[62%] h-40 w-1 origin-top rotate-48 border-l-4 border-dashed border-[#256df0]" />
        <div className="absolute left-[25%] top-[62%] flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black shadow-lg">
          <FiMapPin className="text-[10px] text-white" />
        </div>
        <div className="absolute left-[75%] top-[18%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white bg-[#0054cb] shadow-lg" />
        <div className="absolute left-[52%] top-[43%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e8345]/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#0e8345] shadow-lg">
            <FiNavigation className="text-xl text-white" />
          </div>
        </div>

        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <button
            type="button"
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition active:scale-95"
          >
            <FiArrowLeft />
          </button>
          <button
            type="button"
            aria-label="Captain profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md transition active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <FiUser />
            </span>
          </button>
        </div>
        <button
          type="button"
          aria-label="Recenter map"
          className="absolute bottom-5 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-lg transition active:scale-95"
        >
          <FiTarget className="text-xl" />
        </button>
      </section>

      {isFinishingRide ? (
        <FinishRide
          pickup={pickup}
          destination={destination}
          onBack={() => setIsFinishingRide(false)}
          onComplete={() => navigate('/captain-home')}
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
