import React from 'react'
import { FiArrowLeft, FiMapPin, FiMessageSquare, FiPhone, FiTarget, FiUser } from 'react-icons/fi'
import carImage from '../assets/car.png'
import mapImage from '../assets/map.png'

const Riding = () => {
  const pickup = 'Corner of Market & 4th St'
  const destination = 'Financial District · 555 California St'

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede8] text-[#1b1c1c]">
      <section className="relative h-[58vh] min-h-[380px] overflow-hidden bg-[#e6e2db]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mapImage})` }} aria-label="Ride map" />
        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute left-[23%] top-[65%] h-40 w-1 origin-top rotate-[48deg] border-l-4 border-dashed border-[#256df0]" />
        <div className="absolute left-[23%] top-[65%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-lg" />
        <div className="absolute left-[75%] top-[18%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white bg-[#0054cb] shadow-lg" />

        <div className="absolute left-[52%] top-[43%] z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0054cb]/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0054cb] shadow-lg">
            <img src={carImage} alt="Your ride" className="h-7 w-9 object-contain brightness-0 invert" />
          </div>
        </div>

        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
          <button type="button" aria-label="Go back" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95">
            <FiArrowLeft />
          </button>
          <button type="button" aria-label="Profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white"><FiUser className="text-[16px]" /></span>
          </button>
        </div>

        <button type="button" aria-label="Recenter map" className="absolute bottom-5 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white/95 shadow-lg transition active:scale-95">
          <FiTarget className="text-xl" />
        </button>
      </section>

      <section className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] border-t border-black/5 bg-[#fbf9f8] px-4 pb-7 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#d7d2ce]" />

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0e8345]" />
              <h1 className="text-[20px] font-bold tracking-[-0.02em]">You are on your way</h1>
            </div>
            <p className="mt-1 text-[12px] text-[#5e5e5e]">Arriving in 12 min · 3.4 km</p>
          </div>
          <span className="rounded-full bg-[#e7f3ec] px-3 py-1 text-[11px] font-semibold text-[#0e8345]">In progress</span>
        </div>

        <div className="mb-4 rounded-2xl bg-[#f3f1f0] p-3">
          <div className="flex items-center gap-3">
            <img src={carImage} alt="Toyota Camry" className="h-14 w-20 rounded-lg object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold">Toyota Camry</p>
              <p className="text-[12px] text-[#5e5e5e]">7XYZ892 · Midnight Black</p>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Message driver" className="flex h-9 w-9 items-center justify-center rounded-full bg-white"><FiMessageSquare /></button>
              <button type="button" aria-label="Call driver" className="flex h-9 w-9 items-center justify-center rounded-full bg-white"><FiPhone /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3">
          <FiMapPin className="mt-0.5 text-[16px] text-black" />
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p><p className="text-[14px] font-semibold">{pickup}</p></div>
          <FiMapPin className="mt-0.5 text-[16px] text-[#0054cb]" />
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p><p className="text-[14px] font-semibold">{destination}</p></div>
        </div>
      </section>
    </main>
  )
}

export default Riding