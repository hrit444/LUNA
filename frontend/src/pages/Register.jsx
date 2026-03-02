import React from 'react'
import { Link } from 'react-router-dom'
import Background    from '../components/others/Background'
import Footer        from '../components/others/Footer'
import RegisterForm  from '../components/register/RegisterForm'
import './Register.css'

const Register = () => (
  <div className="luna-page register-page">
    <Background />

    {/* Minimal header — no full Navbar on register */}
    <header className="register-page__header">
      <Link to="/" className="register-page__logo">
        <div className="register-page__logo-dot" />
        Luna <span className="register-page__logo-ai">AI</span>
      </Link>
      <Link to="/login" className="luna-link" style={{ fontSize: '0.85rem', letterSpacing: '0.08em' }}>
        Sign In →
      </Link>
    </header>

    <main className="register-page__main">
      <RegisterForm />
    </main>

    <Footer />
  </div>
)

export default Register
