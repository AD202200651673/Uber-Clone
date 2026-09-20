const USER_TOKEN_KEY = 'userToken'
const CAPTAIN_TOKEN_KEY = 'captainToken'

export const tokenStorage = {
  get: () => localStorage.getItem(USER_TOKEN_KEY),
  set: (token) => localStorage.setItem(USER_TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(USER_TOKEN_KEY)
    localStorage.removeItem(CAPTAIN_TOKEN_KEY)
  },
  user: {
    get: () => localStorage.getItem(USER_TOKEN_KEY),
    set: (token) => localStorage.setItem(USER_TOKEN_KEY, token),
    clear: () => localStorage.removeItem(USER_TOKEN_KEY),
  },
  captain: {
    get: () => localStorage.getItem(CAPTAIN_TOKEN_KEY),
    set: (token) => localStorage.setItem(CAPTAIN_TOKEN_KEY, token),
    clear: () => localStorage.removeItem(CAPTAIN_TOKEN_KEY),
  },
}
