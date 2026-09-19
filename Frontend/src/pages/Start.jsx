import React from 'react'
import { MdArrowForward } from 'react-icons/md'
import homepage from '../assets/homepage.png'
import uberLogo from '../assets/Uber_logo_2018.png'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#000000] text-white">
      <header className="absolute left-0 top-0 z-10 p-4 sm:p-6 lg:p-8 xl:p-10">
        <img
          src={uberLogo}
          alt="Uber logo"
          className="h-7 w-auto object-contain brightness-0 invert sm:h-8 lg:h-9"
        />
      </header>

      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-16 xl:gap-20">
          <section className="flex w-full items-center justify-center md:w-[52%] md:justify-end">
            <img
              src={homepage}
              alt="RideShare app splash screen illustration"
              className="w-full max-w-[360px] select-none object-contain sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[600px]"
            />
          </section>

          <footer className="w-full max-w-[500px] md:w-[48%] md:max-w-[430px] lg:max-w-[460px] xl:max-w-[500px] md:pr-2 lg:pr-0">
            <div className="mb-5 sm:mb-6 md:mb-5">
              <h2 className="text-[30px] font-bold leading-[1.12] tracking-tight text-white sm:text-[34px] md:text-[36px] lg:text-[42px]">
                Move around
                <br />
                with ease
              </h2>
              <p className="mt-2 text-[14px] font-normal leading-relaxed text-[#AFAFAF] sm:text-[15px] md:text-[16px]">
                Fast, reliable rides at the tap of a button. Anytime, anywhere.
              </p>
            </div>

            <Link
              to='/login'
              className="group flex h-[54px] w-full cursor-pointer items-center justify-between rounded-[14px] bg-white px-5 text-black no-underline shadow-lg transition-all duration-150 hover:brightness-[0.98] active:scale-[0.985] active:bg-[#ECECEC] sm:px-6"
            >
              <span className="flex-1 pl-5 text-center text-[16px] font-bold tracking-tight text-black sm:pl-6">
                Continue
              </span>
              <MdArrowForward className="text-[22px] text-black transition-transform duration-150 group-hover:translate-x-1" />
            </Link>

            <div className="mt-4 text-center sm:mt-5 md:text-left">
              <p className="text-[13px] font-normal text-[#A3A3A3] sm:text-[14px]">
                Are you a driver?
                <Link to='/captain-login' className="ml-0.5 inline-flex items-center font-medium text-white hover:underline">
                  Drive with us <span className="ml-1 text-[13px]">→</span>
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default Start