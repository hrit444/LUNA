import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

/* ------------------ Async Thunk ------------------ */

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'https://luna-8gpi.onrender.com/api/chat',
        { withCredentials: true }
      )
      return res.data.chats
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to fetch conversations'
      )
    }
  }
)

/* ------------------ Initial State ------------------ */

const initialState = {
  conversations:      [],
  activeConversation: null,
  messages:           [],
  onlineUsers:        [],
  isTyping:           false,
  unreadCounts:       {},
  loading:            false,
  error:              null,
}

/* ------------------ Slice ------------------ */

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    setConversations: (state, { payload }) => {
      state.conversations = payload
    },

    resetChatState: () => initialState,

    upsertConversation: (state, { payload }) => {
      const idx = state.conversations.findIndex(c => c._id === payload._id)
      if (idx >= 0) state.conversations[idx] = payload
      else          state.conversations.unshift(payload)
    },

    setActiveConversation: (state, { payload }) => {
      state.activeConversation = payload
      state.messages           = []
      state.isTyping           = false
      if (payload?._id) delete state.unreadCounts[payload._id]
    },

    clearActiveConversation: (state) => {
      state.activeConversation = null
      state.messages           = []
    },

    setMessages: (state, { payload }) => {
      state.messages = payload
    },

    appendMessage: (state, { payload }) => {
      state.messages.push(payload)

      const chatId = payload.chat || payload.conversationId
      const idx    = state.conversations.findIndex(c => c._id === chatId)

      if (idx >= 0) {
        state.conversations[idx].lastActivity = payload.createdAt
        state.conversations[idx].lastMessage  = payload
        const [convo] = state.conversations.splice(idx, 1)
        state.conversations.unshift(convo)
      }
    },

    setTyping: (state, { payload }) => {
      state.isTyping = payload
    },

    setOnlineUsers: (state, { payload }) => {
      state.onlineUsers = payload
    },

    incrementUnread: (state, { payload }) => {
      state.unreadCounts[payload] = (state.unreadCounts[payload] || 0) + 1
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading       = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  },
})

export const {
  setConversations,
  resetChatState,
  upsertConversation,
  setActiveConversation,
  clearActiveConversation,
  setMessages,
  appendMessage,
  setTyping,
  setOnlineUsers,
  incrementUnread,
} = chatSlice.actions

export default chatSlice.reducer

/* ------------------ Selectors ------------------ */

export const selectConversations      = (s) => s.chat.conversations
export const selectActiveConversation = (s) => s.chat.activeConversation
export const selectMessages           = (s) => s.chat.messages
export const selectOnlineUsers        = (s) => s.chat.onlineUsers
export const selectIsTyping           = (s) => s.chat.isTyping
export const selectUnreadCounts       = (s) => s.chat.unreadCounts
export const selectChatLoading        = (s) => s.chat.loading