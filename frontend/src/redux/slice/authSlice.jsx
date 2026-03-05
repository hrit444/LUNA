import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user
      state.token = payload.token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    restoreAuth: (state, { payload }) => {
      state.user = payload.user
      state.isAuthenticated = true
      state.initialized = true
    },
    initializeAuth: (state) => {
      state.initialized = true
    },
  },
})

export const { setCredentials, logout, restoreAuth, initializeAuth } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectUser = (s) => s.auth.user
export const selectToken = (s) => s.auth.token
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated
export const selectIsInitialized = (s) => s.auth.initialized