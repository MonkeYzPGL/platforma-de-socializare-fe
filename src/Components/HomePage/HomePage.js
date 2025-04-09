import React from "react";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-profile-header">
        <div className="homepage-logo" />

        <div className="homepage-profile-main">
          <div className="homepage-profile-info">
            <div className="homepage-profile-pic">
              <span className="homepage-edit-icon"></span>
            </div>
            <div className="homepage-profile-text">
              <h1 className="homepage-name">Your name</h1>
              <h2 className="homepage-mail">yourname@gmail.com</h2>
              <p className="homepage-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </p>
            </div>
          </div>

          <div className="homepage-divider" />

          <div className="homepage-profile-buttons">
            <button className="homepage-button homepage-friend-list">
              Friend List <span>23</span>
            </button>
            <button className="homepage-button homepage-edit-profile">Edit Profile</button>
            <button className="homepage-button homepage-add-photo">Add Photo</button>
            <button className="homepage-button homepage-logout">Log Out</button>
          </div>
        </div>
      </div>

      <div className="homepage-photo-gallery">
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo1"></div></div>
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo2"></div></div>
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo3"></div></div>
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo4"></div></div>
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo5"></div></div>
        <div className="homepage-photo-wrapper"><div className="homepage-photo homepage-photo6"></div></div>
      </div>
    </div>
  );
}
