import React, { useState } from "react";
import { withRouter } from "react-router-dom"; // ✅ corect pentru v5
import "./FirstPage.css";

const FirstPage = (props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignupClick = () => {
    props.history.push("/signup");
  };



  return (
    <div className="first-page-container">
      <div className="logo-container"></div>
      <div className="image-container"></div>
      <div className="form-container">
        <h2 className="text2 camp">Fill in your username</h2>
        <input type="text" placeholder="username11" className="input-field" />

        <h2 className="text2 camp">Fill in your password</h2>
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="password123"
            className="input-field"
          />
          <button className="show-button" onClick={() => setPasswordVisible(!passwordVisible)}>
            <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
          </button>
        </div>

        <button className="login-button">Login</button>
        <button className="forgot-password">Forgot your password?</button>
        <div className="divider">Or</div>
        <p className="create-account">Create an account for free</p>

        {/* Buton care face navigarea */}
        <button className="signup-button" onClick={handleSignupClick}>Sign Up</button>
      </div>
    </div>
  );
};


export default withRouter(FirstPage); // ✅ esențial