import React from 'react'
import Background from '../components/others/Background'
import Navbar     from '../components/navbar/Navbar'
import Footer     from '../components/others/Footer'
import LoginForm  from '../components/login/LoginForm'
import './Login.css'

const Login = () => (
  <div className="luna-page login-page">
    <Background />
    <Navbar />
    <main className="login-page__main">
      <LoginForm />
    </main>
    <Footer />
  </div>
)

export default Login
