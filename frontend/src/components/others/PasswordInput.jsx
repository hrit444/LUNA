import React, { useState } from 'react'
import { IconLock, IconEye, IconEyeOff } from './Icons'
import './ui.css'

const PasswordInput = ({ placeholder, registerProps }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="luna-input-wrap">
      <span className="luna-input-icon"><IconLock /></span>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="luna-input luna-input--icon luna-input--icon-right"
        {...registerProps}
      />
      <button
        type="button"
        className="luna-eye-btn"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )
}

export default PasswordInput
