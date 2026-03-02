import React from 'react'
import './ui.css'

const Field = ({ label, error, children }) => (
  <div className="luna-field">
    {label && <label className="luna-label">{label}</label>}
    {children}
    {error && <p className="luna-field-error">⚠ {error}</p>}
  </div>
)

export default Field
