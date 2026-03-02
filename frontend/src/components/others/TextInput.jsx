import React from 'react'
import './ui.css'

const TextInput = ({ icon, type = 'text', placeholder, registerProps, ...rest }) => (
  <div className="luna-input-wrap">
    {icon && <span className="luna-input-icon">{icon}</span>}
    <input
      type={type}
      placeholder={placeholder}
      className={`luna-input${icon ? ' luna-input--icon' : ''}`}
      {...registerProps}
      {...rest}
    />
  </div>
)

export default TextInput
