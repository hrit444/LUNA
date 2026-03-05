import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import axios from 'axios'

import {
  selectActiveConversation,
  selectMessages,
  selectIsTyping,
  setMessages,
  appendMessage,
  setTyping,
} from '../../redux/slice/chatSlice'
import { selectUser } from '../../redux/slice/authSlice'
import ChatMessage from './ChatMessage'
import './Chat.css'

/* ── helpers ── */
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

/* ── Icons ── */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

/* ── Date separator ── */
const DateSep = ({ label }) => (
  <div className="chat-date-sep">{label}</div>
)

/* ── Typing indicator (Luna AI is responding) ── */
const TypingIndicator = () => (
  <div className="chat-typing-bubble">
    <div
      className="chat-bubble-row__avatar chat-bubble-row__avatar--ai"
      style={{ width: 28, height: 28, flexShrink: 0 }}
    >
      LU
    </div>
    <div className="chat-typing-dots">
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
    </div>
  </div>
)

/* ── Empty state (no convo selected) ── */
const EmptyState = () => (
  <div className="chat-empty">
    <div className="chat-empty__orb">AI</div>
    <p className="chat-empty__title">SELECT A CONVERSATION</p>
    <p className="chat-empty__sub">
      Choose a conversation from the sidebar or start a new one to begin chatting.
    </p>
  </div>
)

/* ── Group messages by date ── */
const groupByDate = (messages) => {
  if (!Array.isArray(messages)) return []
  const groups  = []
  let lastDate  = null

  messages.forEach(msg => {
    if (!msg?.createdAt) return
    const d     = new Date(msg.createdAt)
    const label = d.toDateString() === new Date().toDateString()
      ? 'Today'
      : d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })

    if (label !== lastDate) {
      groups.push({ type: 'sep', label })
      lastDate = label
    }
    groups.push({ type: 'msg', msg })
  })

  return groups
}

/* ══════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════ */
const ChatPanel = ({ onMenuClick }) => {
  const dispatch      = useDispatch()
  const activeConvo   = useSelector(selectActiveConversation)
  const messages      = useSelector(selectMessages) || []
  const isTyping      = useSelector(selectIsTyping)
  const user          = useSelector(selectUser)

  const [text,    setText]    = useState('')
  const [sending, setSending] = useState(false)
  const [socket,  setSocket]  = useState(null)

  const bottomRef   = useRef(null)
  const textareaRef = useRef(null)

  /* ── scroll to bottom on new messages ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  /* ── always fetch messages from DB when conversation changes ── */
  useEffect(() => {
    if (!activeConvo?._id) {
      console.log('No active conversation selected')
      return
    }

    console.log('Fetching messages for chat ID:', activeConvo._id)
    dispatch(setMessages([]))

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://luna-8gpi.onrender.com/api/chat/messages/${activeConvo._id}`,
          { withCredentials: true }
        )

        console.log('✅ API Response:', res.data)

        let msgs = []

        if (Array.isArray(res?.data)) {
          msgs = res.data
        } else if (Array.isArray(res.data?.messages)) {
          msgs = res.data.messages
        }

        console.log(`📨 Loaded ${msgs.length} messages`)

        const reversedMsgs = [...msgs].reverse()

        dispatch(setMessages(reversedMsgs))
      } catch (err) {
        console.error('❌ Failed to fetch messages:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          message: err.response?.data?.message || err.message,
          chatId: activeConvo._id,
          url: `https://luna-8gpi.onrender.com/api/chat/messages/${activeConvo._id}`
        })
        dispatch(setMessages([]))
      }
    }

    fetchMessages()
  }, [activeConvo?._id, dispatch])

  /* ── socket: connect once ── */
  useEffect(() => {
    const newSocket = io('https://luna-8gpi.onrender.com', { withCredentials: true })
    setSocket(newSocket)
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id)
    })

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err)
    })

    return () => {
      console.log('🔌 Disconnecting socket')
      newSocket.disconnect()
    }
  }, [])

  /* ── socket: receive AI response ── */
  useEffect(() => {
    if (!socket) return

    socket.on('ai-response', (data) => {
      console.log('🤖 Received AI response:', data)
      dispatch(setTyping(false))
      dispatch(appendMessage({
        _id:       `ai-${Date.now()}`,
        chat:      data.chat,
        content:   data.content,
        role:      'model',
        createdAt: new Date().toISOString(),
      }))
    })

    socket.on('error', (err) => console.error('❌ Socket error:', err))

    return () => {
      socket.off('ai-response')
      socket.off('error')
    }
  }, [socket, dispatch])

  /* ── auto-resize textarea ── */
  const handleInput = (e) => {
    setText(e.target.value)
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  /* ── send message ── */
  const handleSend = useCallback(async () => {
    const content = text.trim()
    if (!content || !activeConvo?._id || sending) return

    console.log('📤 Sending message:', { content, chatId: activeConvo._id })

    dispatch(appendMessage({
      _id: `opt-${Date.now()}`,
      chat: activeConvo._id,
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
    }))

    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setSending(true)
    dispatch(setTyping(true))

    try {
      socket?.emit('ai-message', {
        content,
        chat: activeConvo._id,
      })
      console.log('✅ Message emitted to socket')
    } catch (err) {
      console.error('❌ Send failed:', err)
      dispatch(setTyping(false))
    } finally {
      setSending(false)
    }
  }, [text, activeConvo, sending, dispatch, socket])

  const chatTitle = activeConvo?.title || 'Luna AI'
  const grouped   = groupByDate(messages)

  if (!activeConvo) {
    return (
      <div className="chat-main">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="chat-main">

      {/* ── Header ── */}
      <div className="chat-main__header">
        <button
          className='flex lg:hidden xl:hidden 2xl:hidden'
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none', color: 'rgba(0,255,80,0.5)',
            cursor: 'pointer', padding: 4, marginRight: 4,
          }}
        >
          <MenuIcon />
        </button>

        <div className="chat-main__avatar chat-main__avatar--ai">
          <div className="chat-main__online-dot" />
          LUNA
        </div>

        <div className="chat-main__contact-info">
          <div className="chat-main__contact-name">{chatTitle}</div>
          <div className="chat-main__contact-status">
            {isTyping ? '✦ Luna is thinking…' : '● Luna AI · Always online'}
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages">
        {messages.length === 0 && !isTyping && (
          <div className="chat-welcome">
            <div className="chat-welcome__orb">LUNA</div>
            <p className="chat-welcome__title">{chatTitle}</p>
            <p className="chat-welcome__sub">
              Hi {user?.fullname?.firstname || 'there'}! I'm Luna. Ask me anything.
            </p>
          </div>
        )}

        {grouped.map((item, i) =>
          item.type === 'sep'
            ? <DateSep key={`sep-${i}`} label={item.label} />
            : <ChatMessage key={item.msg._id} message={item.msg} />
        )}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Message Luna AI…"
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>

    </div>
  )
}

export default ChatPanel