import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useHistory } from "react-router-dom";
import {resetPassword} from '../../API/user-account';
import ClickableLogo from "../../ClickableLogo";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [matchError, setMatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const history = useHistory();
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = () => {
    if (formIsValid) {
      resetPassword(email, password, (result, status, error) => {
        if (status === 200) {
          history.push("/password-changed");
        } else {
          alert("Failed to reset password. Please try again.");
          console.error("Error:", error);
        }
      });
    }
  };

  useEffect(() => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("At least one special character is required.");
    if (!/\d/.test(password)) errors.push("At least one number is required.");
    setPasswordErrors(errors);
  }, [password]);

  useEffect(() => {
    if (repeatPassword && password !== repeatPassword) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  }, [password, repeatPassword]);

  useEffect(() => {
    if (!email) {
      setEmailError("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  }, [email]);

  const formIsValid =
    email &&
    password &&
    repeatPassword &&
    passwordErrors.length === 0 &&
    !matchError &&
    !emailError;

  return (
    <div className="reset-password-container">
      <ClickableLogo className="reset-logo" />

      <div className="reset-border">

        <div className="input-block">
            <label>Email:</label>
            <input
              type="email"
              className="input-field"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            {focusedField === "email" && emailError && (
              <p className="error-text">{emailError}</p>)}
        </div>

        <div className="input-block">
          <label>New Password:</label>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              className="input-field"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <button
              type="button"
              className="show-button"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </button>
          </div>

          {focusedField === "password" &&
            passwordErrors.map((err, idx) => (
              <p className="error-text" key={idx}>
                {err}
              </p>
            ))}
        </div>

        <div className="input-block">
          <label>Repeat New Password:</label>
          <div className="password-container">
            <input
              type={repeatVisible ? "text" : "password"}
              className="input-field"
              placeholder="Repeat new password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              onFocus={() => setFocusedField("repeat")}
              onBlur={() => setFocusedField(null)}
            />
            <button
              type="button"
              className="show-button"
              onClick={() => setRepeatVisible(!repeatVisible)}
            >
              <i className={repeatVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </button>
          </div>

          {focusedField === "repeat" && matchError && (
            <p className="error-text">{matchError}</p>
          )}
        </div>

      </div>

      <button
        className="sign-up-button"
        onClick={handleSubmit}
        disabled={!formIsValid}
        style={{ opacity: formIsValid ? 1 : 0.5, cursor: formIsValid ? "pointer" : "not-allowed" }}
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;