import React from "react";
import "./AccountCreated.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const AccountCreated = () => {
  return (
    <div className="password-changed-container">
      <div className="logo"></div>
      <div className="success-mark">
        <FontAwesomeIcon icon={faCheck} style={{ color: "#18C07A", fontSize: "100px" }} />
      </div>
      <div className="success-text">
        <h2>Account Created!</h2>
        <p>You can now log in using your account credentials.</p>
      </div>
      <div className="back-button">
        <button onClick={() => window.location.href = "/"}>Log in</button>
      </div>
    </div>
  );
};

export default AccountCreated;
