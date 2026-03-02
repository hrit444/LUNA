import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const NavLogo = () => (
  <Link to="/" className="nav-logo">
    <div className="nav-logo__dot" />
    Luna <span className="nav-logo__ai">AI</span>
  </Link>
)

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <NavLogo />

      <ul className="nav-links">
        <li>
          <Link to="/register" className="nav-cta-btn">GET STARTED</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
