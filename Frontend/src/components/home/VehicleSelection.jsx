import React, { useState } from 'react'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import autoImage from '../../assets/auto.png'
import bikeImage from '../../assets/bike.png'
import carImage from '../../assets/car.png'

const VehicleSelection = ({ destination, fare = {}, onBack, onConfirm }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('car')

  const vehicleOptions = [
    {
      id: 'car',
      name: 'UberGo',
      detail: 'Affordable, compact rides',
      eta: '2 mins away',
      price: fare.car ? `₹${fare.car}` : '₹--',
      image: carImage,
    },
    {
      id: 'motorcycle',
      name: 'Moto',
      detail: 'Affordable motorcycle rides',
      eta: '3 mins away',
      price: (fare.motorcycle || fare.moto) ? `₹${fare.motorcycle || fare.moto}` : '₹--',
      image: bikeImage,
    },
    {
      id: 'auto',
      name: 'UberAuto',
      detail: 'Affordable Auto rides',
      eta: '3 mins away',
      price: fare.auto ? `₹${fare.auto}` : '₹--',
      image: autoImage,
    },
  ]

  return (
    <div className="flex min-h-full flex-col pb-2">
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Choose another location"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
        >
          <FiArrowLeft size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Destination</p>
          <p className="truncate text-[14px] font-semibold text-[#1b1c1c]">{destination}</p>
        </div>
      </div>

      <h2 className="mb-2.5 text-[18px] sm:text-[20px] font-bold tracking-tight">Choose a vehicle</h2>

      <div className="space-y-2">
        {vehicleOptions.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.id

          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`flex w-full items-center gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-3 text-left transition ${
                isSelected
                  ? 'relative z-10 border-2 border-black bg-[#fbf9f8] shadow-sm'
                  : 'border-[#eeeeee] bg-white hover:bg-neutral-50'
              }`}
            >
              <div className="flex h-12 w-14 sm:h-14 sm:w-16 shrink-0 items-center justify-center rounded-lg bg-[#f3f1f0]">
                <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-10 w-12 sm:h-12 sm:w-14 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-[15px] sm:text-[16px] font-bold text-[#1b1c1c]">{vehicle.name}</p>
                  {isSelected && <FiCheck className="text-[14px] text-black" />}
                </div>
                <p className="text-[11px] sm:text-[12px] font-medium text-[#1b1c1c]">{vehicle.eta}</p>
                <p className="truncate text-[10px] sm:text-[11px] text-[#5e5e5e]">{vehicle.detail}</p>
              </div>
              <p className="shrink-0 text-[14px] sm:text-[15px] font-bold text-[#1b1c1c]">{vehicle.price}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onConfirm?.(vehicleOptions.find((vehicle) => vehicle.id === selectedVehicle))}
        className="mt-4 sm:mt-6 flex min-h-[48px] h-12 w-full items-center justify-center rounded-xl bg-black text-sm font-semibold text-white shadow-md transition active:scale-[0.99] hover:bg-neutral-800"
      >
        Confirm {vehicleOptions.find((vehicle) => vehicle.id === selectedVehicle)?.name}
      </button>
    </div>
  )
}

export default VehicleSelection
