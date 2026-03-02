import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Background   from '../components/others/Background'
import ChatSidebar  from '../components/chat/ChatSidebar'
import ChatPanel    from '../components/chat/ChatPanel'
import { setConversations } from '../redux/slice/chatSlice'
import { selectToken }      from '../redux/slice/authSlice'
import '../components/chat/Chat.css'
import './Chat.css'

const Chat = () => {
  const dispatch = useDispatch()
  const token    = useSelector(selectToken)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* Fetch conversations on mount */
  useEffect(() => {
    if (!token) return
    axios
      .get('http://localhost:3000/api/chat', {
        headers:        { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then(res => dispatch(setConversations(res.data?.chats || res.data || [])))
      .catch(console.error)
  }, [token])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="chat-page-root">
      <Background />

      {/* Mobile sidebar overlay */}
      <div
        className={`chat-sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={closeSidebar}
      />

      <ChatSidebar mobileOpen={sidebarOpen} />

      <ChatPanel onMenuClick={() => setSidebarOpen(o => !o)} />
    </div>
  )
}

export default Chat