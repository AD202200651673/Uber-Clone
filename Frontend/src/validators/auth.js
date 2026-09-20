export const validateRegistration = ({ firstName, lastName, email, password }) => {
  if (![firstName, lastName, email, password].every((value) => value.trim())) {
    return 'Please complete all required fields.'
  }

  if (firstName.trim().length < 3 || lastName.trim().length < 3) {
    return 'First and last names must be at least 3 characters long.'
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.'
  }

  return ''
}

export const validateCaptainRegistration = ({
  firstName,
  lastName,
  email,
  password,
  vehicleColor,
  vehiclePlate,
  vehicleCapacity,
  vehicleType,
}) => {
  if (
    ![
      firstName,
      lastName,
      email,
      password,
      vehicleColor,
      vehiclePlate,
      vehicleCapacity,
      vehicleType,
    ].every((value) => String(value).trim())
  ) {
    return 'Please complete all required captain details.'
  }

  if (firstName.trim().length < 3 || lastName.trim().length < 3) {
    return 'First and last names must be at least 3 characters long.'
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.'
  }

  if (vehicleColor.trim().length < 3) {
    return 'Vehicle color must be at least 3 characters long.'
  }

  if (vehiclePlate.trim().length < 3) {
    return 'Vehicle plate must be at least 3 characters long.'
  }

  const capacity = Number(vehicleCapacity)
  if (!Number.isInteger(capacity) || capacity < 1) {
    return 'Vehicle capacity must be at least 1.'
  }

  if (!['car', 'bike', 'van'].includes(vehicleType)) {
    return 'Vehicle type must be car, bike, or van.'
  }

  return ''
}

export const getApiErrorMessage = (error, fallback) => {
  const responseData = error.response?.data
  return responseData?.errors?.[0]?.msg || responseData?.message || fallback
}
