import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FiArrowLeft, FiCreditCard, FiMapPin, FiRadio } from 'react-icons/fi'
import carImage from '../../assets/car.png'

const LookingForDriver = ({ ride, pickup, destination, vehicle, onBack }) => {
	const rootRef = useRef(null)
	const vehicleRef = useRef(null)
	const progressRef = useRef(null)
	const radioRef = useRef(null)
	const rideVehicle = vehicle ?? {
		name: 'UberGo',
		price: `₹${ride?.fare || '193.20'}`,
		image: carImage,
	}

	useEffect(() => {
		const context = gsap.context(() => {
			const timeline = gsap.timeline({ repeat: -1 })

			gsap.set(progressRef.current, { xPercent: -140 })

			timeline
				.fromTo(vehicleRef.current, { y: 2 }, { y: -5, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: 1 })
				.to(radioRef.current, { scale: 1.15, color: '#0054cb', duration: 0.4, ease: 'power1.out', yoyo: true, repeat: 1 }, '<')
				.to(progressRef.current, { xPercent: 320, duration: 1.8, ease: 'power1.inOut' }, '-=1.1')
		}, rootRef)

		return () => context.revert()
	}, [])

	return (
		<div ref={rootRef} className="flex min-h-full flex-col pb-2">
			<div className="mb-2 flex items-center gap-3">
				<button
					type="button"
					aria-label="Cancel driver search"
					onClick={onBack}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0] transition active:scale-95"
				>
					<FiArrowLeft size={16} />
				</button>
				<h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight">Looking for a driver</h2>
			</div>

			<div className="flex flex-col items-center py-2 sm:py-3">
				<div className="relative flex h-24 sm:h-28 w-36 sm:w-40 items-center justify-center">
					<img
						ref={vehicleRef}
						src={rideVehicle.image}
						alt={`${rideVehicle.name} vehicle`}
						className="relative z-10 h-16 sm:h-20 w-32 sm:w-36 object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.12)] animate-pulse"
					/>
				</div>
				<div className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-[#1b1c1c]">
					<FiRadio ref={radioRef} className="text-[#0054cb]" />
					<span>Finding your {rideVehicle.name} driver</span>
				</div>
				<div className="mt-2.5 h-1.5 w-36 sm:w-44 overflow-hidden rounded-full bg-[#dfeafb]" aria-label="Searching for a driver">
					<div ref={progressRef} className="h-full w-1/3 rounded-full bg-[#0054cb]" />
				</div>
				<p className="mt-1.5 text-[11px] text-[#5e5e5e]">Searching nearby drivers</p>
			</div>

			<div className="mt-2 overflow-hidden rounded-xl border border-[#eeeeee] bg-white">
				<div className="flex min-h-14 items-center gap-3 border-b border-[#eeeeee] px-3 py-2">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]"><FiMapPin className="text-[15px]" /></div>
					<div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Pickup</p><p className="truncate text-[13px] sm:text-[14px] font-semibold">{pickup || 'Current Location'}</p></div>
				</div>
				<div className="flex min-h-14 items-center gap-3 border-b border-[#eeeeee] px-3 py-2">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]"><FiMapPin className="text-[15px] text-[#0054cb]" /></div>
					<div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0054cb]">Destination</p><p className="truncate text-[13px] sm:text-[14px] font-semibold">{destination}</p></div>
				</div>
				<div className="flex min-h-14 items-center gap-3 px-3 py-2">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f1f0]"><FiCreditCard className="text-[15px]" /></div>
					<div className="flex min-w-0 flex-1 items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e5e5e]">Payment</p><p className="text-[13px] font-semibold">Cash</p></div><p className="text-[15px] font-bold text-[#1b1c1c]">{rideVehicle.price}</p></div>
				</div>
			</div>

			<div className="mt-3.5 sm:mt-4 rounded-xl bg-[#f3f1f0] px-3.5 py-2.5 text-center text-[11px] sm:text-[12px] font-medium text-[#5e5e5e]">
				We are checking nearby drivers. This usually takes a few seconds.
			</div>
		</div>
	)
}

export default LookingForDriver
