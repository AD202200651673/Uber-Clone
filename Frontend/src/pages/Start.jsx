import React from 'react'
import { MdArrowForward } from 'react-icons/md'
import homepage from '../assets/homepage.png'
import uberLogo from '../assets/Uber_logo_2018.png'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-between overflow-x-hidden bg-[#000000] text-white pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] px-4 sm:px-6 md:px-8">
      {/* Top Header Logo */}
      <header className="w-full max-w-[1600px] mx-auto py-2">
        <img
          src={uberLogo}
          alt="Uber logo"
          className="h-6 w-auto object-contain brightness-0 invert sm:h-7 md:h-8"
        />
      </header>

      {/* Main Content Layout */}
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center justify-center py-4 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-16">
        {/* Splash Illustration */}
        <section className="flex w-full flex-1 items-center justify-center py-2 md:w-[50%] md:justify-center">
          <img
            src={homepage}
            alt="RideShare app splash screen illustration"
            className="h-auto max-h-[36vh] w-full max-w-[280px] xs:max-w-[320px] sm:max-h-[44vh] sm:max-w-[380px] md:max-h-[480px] md:max-w-[460px] lg:max-w-[520px] select-none object-contain transition-all"
          />
        </section>

        {/* Action & Description Card */}
        <footer className="w-full max-w-[480px] md:w-[50%] md:max-w-[440px] lg:max-w-[480px] pt-2">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[26px] xs:text-[30px] font-bold leading-[1.15] tracking-tight text-white sm:text-[34px] md:text-[38px] lg:text-[42px]">
              Move around
              <br />
              with ease
            </h1>
            <p className="mt-1.5 text-[13px] xs:text-[14px] font-normal leading-relaxed text-[#AFAFAF] sm:text-[15px] md:text-[16px]">
              Fast, reliable rides at the tap of a button. Anytime, anywhere.
            </p>
          </div>

          <Link
            to='/login'
            className="group flex min-h-[52px] h-[52px] sm:h-[56px] w-full cursor-pointer items-center justify-between rounded-[14px] bg-white px-5 text-black no-underline shadow-lg transition-all duration-150 hover:brightness-[0.96] active:scale-[0.985] active:bg-[#ECECEC] sm:px-6"
          >
            <span className="flex-1 text-center text-[15px] sm:text-[16px] font-bold tracking-tight text-black">
              Continue
            </span>
            <MdArrowForward className="text-[20px] sm:text-[22px] text-black transition-transform duration-150 group-hover:translate-x-1" />
          </Link>

          <div className="mt-3.5 text-center sm:mt-5 md:text-left">
            <p className="text-[12px] xs:text-[13px] font-normal text-[#A3A3A3] sm:text-[14px]">
              Are you a driver?{' '}
              <Link to='/captain-login' className="inline-flex items-center font-semibold text-white hover:underline">
                Drive with us <span className="ml-1 text-[13px]">→</span>
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Start