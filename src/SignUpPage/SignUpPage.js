import React from "react";
import "./SignUpPage.css";


const SignUpPage = () => {
  return (
    <div className="signup-container">
      <div className="logo" />
      <div className="signup-image-container" />

      <div className="signup-form-box">
        <div className="form-group">
          <label className="label-sign-up">First Name:</label>
          <input type="text" className="input-sign-up" />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Last Name:</label>
          <input type="text" className="input-sign-up" />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Username:</label>
          <input type="text" className="input-sign-up" />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Email:</label>
          <input type="email" placeholder="test@gmail.com" className="input-sign-up" />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Password:</label>
          <input type="password" className="input-sign-up" />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Repeat Password:</label>
          <input type="password" className="input-sign-up" />
        </div>
      </div>

      <button className="signup-submit-btn">Sign Up</button>
    </div>
  );
};

export default SignUpPage;
