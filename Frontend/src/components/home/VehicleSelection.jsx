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
    <div className="flex min-h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          aria-label="Choose another location"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
        >
          <FiArrowLeft />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Destination</p>
          <p className="truncate text-[15px] font-semibold">{destination}</p>
        </div>
      </div>

      <h2 className="mb-3 text-[20px] font-bold tracking-[-0.02em]">Choose a vehicle</h2>

      <div className="space-y-2.5">
        {vehicleOptions.map((vehicle) => {
          const isSelected = selectedVehicle === vehicle.id

          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`flex min-h-22 w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                isSelected
                  ? 'relative z-10 border-2 border-black bg-[#fbf9f8]'
                  : 'border-[#eeeeee] bg-white'
              }`}
            >
              <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f3f1f0]">
                <img src={vehicle.image} alt={`${vehicle.name} vehicle`} className="h-12 w-14 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-[16px] font-bold">{vehicle.name}</p>
                  {isSelected && <FiCheck className="text-[15px]" />}
                </div>
                <p className="text-[12px] font-medium text-[#1b1c1c]">{vehicle.eta}</p>
                <p className="truncate text-[11px] text-[#5e5e5e]">{vehicle.detail}</p>
              </div>
              <p className="shrink-0 text-[15px] font-bold">{vehicle.price}</p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onConfirm?.(vehicleOptions.find((vehicle) => vehicle.id === selectedVehicle))}
        className="mt-10 h-12 w-full rounded-xl bg-black text-sm font-semibold text-white transition active:scale-[0.99]"
      >
        Confirm {vehicleOptions.find((vehicle) => vehicle.id === selectedVehicle)?.name}
      </button>
    </div>
  )
}

export default VehicleSelection
