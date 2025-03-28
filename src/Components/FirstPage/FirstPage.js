import React, { useState } from "react";
import "./FirstPage.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {login} from '../API/user-account-api';
import { useHistory } from "react-router-dom";

const FirstPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 const history = useHistory();

  const handleLogin = () => {
    login(username, password, (result, status, error) => {
      if(status === 200)
      {
        console.log(result);
        // const userAccountDTO = result;
        // setuserAccount(userAccountDTO);
        history.push('');
      }
    })
  }

  return (
    <div className="first-page-container">
      <div className="logo-container">
      </div>
      <div className="image-container">
      </div>
      <div className="form-container">
        <h2 className="text2 camp">Fill in your username</h2>
        <input type="text" placeholder="username11" className="input-field" value = {username} onChange = { e => setUsername(e.target.value)}/>
        <h2 className="text2 camp">Fill in your password</h2>
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="password123"
            className="input-field"
            value = {password}
            onChange = { e => setPassword(e.target.value)}
          />
          <button className="show-button" onClick={() => setPasswordVisible(!passwordVisible)}>
            <i className={passwordVisible ? "fa fa-eye-slash" : "fa fa-eye"}></i>
          </button>
        </div>
        <button className="login-button" onClick = {handleLogin}>Login</button>
        <a href="/reset-password" className="forgot-password">Forgot your password?</a>
        <div className="divider">Or</div>
        <p className="create-account">Create an account for free</p>
        <button className="signup-button">Sign Up</button>
      </div>
    </div>
  );
};

export default FirstPage;
