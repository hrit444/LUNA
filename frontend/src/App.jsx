import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import MainRoutes from './routes/MainRoutes'
import { restoreAuth, initializeAuth } from './redux/slice/authSlice'
import './styles/globals.css'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Verify session using httpOnly cookie
    axios.get('https://luna-8gpi.onrender.com/api/auth/me', { withCredentials: true })
      .then(res => {
        dispatch(restoreAuth({ user: res.data.user }))
      })
      .catch(() => {
        // No valid session, mark as initialized
        dispatch(initializeAuth())
      })
  }, [dispatch])

  return (
      <MainRoutes />
  )
}

export default App