import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectConversations,
  selectActiveConversation,
  fetchConversations,
  setActiveConversation,
  resetChatState,
} from '../../redux/slice/chatSlice'
import { selectUser, logout } from '../../redux/slice/authSlice'
import NewChatModal from './NewChatModal'
import './Chat.css'

/* ================= Helpers ================= */

const formatTime = (iso) => {
  if (!iso) return ''

  const d = new Date(iso)
  const now = new Date()

  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

/* ================= Chat Row ================= */

const ChatItem = React.memo(({ chat, isActive }) => {
  const dispatch = useDispatch()

  return (
    <div
      className={`chat-convo-item ${isActive ? 'active' : ''}`}
      onClick={() => dispatch(setActiveConversation(chat))}
    >
      {/* Avatar */}
      <div className="chat-convo-item__avatar">
        {chat.title?.[0]?.toUpperCase() || 'C'}
      </div>

      {/* Info */}
      <div className="chat-convo-item__info">
        <div className="chat-convo-item__name">
          {chat.title}
        </div>
        <div className="chat-convo-item__preview">
          Last activity
        </div>
      </div>

      {/* Time */}
      <div className="chat-convo-item__meta">
        <span className="chat-convo-item__time">
          {formatTime(chat.lastActivity)}
        </span>
      </div>
    </div>
  )
})

/* ================= Sidebar ================= */

const ChatSidebar = ({ mobileOpen }) => {
  const dispatch = useDispatch()

  const chats = useSelector(selectConversations)
  const activeChat = useSelector(selectActiveConversation)
  const user = useSelector(selectUser)

  const [search, setSearch] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)

  /* ================= Fetch Chats On Login ================= */

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchConversations())
    }
  }, [dispatch, user?._id])

  /* ================= Filter + Sort ================= */

  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) =>
        chat.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.lastActivity) -
          new Date(a.lastActivity)
      )
  }, [chats, search])

  /* ================= Logout ================= */

  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetChatState())
  }

  /* ================= Safety Guard ================= */

  if (!user) return null

  return (
    <>
      <aside className={`chat-sidebar ${mobileOpen ? 'open' : ''}`}>

        {/* ===== Header ===== */}
        <div className="chat-sidebar__header">
          <Link to="/" className="chat-sidebar__logo">
            Luna <span className="chat-sidebar__logo-ai">AI</span>
          </Link>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="chat-sidebar__new-btn"
              onClick={() => setShowNewChat(true)}
              title="New Chat"
            >
              +
            </button>

            <button
              className="chat-sidebar__logout-btn"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* ===== Search ===== */}
        <div className="chat-sidebar__search">
          <input
            className="chat-search-input"
            placeholder="Search chats…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ===== Chat List ===== */}
        <div className="chat-convos">
          {filteredChats.length === 0 ? (
            <div className="chat-empty-state">
              {search ? (
                'No results found.'
              ) : (
                <>
                  No chats yet.
                  <br />
                  <span
                    onClick={() => setShowNewChat(true)}
                    style={{
                      color: 'rgba(0,255,80,0.7)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Create your first chat →
                  </span>
                </>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isActive={activeChat?._id === chat._id}
              />
            ))
          )}
        </div>

        {/* ===== Profile Strip ===== */}
        <div className="chat-sidebar__profile">
          <div className="chat-sidebar__profile-avatar">
            {user?.fullname?.firstname?.[0] || 'U'}
          </div>

          <div>
            <div className="chat-sidebar__profile-name">
              {user?.fullname?.firstname}{' '}
              {user?.fullname?.lastname}
            </div>

            <div className="chat-sidebar__profile-status">
              ● Online
            </div>
          </div>
        </div>
      </aside>

      {/* ===== New Chat Modal ===== */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
        />
      )}
    </>
  )
}

export default ChatSidebar