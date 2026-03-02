import React from 'react'
import Background  from '../components/others/Background'
import Navbar      from '../components/navbar/Navbar'
import Footer      from '../components/others/Footer'
import Hero        from '../components/home/Hero'
import Features    from '../components/home/Features'
import ChatPreview from '../components/home/ChatPreview'
import CTA         from '../components/home/CTA'
import '../components/others/ui.css'
import './Home.css'

const Home = () => (
  <div className="luna-page home-page">
    <Background />
    <Navbar />
    <main>
      <Hero />
      <Features />
      <ChatPreview />
      <CTA />
    </main>
    <Footer />
  </div>
)

export default Home
