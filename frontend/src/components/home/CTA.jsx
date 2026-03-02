import React from 'react'
import { IconArrow } from '../others/Icons'
import Button from '../others/Button'
import './CTA.css'

const CTA = () => (
  <section className="cta-section">
    <div className="cta-card">
      <div className="cta-card__glow" />

      <h2 className="cta-card__title">
        Ready to Meet<br />
        <span className="accent">Your AI</span>?
      </h2>
      <p className="cta-card__sub">
        Join 10 million users already using Luna AI to work smarter,
        create faster, and think deeper. Free to start, no card required.
      </p>

      <div className="cta-card__actions">
        <Button as="a" href="/register" variant="primary" size="lg">
          Create Free Account <IconArrow />
        </Button>
        <Button as="a" href="/login" variant="ghost" size="lg">
          Sign In
        </Button>
      </div>

      <p className="cta-card__note">No credit card · Cancel anytime · Free tier forever</p>
    </div>
  </section>
)

export default CTA
