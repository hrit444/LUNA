import React from 'react'
import './StatsBar.css'

const STATS = [
  { value: '10M+',  label: 'Active Users'  },
  { value: '99.9%', label: 'Uptime'        },
  { value: '150ms', label: 'Avg. Response' },
  { value: '50+',   label: 'Languages'     },
]

const StatsBar = () => (
  <div className="stats-bar">
    {STATS.map(({ value, label }, i) => (
      <div className="stat-item" key={label} style={{ animationDelay: `${i * 0.08}s` }}>
        <span className="stat-item__value">{value}</span>
        <span className="stat-item__label">{label}</span>
      </div>
    ))}
  </div>
)

export default StatsBar
