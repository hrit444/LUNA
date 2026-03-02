import React from 'react'
import './ui.css'

/**
 * Props:
 *  variant  - 'primary' | 'ghost'   (default: 'primary')
 *  size     - 'sm' | 'md' | 'lg'   (default: 'lg')
 *  full     - boolean               (default: false)
 *  as       - 'button' | 'a'        (default: 'button')
 *  type     - button type attr      (default: 'button')
 */
const Button = ({
  children,
  variant = 'primary',
  size    = 'lg',
  full    = false,
  as: Tag = 'button',
  type    = 'button',
  disabled,
  onClick,
  href,
  ...rest
}) => {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    full ? 'btn--full' : '',
  ].filter(Boolean).join(' ')

  if (Tag === 'a') {
    return <a href={href} className={cls} {...rest}>{children}</a>
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}

export default Button
