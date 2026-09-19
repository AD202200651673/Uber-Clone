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
      navigate("/home");
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
    <div className="min-h-screen bg-white text-[#1b1c1c]">
      <header className="h-14 border-b border-[#eeeeee] sm:h-16">
        <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f6f6f6]"
          >
            <ArrowLeft size={21} />
          </button>
          <span className="text-lg font-semibold">Create account</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
            <User size={17} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-3 pb-5 pt-4 sm:px-6 sm:pt-8 lg:px-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f8f8f]">
          RideShare
        </p>
        <h1 className="text-[28px] font-bold leading-9 tracking-tight text-black sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5e5e5e] sm:text-base">
          {description}
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-4 space-y-3 sm:mt-6 sm:space-y-4"
        >
          <div className="grid grid-cols-2 gap-2.5">
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
              >
                <Eye />
              </button>
            }
          />
          {error && (
            <p className="text-sm font-medium text-[#ba1a1a]" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && <ArrowRight className="transition group-hover:translate-x-1" />}
          </button>
        </form>
        <p className="pt-5 text-center text-[13px] text-[#5e5e5e] sm:pt-8 sm:text-sm">
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
  <label className="block text-[12px] font-semibold sm:text-sm">
    {label}
    <div className="mt-1 flex h-10 items-center gap-2 rounded-lg bg-[#f6f6f6] px-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black sm:h-12 sm:px-3">
      <Icon size={17} className="shrink-0 text-[#5e5e5e]" />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="min-w-0 w-full bg-transparent text-[13px] font-normal outline-none placeholder:text-[#8f8f8f] sm:text-sm"
      />
      {trailing}
    </div>
  </label>
);

export default UserSignup;
