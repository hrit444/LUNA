import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  selectActiveConversation,
  selectMessages,
  selectIsTyping,
  selectOnlineUsers,
  setMessages,
  appendMessage,
  setTyping,
} from "../../redux/slice/chatSlice";
import { selectUser, selectToken } from "../../redux/slice/authSlice";
import ChatMessage from "./ChatMessage";
import "./Chat.css";

/* ── helpers ── */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ── Date separator ── */
const DateSep = ({ label }) => <div className="chat-date-sep">{label}</div>;

/* ── Typing indicator ── */
const TypingIndicator = ({ name }) => (
  <div className="chat-typing-bubble">
    <div
      className="chat-bubble-row__avatar"
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, rgba(0,180,60,0.5), rgba(0,80,30,0.6))",
        border: "1px solid rgba(0,255,80,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: "0.6rem",
        fontWeight: 700,
        color: "var(--green)",
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
    <div className="chat-typing-dots">
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
      <div className="chat-typing-dot" />
    </div>
  </div>
);

/* ── Empty state ── */
const EmptyState = () => (
  <div className="chat-empty">
    <div className="chat-empty__orb">AI</div>
    <p className="chat-empty__title">SELECT A CONVERSATION</p>
    <p className="chat-empty__sub">
      Choose a conversation from the sidebar or start a new one to begin
      chatting.
    </p>
  </div>
);

/* group messages by date */
const groupByDate = (messages) => {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt);
    const label =
      d.toDateString() === new Date().toDateString()
        ? "Today"
        : d.toLocaleDateString([], {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
    if (label !== lastDate) {
      groups.push({ type: "sep", label });
      lastDate = label;
    }
    groups.push({ type: "msg", msg });
  });
  return groups;
};

/* ── Main panel ── */
const ChatPanel = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const activeConvo = useSelector(selectActiveConversation);
  const messages = useSelector(selectMessages);
  const isTyping = useSelector(selectIsTyping);
  const onlineUsers = useSelector(selectOnlineUsers);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimerRef = useRef(null);

  /* scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* fetch messages when active convo changes */
  useEffect(() => {
    if (!activeConvo?._id) return;
    axios
      .get(`http://localhost:3000/api/chat`, {
        withCredentials: true,
      })
      .then((res) => {
        (dispatch(setMessages(res.data?.messages || res.data || [])),
          console.log(res));
      })
      .catch(console.error);
  }, []);

  /* auto-resize textarea */
  const handleInput = (e) => {
    setText(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
    // typing indicator emit (would go through socket in real app)
    clearTimeout(typingTimerRef.current);
    dispatch(setTyping(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!content || !activeConvo?._id || sending) return;

    const optimistic = {
      _id: `opt-${Date.now()}`,
      conversationId: activeConvo._id,
      senderId: user?._id,
      senderName: `${user?.fullname?.firstname} ${user?.fullname?.lastname}`,
      content,
      createdAt: new Date().toISOString(),
    };

    dispatch(appendMessage(optimistic));
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(true);

    try {
      await axios.post(
        `http://localhost:3000/api/chat`,
        { content },
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  }, [text, activeConvo, user, token, sending, dispatch]);

  /* derive other participant info */
  const other =
    activeConvo?.participants?.find((p) => p._id !== user?._id) || {};
  const otherName = `${other.fullname?.firstname || ""} ${other.fullname?.lastname || ""}`;
  const isOtherOnline = onlineUsers.includes(other._id);
  const grouped = groupByDate(messages);

  if (!activeConvo) {
    return (
      <div className="chat-main">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="chat-main">
      {/* Header */}
      <div className="chat-main__header">
        {/* hamburger on mobile */}
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            color: "rgba(0,255,80,0.5)",
            cursor: "pointer",
            display: "flex",
            padding: 4,
            marginRight: 4,
          }}
        >
          <MenuIcon />
        </button>

        <div className="chat-main__avatar">
          {initials(otherName)}
          {isOtherOnline && <div className="chat-main__online-dot" />}
        </div>

        <div className="chat-main__contact-info">
          <div className="chat-main__contact-name">{otherName}</div>
          <div
            className={`chat-main__contact-status${isOtherOnline ? "" : " offline"}`}
          >
            {isTyping ? "✦ typing…" : isOtherOnline ? "● Online" : "○ Offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {grouped.map((item, i) =>
          item.type === "sep" ? (
            <DateSep key={`sep-${i}`} label={item.label} />
          ) : (
            <ChatMessage key={item.msg._id} message={item.msg} />
          ),
        )}

        {isTyping && <TypingIndicator name={otherName} />}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <div className="chat-input-wrap">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Type a message…"
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
  );
};

export default ChatPanel;
