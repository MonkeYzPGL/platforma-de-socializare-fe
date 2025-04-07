import React from "react";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="profile-header">
        <div className="logo" />

        <div className="profile-info">
          <div className="profile-pic" />
          <div className="profile-text">
            <h1>Your name</h1>
            <h2>yourname@gmail.com</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>

        <div className="profile-buttons">
          <button className="button friend-list">Friend List <span>23</span></button>
          <button className="button edit-profile">Edit Profile</button>
          <button className="button add-photo">Add Photo</button>
          <button className="button logout">Log Out</button>
        </div>
      </div>

      <div className="photo-gallery">
        <div className="photo-wrapper"><div className="photo photo1"></div></div>
        <div className="photo-wrapper"><div className="photo photo2"></div></div>
        <div className="photo-wrapper"><div className="photo photo3"></div></div>
        <div className="photo-wrapper"><div className="photo photo4"></div></div>
        <div className="photo-wrapper"><div className="photo photo5"></div></div>
        <div className="photo-wrapper"><div className="photo photo6"></div></div>
      </div>
    </div>
  );
}
