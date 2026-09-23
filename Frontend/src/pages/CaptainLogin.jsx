import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiTruck,
} from "react-icons/fi";
import { CaptainDataContext } from "../context/CaptainContext";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../validators/auth";

const CaptainLogin = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const { loginCaptain, isLoading, error: requestError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    loginCaptain(formData, (response) => {
      setCaptain(response.captain);
      navigate("/captain-home", { replace: true });
    }).catch((requestError) => {
      setError(getApiErrorMessage(requestError, "Sign in failed. Please try again."));
    });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#1b1c1c]">
      <header className="border-b border-[#eeeeee] bg-white pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-[#f6f6f6] active:scale-95"
          >
            <FiArrowLeft size={20} />
          </button>
          <span className="text-[17px] font-semibold tracking-tight sm:text-lg">Captain sign in</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-9 sm:w-9">
            <FiTruck size={16} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-between px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">
            Driver portal
          </p>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-black sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-5 text-[#5e5e5e] sm:text-base sm:leading-6">
            Enter your captain credentials to continue.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
          >
            <label className="block text-[13px] font-semibold text-[#1b1c1c] sm:text-sm">
              Email address
              <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl bg-[#f6f6f6] px-3.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:gap-3 sm:px-4">
                <FiMail className="shrink-0 text-[#5e5e5e]" size={18} />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="min-w-0 w-full bg-transparent text-[16px] sm:text-base font-normal outline-none placeholder:text-[#8f8f8f]"
                />
              </div>
            </label>

            <label className="block text-[13px] font-semibold text-[#1b1c1c] sm:text-sm">
              Password
              <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl bg-[#f6f6f6] px-3.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-14 sm:gap-3 sm:px-4">
                <FiLock className="shrink-0 text-[#5e5e5e]" size={18} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="min-w-0 w-full bg-transparent text-[16px] sm:text-base font-normal outline-none placeholder:text-[#8f8f8f]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label="Toggle password visibility"
                  className="p-1 text-[#5e5e5e] hover:text-black"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </label>

            {(error || requestError) && (
              <p className="rounded-lg bg-rose-50 p-2.5 text-xs sm:text-sm font-medium text-[#ba1a1a]" role="alert">
                {error || requestError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex min-h-[50px] h-12 sm:h-13 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white shadow-md transition active:scale-[0.99] hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <FiArrowRight className="transition group-hover:translate-x-1" />}
            </button>
          </form>
        </div>

        <p className="pt-8 text-center text-[13px] text-[#5e5e5e] sm:text-sm">
          New captain?{" "}
          <Link
            to="/captain-signup"
            className="font-semibold text-black underline"
          >
            Create account
          </Link>
        </p>
      </main>
    </div>
  );
};

export default CaptainLogin;
