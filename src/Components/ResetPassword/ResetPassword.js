import React from "react";
import "./ResetPassword.css";

const ResetPassword = () => {
  return (
    <div className="reset-page-container">
      <div className="logo-container" />
      <div className="reset-form-border">
        <h2 className="form-title">Reset Password</h2>

        <label className="label">Email:</label>
        <div className="input-with-check">
          <input type="email" className="input-field" />
          <span className="check-icon" />
        </div>

        <label className="label">New Password:</label>
        <div className="input-with-check">
          <input type="password" className="input-field" />
          <span className="check-icon" />
        </div>

        <label className="label">Repeat New Password:</label>
        <div className="input-with-check">
          <input type="password" className="input-field" />
          <span className="check-icon" />
        </div>

        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
};

export default ResetPassword;
