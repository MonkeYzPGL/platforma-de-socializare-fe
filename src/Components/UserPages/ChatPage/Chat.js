import React from "react";
import "./Chat.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function ChatPage() {
  const messages = [
    { id: 1, text: "Salut! Ce faci?", sender: "other", time: "14:02" },
    { id: 2, text: "Eu sunt bine, tu?", sender: "me", time: "14:03" },
    { id: 3, text: "Ai timp azi să ne vedem?", sender: "other", time: "14:05" },
  ];

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar"></div>
        <div className="chat-username">Popescu Ion</div>
        <i className="fas fa-ellipsis-v chat-options"></i>
      </div>

      <div className="chat-messages">
        <div className="chat-date-separator">3 mai 2025</div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === "me" ? "me" : "other"}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-bar">
        <i className="far fa-smile icon-left"></i>
        <input
          type="text"
          placeholder="Scrie un mesaj..."
          className="chat-input"
        />
        <button className="send-button">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
