const USER_TOKEN_KEY = 'userToken'
const USER_REFRESH_TOKEN_KEY = 'userRefreshToken'
const CAPTAIN_TOKEN_KEY = 'captainToken'
const CAPTAIN_REFRESH_TOKEN_KEY = 'captainRefreshToken'

export const tokenStorage = {
  get: () => localStorage.getItem(USER_TOKEN_KEY) || localStorage.getItem(CAPTAIN_TOKEN_KEY),
  set: (token) => localStorage.setItem(USER_TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(USER_TOKEN_KEY)
    localStorage.removeItem(USER_REFRESH_TOKEN_KEY)
    localStorage.removeItem(CAPTAIN_TOKEN_KEY)
    localStorage.removeItem(CAPTAIN_REFRESH_TOKEN_KEY)
  },
  user: {
    get: () => localStorage.getItem(USER_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(USER_REFRESH_TOKEN_KEY),
    set: (token, refreshToken) => {
      if (token) localStorage.setItem(USER_TOKEN_KEY, token)
      if (refreshToken) localStorage.setItem(USER_REFRESH_TOKEN_KEY, refreshToken)
    },
    clear: () => {
      localStorage.removeItem(USER_TOKEN_KEY)
      localStorage.removeItem(USER_REFRESH_TOKEN_KEY)
    },
  },
  captain: {
    get: () => localStorage.getItem(CAPTAIN_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(CAPTAIN_REFRESH_TOKEN_KEY),
    set: (token, refreshToken) => {
      if (token) localStorage.setItem(CAPTAIN_TOKEN_KEY, token)
      if (refreshToken) localStorage.setItem(CAPTAIN_REFRESH_TOKEN_KEY, refreshToken)
    },
    clear: () => {
      localStorage.removeItem(CAPTAIN_TOKEN_KEY)
      localStorage.removeItem(CAPTAIN_REFRESH_TOKEN_KEY)
    },
  },
}
