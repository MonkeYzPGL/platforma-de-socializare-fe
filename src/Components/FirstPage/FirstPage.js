import React, { useState } from "react";
import "./FirstPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";

const FirstPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="first-page-container">
      <div className="logo-container">
      </div>
      <div className="image-container">
      </div>
      <div className="form-container">
        <h2 className="text2 camp">Fill in your username</h2>
        <input type="text" placeholder="username11" className="input-field" />
        <h2 className="text2 camp">Fill in your password</h2>
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="password123@"
            className="input-field"
          />
          <button className="show-button" onClick={() => setPasswordVisible(!passwordVisible)}>
            <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
          </button>
        </div>
        <button className="login-button">Login</button>
        <Link to="/reset-password" className="forgot-password">Forgot your password?</Link>
        <div className="divider">Or</div>
        <p className="create-account">Create an account for free</p>
        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
};

export default FirstPage;
