import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slice/authSlice'
import './Chat.css'

const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

const formatTime = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/* Double-tick SVG */
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
  const user  = useSelector(selectUser)
  const isMine = message.senderId === user?._id

  const senderName = isMine
    ? `${user?.fullname?.firstname || ''} ${user?.fullname?.lastname || ''}`
    : `${message.senderName || 'User'}`

  return (
    <div className={`chat-bubble-row chat-bubble-row--${isMine ? 'mine' : 'theirs'}`}>
      {/* Avatar — only for other person */}
      {!isMine && (
        <div className="chat-bubble-row__avatar">
          {initials(senderName)}
        </div>
      )}

      <div className={`chat-bubble chat-bubble--${isMine ? 'mine' : 'theirs'}`}>
        {message.content}
        <span className="chat-bubble__time">
          {formatTime(message.createdAt)}
          {isMine && <span className="chat-bubble__tick"><TickIcon /></span>}
        </span>
      </div>
    </div>
  )
}

export default ChatMessage
