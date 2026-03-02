import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => (
  <footer className="footer">
    <span className="footer-copy">© 2025 Luna AI. All rights reserved.</span>
    <div className="footer-links">
      <Link to="/terms">Terms of Service</Link>
      <Link to="/privacy">Privacy Policy</Link>
    </div>
  </footer>
)

export default Footer
