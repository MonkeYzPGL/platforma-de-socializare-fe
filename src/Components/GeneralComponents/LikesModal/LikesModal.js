import React from "react";
import "./LikesModal.css";

export default function LikesModal({ users, onClose }) {
  return (
    <div className="likes-modal-overlay">
      <div className="likes-modal">
        <button className="close-button-likes-modal" onClick={onClose}>❌</button>
        <h3>Liked by</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>@{user.username || "Unknown"}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
