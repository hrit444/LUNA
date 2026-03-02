import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slice/authSlice'
import './Chat.css'

const formatTime = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const TickIcon = () => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline', verticalAlign: 'middle' }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ChatMessage = ({ message }) => {
  const user = useSelector(selectUser)

  // role: "user" = sent by human, role: "model" = Luna AI response
  // Optimistic messages (opt-*) also have role: "user"
  const isModel = message.role === 'model'
  const isMine  = !isModel  // user role or optimistic

  return (
    <div className={`chat-bubble-row chat-bubble-row--${isMine ? 'mine' : 'theirs'}`}>

      {/* AI avatar — only shown for model messages */}
      {isModel && (
        <div className="chat-bubble-row__avatar chat-bubble-row__avatar--ai">
          LU
        </div>
      )}

      <div className={`chat-bubble chat-bubble--${isMine ? 'mine' : 'theirs'}`}>
        {/* AI label on model messages */}
        {isModel && (
          <span className="chat-bubble__sender">Luna AI</span>
        )}

        {message.content}

        <span className="chat-bubble__time">
          {formatTime(message.createdAt)}
          {isMine && (
            <span className="chat-bubble__tick">
              <TickIcon />
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default ChatMessage