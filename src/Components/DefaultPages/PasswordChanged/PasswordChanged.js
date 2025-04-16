import React from "react";
import "./PasswordChanged.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


const PasswordChanged = () => {
  return (
    <div className="password-changed-container">
      <div className="logo"></div>
      <div className="success-mark">
        <FontAwesomeIcon icon={faCheck} style={{ color: "#18C07A", fontSize: "100px" }} />
      </div>
      <div className="success-text">
        <h2>Password Changed!</h2>
        <p>Your password has been changed successfully.</p>
      </div>
      <div className="back-button">
        <button onClick={() => window.location.href = "/"}>Back to Login</button>
      </div>
    </div>
  );
};

export default PasswordChanged;
