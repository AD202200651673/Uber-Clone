import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { UserDataContext } from "../context/UserContext";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage, validateRegistration } from "../validators/auth";

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const { registerUser, isLoading, error: requestError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateRegistration(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      const { user } = await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setUser(user);
      navigate("/home", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Registration failed. Please try again."));
    }
  };

  return (
    <SignupForm
      title="Create your account"
      description="Enter your details to start riding as a rider."
      formData={formData}
      error={error || requestError}
      isSubmitting={isLoading}
      showPassword={showPassword}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onTogglePassword={() => setShowPassword((current) => !current)}
      onBack={() => navigate(-1)}
      loginPath="/login"
      icons={{
        ArrowLeft: FiArrowLeft,
        ArrowRight: FiArrowRight,
        Eye: showPassword ? FiEyeOff : FiEye,
        Lock: FiLock,
        Mail: FiMail,
        User: FiUser,
      }}
    />
  );
};

const SignupForm = ({
  title,
  description,
  formData,
  error,
  isSubmitting,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
  onBack,
  loginPath,
  icons,
}) => {
  const { ArrowLeft, ArrowRight, Eye, Lock, Mail, User } = icons;
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#1b1c1c]">
      <header className="border-b border-[#eeeeee] bg-white pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-[#f6f6f6] active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-[17px] font-semibold tracking-tight sm:text-lg">Create account</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white sm:h-9 sm:w-9">
            <User size={16} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-between px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">
            RideShare
          </p>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-black sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-5 text-[#5e5e5e] sm:text-base sm:leading-6">
            {description}
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xs:gap-2.5">
              <Field
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                icon={User}
                placeholder="First name"
              />
              <Field
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                icon={User}
                placeholder="Last name"
              />
            </div>
            <Field
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              icon={Mail}
              placeholder="name@example.com"
            />
            <Field
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onChange}
              icon={Lock}
              placeholder="Enter your password"
              trailing={
                <button
                  type="button"
                  onClick={onTogglePassword}
                  aria-label="Toggle password visibility"
                  className="p-1 text-[#5e5e5e] hover:text-black"
                >
                  <Eye size={18} />
                </button>
              }
            />
            {error && (
              <p className="rounded-lg bg-rose-50 p-2.5 text-xs sm:text-sm font-medium text-[#ba1a1a]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex min-h-[50px] h-12 sm:h-13 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white shadow-md transition active:scale-[0.99] hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              {!isSubmitting && <ArrowRight className="transition group-hover:translate-x-1" />}
            </button>
          </form>
        </div>

        <p className="pt-6 text-center text-[13px] text-[#5e5e5e] sm:pt-8 sm:text-sm">
          Already have an account?{" "}
          <Link to={loginPath} className="font-semibold text-black underline">
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
}) => (
  <label className="block text-[13px] font-semibold text-[#1b1c1c] sm:text-sm">
    {label}
    <div className="mt-1.5 flex h-12 items-center gap-2.5 rounded-xl bg-[#f6f6f6] px-3.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-13 sm:px-3.5">
      {Icon && <Icon size={18} className="shrink-0 text-[#5e5e5e]" />}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="min-w-0 w-full bg-transparent text-[16px] sm:text-sm font-normal outline-none placeholder:text-[#8f8f8f]"
      />
      {trailing}
    </div>
  </label>
);

export default UserSignup;
