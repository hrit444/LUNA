import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { setCredentials } from '../../redux/slice/authSlice'
import Alert         from '../others/Alert'
import Field         from '../others/Field'
import TextInput     from '../others/TextInput'
import PasswordInput from '../others/PasswordInput'
import Button        from '../others/Button'
import { IconUser, IconMail } from '../others/Icons'
import '../others/ui.css'
import './RegisterForm.css'

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const onSubmit = (data) => {
    setLoading(true)
    setApiError('')

    axios
      .post('http://localhost:3000/api/auth/register',
        {
          email:    data.email,
          password: data.password,
          fullname: {
            firstname: data.fullname.firstname,
            lastname:  data.fullname.lastname,
          },
        },
        { withCredentials: true }
      )
      .then(res => {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }))
        navigate('/chat', { replace: true })
      })
      .catch(err  => setApiError(err.response?.data?.message || 'An error occurred during registration'))
      .finally(()  => setLoading(false))
  }

  return (
    <div className="luna-card luna-card--appear register-card">
      <p className="register-card__eyebrow">Get Started</p>
      <h1 className="register-card__title">
        Create Your<br />
        <span className="accent">Luna Account</span>
      </h1>

      <Alert type="error" message={apiError} />

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="luna-name-row">
          <Field label="First Name" error={errors.fullname?.firstname?.message}>
            <TextInput
              icon={<IconUser />}
              placeholder="First name"
              registerProps={register('fullname.firstname', {
                required:  'Required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
          </Field>

          <Field label="Last Name" error={errors.fullname?.lastname?.message}>
            <TextInput
              icon={<IconUser />}
              placeholder="Last name"
              registerProps={register('fullname.lastname', {
                required:  'Required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
          </Field>
        </div>

        <Field label="Email Address" error={errors.email?.message}>
          <TextInput
            icon={<IconMail />}
            type="email"
            placeholder="you@example.com"
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
            placeholder="Create a strong password"
            registerProps={register('password', { required: 'Password is required' })}
          />
        </Field>

        <Button type="submit" variant="primary" size="lg" full disabled={loading}>
          {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
        </Button>
      </form>

      <div className="luna-divider" style={{ marginTop: '22px' }} />

      <p className="register-card__footer">
        Already have an account?{' '}
        <Link to="/login" className="luna-link">Log In</Link>
      </p>

      <div className="register-card__terms">
        <Link to="/terms">Terms of Service &amp; Privacy Policy</Link>
      </div>
    </div>
  )
}

export default RegisterForm