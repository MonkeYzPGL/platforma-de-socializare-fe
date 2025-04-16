import React, { useState, useEffect } from "react";
import "./SignUpPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useHistory} from "react-router-dom";
import { signup } from "../../API/user-account-api";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: ""
  });


  const handleSubmit = () => {
    if (formIsValid) {
      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
  
      signup(userPayload, (result, status, error) => {
        if (status === 200) {
          console.log("result");
          history.push("/account-created");
        } else {
          alert("Signup failed: " + (error || "unknown error"));
        }
      });
    }
  };
  

  const history = useHistory();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatVisible, setRepeatVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [matchError, setMatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
  if (!e || !e.target || !e.target.name) return;
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


  useEffect(() => {
    const errors = [];
    if (formData.password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) errors.push("At least one special character is required.");
    if (!/\d/.test(formData.password)) errors.push("At least one number is required.");
    setPasswordErrors(errors);
  }, [formData.password]);

  useEffect(() => {
    if (formData.repeatPassword && formData.password !== formData.repeatPassword) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  }, [formData.password, formData.repeatPassword]);

  useEffect(() => {
    if (!formData.email) {
      setEmailError("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  }, [formData.email]);

  const formIsValid = 
    formData.firstName &&
    formData.lastName &&
    formData.username &&
    formData.email &&
    formData.password &&
    formData.repeatPassword &&
    passwordErrors.length === 0 &&
    !matchError &&
    !emailError;

  return (
    <div className="signup-container">
      <div className="logo" />
      <div className="signup-image-container" />

      <div className="signup-form-box">
        <div className="form-group">
          <label className="label-sign-up">First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="input-sign-up"
            value={formData.firstName}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="input-sign-up"
            value={formData.lastName}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Your Username"
            className="input-sign-up"
            value={formData.username}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-group">
          <label className="label-sign-up">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="test@gmail.com"
            className="input-sign-up"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
          {focusedField === "email" && emailError && <p className="error-text">{emailError}</p>}
        </div>

        <div className="form-group">
          <label className="label-sign-up">Password:</label>
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Your Password"
              className="input-sign-up"
              value={formData.password}
              onChange={(e) => handleChange(e)}
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
              <p className="error-text" key={idx}>{err}</p>
            ))}
        </div>

        <div className="form-group">
          <label className="label-sign-up">Repeat Password:</label>
          <div className="password-container">
            <input
              type={repeatVisible ? "text" : "password"}
              name="repeatPassword"
              placeholder="Repeat Password"
              className="input-sign-up"
              value={formData.repeatPassword}
              onChange={(e) => handleChange(e)}
              onFocus={() => setFocusedField("repeat")}
              onBlur={() => setFocusedField(null)}
            />
            <button
              type="button"
              className="show-button"
              onClick={() => setRepeatVisible(!repeatVisible)}>
              <i className={repeatVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
            </button>
          </div>
          {focusedField === "repeat" && matchError && <p className="error-text">{matchError}</p>}
        </div>
      </div>

      <button
        className="signup-submit-btn"
        onClick={handleSubmit}
        disabled={!formIsValid}
        style={{
          opacity: formIsValid ? 1 : 0.5,
          cursor: formIsValid ? "pointer" : "not-allowed",
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpPage;
