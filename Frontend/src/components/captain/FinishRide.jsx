import React from "react";
import { FiArrowLeft, FiCheck, FiMapPin, FiPhone } from "react-icons/fi";
import carImage from "../../assets/car.png";
import autoImage from "../../assets/auto.png";
import bikeImage from "../../assets/bike.png";

const FinishRide = ({ ride, pickup, destination, onBack, onComplete }) => {
  const passengerName = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName} ${ride.user.fullName.lastName || ""}`.trim()
    : "Passenger";

  const userInitials = ride?.user?.fullName?.firstName
    ? `${ride.user.fullName.firstName[0]}${ride.user.fullName.lastName?.[0] || ""}`.toUpperCase()
    : "P";

  const pickupLocation = ride?.pickup || pickup || "Pickup location";
  const destinationLocation = ride?.destination || destination || "Destination location";
  const fare = ride?.fare || "0";
  const vehiclePlate = ride?.captain?.vehicle?.plate || "Vehicle";
  const vehicleType = ride?.captain?.vehicle?.vehicleType || "Ride";
  const vehicleColor = ride?.captain?.vehicle?.color || "";

  const getVehicleImage = (type) => {
    if (!type) return carImage;
    const lower = type.toLowerCase();
    if (lower.includes("auto")) return autoImage;
    if (lower.includes("bike") || lower.includes("moto")) return bikeImage;
    return carImage;
  };

  return (
    <div className="flex flex-col min-h-full pb-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              type="button"
              aria-label="Back to destination"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
            >
              <FiArrowLeft size={16} />
            </button>
          )}
          <h2 className="truncate text-[18px] sm:text-[20px] font-bold tracking-tight">Active Ride</h2>
        </div>
        <span className="shrink-0 rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold text-[#0e8345]">
          Trip in progress
        </span>
      </div>

      <div className="rounded-2xl bg-[#f3f1f0] p-3 sm:p-4">
        <div className="flex items-center gap-3 border-b border-black/10 pb-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] sm:text-[16px] font-bold capitalize">{passengerName}</p>
            <p className="truncate text-[11px] sm:text-[12px] text-[#5e5e5e]">Passenger · Cash ride</p>
          </div>
          <button
            type="button"
            aria-label="Call passenger"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
          >
            <FiPhone size={16} />
          </button>
        </div>
        <div className="mt-2.5 flex items-start gap-2.5 sm:gap-3">
          <FiMapPin className="mt-0.5 shrink-0 text-[#0054cb]" size={15} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">
              Pickup location
            </p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{pickupLocation}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-start gap-2.5 sm:gap-3">
          <FiMapPin className="mt-0.5 shrink-0 text-black" size={15} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">
              Destination
            </p>
            <p className="truncate text-[13px] sm:text-[14px] font-semibold">{destinationLocation}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2.5 sm:gap-3 border-t border-black/10 pt-2.5">
          <img
            src={getVehicleImage(vehicleType)}
            alt="Captain vehicle"
            className="h-9 w-14 sm:h-10 sm:w-16 shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] sm:text-[13px] font-bold capitalize">
              {vehiclePlate} {vehicleColor ? `· ${vehicleColor}` : ""} {vehicleType}
            </p>
            <p className="truncate text-[10px] sm:text-[11px] text-[#5e5e5e]">Ride in progress</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[14px] font-bold">₹{fare}</p>
            <p className="text-[10px] text-[#5e5e5e]">Cash</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-4 sm:mt-5 flex min-h-[48px] h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffd83d] text-sm font-bold text-black shadow-sm transition active:scale-[0.99] hover:bg-[#f5c400]"
      >
        <FiCheck size={18} /> Complete ride
      </button>
    </div>
  );
};

export default FinishRide;
