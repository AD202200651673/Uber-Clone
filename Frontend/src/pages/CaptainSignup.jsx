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
  FiUser,
} from "react-icons/fi";
import { CaptainDataContext } from "../context/CaptainContext";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage, validateCaptainRegistration } from "../validators/auth";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const { registerCaptain, isLoading, error: requestError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "car",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateCaptainRegistration(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      const { captain } = await registerCaptain({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        vehicleColor: formData.vehicleColor.trim(),
        vehiclePlate: formData.vehiclePlate.trim(),
        vehicleCapacity: formData.vehicleCapacity,
        vehicleType: formData.vehicleType,
      });

      setCaptain(captain);
      navigate("/captain-home");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Registration failed. Please try again."));
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1b1c1c]">
      <header className="h-14 border-b border-[#eeeeee] sm:h-16">
        <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6]"
          >
            <FiArrowLeft size={21} />
          </button>
          <span className="text-lg font-semibold">Captain registration</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
            <FiTruck size={17} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-3 pb-5 pt-4 sm:px-6 sm:pt-8 lg:px-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">
          Driver portal
        </p>
        <h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">
          Create captain account
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5e5e5e] sm:text-base">
          Register to start accepting rides.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <Field
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              icon={FiUser}
              placeholder="First name"
            />
            <Field
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              icon={FiUser}
              placeholder="Last name"
            />
          </div>

          <Field
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={FiMail}
            placeholder="name@example.com"
          />

          <Field
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            icon={FiLock}
            placeholder="Enter your password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className="rounded-2xl border border-[#ececec] bg-[#fafafa] p-3 sm:p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a7a7a]">
              Vehicle details
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Vehicle color"
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                icon={FiTruck}
                placeholder="Black"
              />
              <Field
                label="Vehicle plate"
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                icon={FiTruck}
                placeholder="ABC-123"
              />
              <Field
                label="Capacity"
                name="vehicleCapacity"
                type="number"
                min="1"
                value={formData.vehicleCapacity}
                onChange={handleChange}
                icon={FiTruck}
                placeholder="4"
              />
              <label className="block text-[12px] font-semibold sm:text-sm">
                Vehicle type
                <div className="mt-1 flex h-10 items-center rounded-lg bg-[#f6f6f6] px-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-12 sm:px-3">
                  <FiTruck size={17} className="mr-2 shrink-0 text-[#5e5e5e]" />
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="min-w-0 w-full bg-transparent text-[13px] font-normal outline-none sm:text-sm"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </label>
            </div>
          </div>

          {(error || requestError) && (
            <p className="text-sm font-medium text-[#ba1a1a]" role="alert">
              {error || requestError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
            {!isLoading && <FiArrowRight className="transition group-hover:translate-x-1" />}
          </button>
        </form>

        <p className="pt-5 text-center text-[13px] text-[#5e5e5e] sm:pt-8 sm:text-sm">
          Already a captain?{" "}
          <Link to="/captain-login" className="font-semibold text-black underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  placeholder,
  trailing,
  min,
}) => (
  <label className="block text-[12px] font-semibold sm:text-sm">
    {label}
    <div className="mt-1 flex h-10 items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-12 sm:px-3">
      {Icon && <Icon size={17} className="shrink-0 text-[#5e5e5e]" />}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        required
        className="min-w-0 w-full bg-transparent text-[13px] font-normal outline-none placeholder:text-[#8f8f8f] sm:text-sm"
      />
      {trailing}
    </div>
  </label>
);

export default CaptainSignup;
