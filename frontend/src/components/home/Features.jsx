import React from 'react'
import { IconBolt, IconBrain, IconShield, IconCode, IconGlobe } from '../others/Icons'
import './Features.css'

const FEATURES = [
  {
    icon: <IconBrain />,
    name: 'Deep Reasoning',
    desc: 'Multi-step logic and contextual understanding that rivals human-level analysis across any domain.',
  },
  {
    icon: <IconBolt />,
    name: 'Instant Responses',
    desc: 'Sub-150ms latency powered by distributed inference. Real-time answers, zero waiting.',
  },
  {
    icon: <IconCode />,
    name: 'Code Intelligence',
    desc: 'Generate, review, and debug code across 40+ languages with full project context awareness.',
  },
  {
    icon: <IconGlobe />,
    name: 'Multilingual',
    desc: 'Communicate natively in 50+ languages. Luna understands nuance, idioms, and cultural context.',
  },
  {
    icon: <IconShield />,
    name: 'Privacy First',
    desc: 'End-to-end encryption on every message. Your conversations are yours — never used for training.',
  },
]

const FeatureCard = ({ icon, name, desc }) => (
  <div className="feature-card">
    <div className="feature-card__icon">{icon}</div>
    <h3 className="feature-card__name">{name}</h3>
    <p className="feature-card__desc">{desc}</p>
  </div>
)

const Features = () => (
  <section className="features" id="features">
    <span className="luna-section-tag">Capabilities</span>
    <h2 className="luna-section-title">
      Built for What<br /><span className="accent">Matters Most</span>
    </h2>
    <p className="luna-section-sub">
      Every feature of Luna AI is engineered with one goal — to make you
      dramatically more capable, faster, and smarter.
    </p>
    <div className="features-grid">
      {FEATURES.map(f => <FeatureCard key={f.name} {...f} />)}
    </div>
  </section>
)

export default Features
