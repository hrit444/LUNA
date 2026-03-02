import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  upsertConversation,
  setActiveConversation,
} from '../../redux/slice/chatSlice'
// import { selectToken } from '../../redux/slice/authSlice'
import './Chat.css'

/* ── Icons ── */
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6"  x2="6"  y2="18" />
    <line x1="6"  y1="6"  x2="18" y2="18" />
  </svg>
)

const ChatBubbleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

/* ── Modal ── */
const NewChatModal = ({ onClose }) => {
  const dispatch = useDispatch()

  const [title,    setTitle]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const inputRef = useRef(null)

  /* auto-focus */
  useEffect(() => { inputRef.current?.focus() }, [])

  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCreate = async () => {
    const trimmed = title.trim()
    if (!trimmed) { setError('Please enter a chat title.'); return }
    if (loading)  return

    setLoading(true)
    setError('')

    try {
      const res = await axios.post(
        'http://localhost:3000/api/chat',
        { title: trimmed },
        { withCredentials: true }
      )
      // console.log(res);
      

      const chat = res.data?.chat || res.data

      console.log(chat);
      
      if (chat) {
        dispatch(upsertConversation(chat))
        dispatch(setActiveConversation(chat))
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create chat. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCreate()
  }

  return (
    <div className="new-chat-backdrop" onClick={onClose}>
      <div
        className="new-chat-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Create new chat"
      >
        {/* Header */}
        <div className="new-chat-modal__header">
          <span className="new-chat-modal__title">NEW CONVERSATION</span>
          <button className="new-chat-modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="new-chat-modal__body">
          {/* Icon */}
          <div className="new-chat-modal__icon">
            <ChatBubbleIcon />
          </div>

          <p className="new-chat-modal__hint">
            Give your conversation a title to get started.
          </p>

          {/* Title input */}
          <div className="new-chat-modal__field">
            <label className="new-chat-modal__label">CHAT TITLE</label>
            <input
              ref={inputRef}
              className={`new-chat-modal__input${error ? ' new-chat-modal__input--error' : ''}`}
              placeholder="e.g. Project discussion, Quick question…"
              value={title}
              onChange={e => { setTitle(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              maxLength={80}
              autoComplete="off"
            />
            {/* character counter */}
            <div className="new-chat-modal__counter">
              <span style={{ color: error ? 'rgba(255,100,100,0.7)' : 'inherit' }}>
                {error || ''}
              </span>
              <span>{title.length}/80</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="new-chat-modal__actions">
            <button
              className="new-chat-modal__cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="new-chat-modal__create-btn"
              onClick={handleCreate}
              disabled={!title.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="new-chat-modal__btn-spinner" />
                  Creating…
                </>
              ) : (
                'Create Chat'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewChatModal