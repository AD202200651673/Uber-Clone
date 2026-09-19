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

export const getApiErrorMessage = (error, fallback) => {
  const responseData = error.response?.data
  return responseData?.errors?.[0]?.msg || responseData?.message || fallback
}
