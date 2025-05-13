import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./Chat.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function ChatPage() {
  const { user2: user2Username } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const user1Username = currentUser?.username;

  const [user1Id, setUser1Id] = useState(null);
  const [user2Id, setUser2Id] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Get user IDs
  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`/api/v1/userAccount/getByUsername/${user1Username}`),
          axios.get(`/api/v1/userAccount/getByUsername/${user2Username}`),
        ]);
        setUser1Id(res1.data.id);
        setUser2Id(res2.data.id);
      } catch (err) {
        console.error("Error fetching user IDs:", err.message);
        setChatError("Could not load users.");
      }
    };

    if (user1Username && user2Username) {
      fetchUserIds();
    }
  }, [user1Username, user2Username]);

  // Get chat messages
  useEffect(() => {
    if (!user1Id || !user2Id) return;

    axios
      .get(`/api/v1/chat/${user1Id}/${user2Id}`)
      .then((res) => {
        setMessages(res.status === 204 ? [] : res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setChatError("User not found.");
        } else {
          setChatError("Failed to load chat history.");
        }
      });
  }, [user1Id, user2Id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      senderId: user1Id,
      recipientId: user2Id,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`/api/v1/chat/send/${user1Id}/${user2Id}`, msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error.message);
      setChatError("Failed to send message.");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native);
  };

  if (!currentUser) {
    return <div className="chat-page">You must be logged in to use the chat.</div>;
  }

  if (user1Username === user2Username) {
    return <div className="chat-page">You can't chat with yourself 🙂</div>;
  }

  if (chatError) {
    return (
      <div className="chat-page">
        <p style={{ padding: "1rem", color: "red" }}>{chatError}</p>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar"></div>
        <div className="chat-username">{user2Username}</div>
        <i className="fas fa-ellipsis-v chat-options"></i>
      </div>

      <div className="chat-messages">
        
        {messages.length === 0 && (
          <div className="no-messages-placeholder">
            Start a conversation with <strong>{user2Username}</strong> 📩
          </div>
        )}

        {messages.map((msg, idx) => {
  const currentDate = new Date(msg.timestamp);
  const previousDate =
    idx > 0 ? new Date(messages[idx - 1].timestamp) : null;

  const showDateSeparator =
    !previousDate || currentDate.toDateString() !== previousDate.toDateString();

  return (
    <React.Fragment key={idx}>
      {showDateSeparator && (
        <div className="chat-date-separator">
          {currentDate.toLocaleDateString()}
        </div>
      )}
      <div
        className={`chat-message ${
          msg.senderId === user1Id ? "me" : "other"
        }`}
      >
        <div className="message-text">{msg.content}</div>
        <div className="message-time">
          {new Date(
            new Date(msg.timestamp).getTime() + 3 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(11, 16)}
        </div>
      </div>
    </React.Fragment>
  );
})}


        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <i
          className="far fa-smile icon-left"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        ></i>

        {showEmojiPicker && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}

        <input
          type="text"
          placeholder="Type a message..."
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
