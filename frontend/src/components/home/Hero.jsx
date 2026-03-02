import React from 'react'
import { IconArrow } from '../others/Icons'
import Button from '../others/Button'
import './Hero.css'

const HeroOrb = () => (
  <div className="hero-orb-wrap">
    <div className="orb-ring">
      <div className="orb-dot orb-dot--top"    />
      <div className="orb-dot orb-dot--bottom" />
      <div className="orb-dot orb-dot--left"   />
      <div className="orb-ring-mid">
        <div className="orb-core">AI</div>
      </div>
    </div>
  </div>
)

const Hero = () => (
  <section className="hero">
    <div className="hero-badge">
      <div className="hero-badge__dot" />
      Next-Generation AI Platform
    </div>

    <h1 className="hero-title">
      Intelligence<br />
      <span className="accent">Redefined</span>{' '}
      <span className="muted">for</span><br />
      the Future
    </h1>

    <p className="hero-sub">
      Luna AI is your adaptive intelligence companion — powerful enough
      for complex reasoning, intuitive enough for everyday conversations.
    </p>

    <div className="hero-actions">
      <Button as="a" href="/register" variant="primary" size="lg">
        Start for Free <IconArrow />
      </Button>
      <Button as="a" href="#features" variant="ghost" size="lg">
        See Features
      </Button>
    </div>

    <HeroOrb />
  </section>
)

export default Hero
