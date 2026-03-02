import React from 'react'
import { IconSend } from '../others/Icons'
import './ChatPreview.css'

const MESSAGES = [
  { role: 'user', text: "Explain quantum entanglement like I'm 12." },
  {
    role: 'ai',
    text: "Imagine two magic coins. Whenever you flip one and it lands heads, the other — no matter how far away — always lands tails. They're \"entangled.\" That's quantum entanglement: two particles linked so their states are always correlated, instantly.",
  },
  { role: 'user', text: 'Can it be used for faster-than-light communication?' },
  { role: 'ai', typing: true },
]

const ChatMessage = ({ role, text, typing }) => (
  <div className={`chat-msg${role === 'user' ? ' chat-msg--user' : ''}`}>
    <div className={`chat-msg__avatar chat-msg__avatar--${role}`}>
      {role === 'ai' ? 'AI' : 'ME'}
    </div>
    <div className={`chat-msg__bubble chat-msg__bubble--${role}`}>
      {typing ? (
        <div className="typing-dots">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      ) : text}
    </div>
  </div>
)

const ChatPreview = () => (
  <section className="chat-section" id="demo">
    <span className="luna-section-tag">Live Demo</span>
    <h2 className="luna-section-title">
      See <span className="accent">Luna</span> in Action
    </h2>
    <p className="luna-section-sub" style={{ margin: '0 auto 40px' }}>
      Intelligent, nuanced, lightning-fast. Luna handles everything from
      simple questions to deep technical breakdowns.
    </p>

    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__status" />
        <span className="chat-window__title">LUNA AI</span>
        <span className="chat-window__model">luna-v3-ultra</span>
      </div>

      <div className="chat-window__body">
        {MESSAGES.map((msg, i) => <ChatMessage key={i} {...msg} />)}
      </div>

      <div className="chat-window__footer">
        <div className="chat-fake-input">Ask Luna anything…</div>
        <button className="chat-send-btn" aria-label="Send">
          <IconSend />
        </button>
      </div>
    </div>
  </section>
)

export default ChatPreview
