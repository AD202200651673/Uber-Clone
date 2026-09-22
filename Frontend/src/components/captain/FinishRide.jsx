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
    <div className="flex flex-col min-h-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              aria-label="Back to destination"
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
            >
              <FiArrowLeft />
            </button>
          )}
          <h2 className="text-[20px] font-bold tracking-[-0.02em]">Active Ride</h2>
        </div>
        <span className="rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold text-[#0e8345]">
          Trip in progress
        </span>
      </div>

      <div className="rounded-2xl bg-[#f3f1f0] p-4">
        <div className="flex items-center gap-3 border-b border-black/10 pb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold capitalize">{passengerName}</p>
            <p className="text-[12px] text-[#5e5e5e]">Passenger · Cash ride</p>
          </div>
          <button
            type="button"
            aria-label="Call passenger"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <FiPhone />
          </button>
        </div>
        <div className="mt-3 flex items-start gap-3">
          <FiMapPin className="mt-0.5 text-[#0054cb]" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">
              Pickup location
            </p>
            <p className="mt-1 text-[14px] font-semibold">{pickupLocation}</p>
            <p className="mt-1 text-[11px] text-[#5e5e5e]">
              Passenger pickup confirmed
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-3">
          <FiMapPin className="mt-0.5 text-black" />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">
              Destination
            </p>
            <p className="mt-1 text-[14px] font-semibold">{destinationLocation}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-black/10 pt-3">
          <img
            src={getVehicleImage(vehicleType)}
            alt="Captain vehicle"
            className="h-10 w-16 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold capitalize">
              {vehiclePlate} {vehicleColor ? `· ${vehicleColor}` : ""} {vehicleType}
            </p>
            <p className="text-[11px] text-[#5e5e5e]">Ride completed</p>
          </div>
          <div className="text-right">
            <p className="text-[14px] font-bold">₹{fare}</p>
            <p className="text-[10px] text-[#5e5e5e]">Cash</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffd83d] text-sm font-bold text-black transition active:scale-[0.99]"
      >
        <FiCheck /> Complete ride
      </button>
    </div>
  );
};

export default FinishRide;
