export const ENV = {
  API_BASE_URL: import.meta.env.DEV
    ? ''
    : import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || import.meta.env.BASE_VITE_URL || 'http://localhost:3000',
}

