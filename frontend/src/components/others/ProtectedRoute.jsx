import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsInitialized } from '../../redux/slice/authSlice'

/**
 * Wraps any route that requires authentication.
 * Saves the attempted URL so we can redirect back after login.
 * Waits for auth initialization before making redirect decisions.
 */

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isInitialized = useSelector(selectIsInitialized)
  const location = useLocation()

  // Wait for auth to be initialized before deciding to redirect
  if (!isInitialized) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
