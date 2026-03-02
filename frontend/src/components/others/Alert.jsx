import React from 'react'
import './ui.css'

const Alert = ({ type, message }) => {
  if (!message) return null
  return (
    <div className={`luna-alert luna-alert--${type}`}>
      {message}
    </div>
  )
}

export default Alert
