import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { setCredentials } from '../../redux/slice/authSlice'
import Alert         from '../others/Alert'
import Field         from '../others/Field'
import TextInput     from '../others/TextInput'
import PasswordInput from '../others/PasswordInput'
import Button        from '../others/Button'
import { IconMail }  from '../others/Icons'
import '../others/ui.css'
import './LoginForm.css'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Redirect to the page they tried to visit, or /chat
  const from = location.state?.from?.pathname || '/chat'

  const onSubmit = (data) => {
    setLoading(true)
    setApiError('')

    axios
      .post(
        'http://localhost:3000/api/auth/login',
        { email: data.email, password: data.password },
        { withCredentials: true }
      )
      .then(res => {
        // Expect { user: {...}, token: '...' } from your API
        dispatch(setCredentials({
          user:  res.data.user,
          token: res.data.token,
        }))
        navigate('/chat', { replace: true }) // ensure chat reloads to fetch conversations
      })
      .catch(err => setApiError(err.response?.data?.message || 'An error occurred during login'))
      .finally(()  => setLoading(false))
  }

  return (
    <div className="login-wrap">
      <div className="luna-orb">AI</div>

      <div className="luna-card luna-card--appear login-card">
        <h1 className="login-card__title">
          LUNA <span className="accent">AI</span>
        </h1>

        <Alert type="error" message={apiError} />

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Email" error={errors.email?.message}>
            <TextInput
              icon={<IconMail />}
              type="email"
              placeholder="Enter your email"
              registerProps={register('email', {
                required: 'Email is required',
                pattern: {
                  value:   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <PasswordInput
              placeholder="Enter your password"
              registerProps={register('password', { required: 'Password is required' })}
            />
            <div className="luna-forgot">
              <Link to="/forgot-password" className="luna-link" style={{ fontSize: '0.8rem' }}>
                Forgot Password?
              </Link>
            </div>
          </Field>

          <Button type="submit" variant="primary" size="lg" full disabled={loading}>
            {loading ? 'CONNECTING…' : 'ACCESS LUNA'}
          </Button>
        </form>

        <div className="luna-divider" style={{ marginTop: '22px' }} />

        <p className="login-card__footer">
          Don't have an account?{' '}
          <Link to="/register" className="luna-link">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm