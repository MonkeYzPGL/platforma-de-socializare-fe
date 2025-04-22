import React from "react";
import "./HomePage.css";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomePage() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);


  const history = useHistory();

  const handleEditPageClick = () => {
    history.push("/edit-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);                    
    history.push("/");               
  };

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
              <h1 className="homepage-name">
                {user ? `${user.firstName} ${user.lastName}` : "Your name"}
              </h1>
              <h2 className="homepage-mail">
                {user ? user.email : "yourname@gmail.com"}
              </h2>
              <p className="homepage-description">
                {user?.description?.trim()
                  ? user.description
                  : "Create your own description"}
              </p>

            </div>
          </div>

          <div className="homepage-divider" />

          <div className="homepage-profile-buttons">
            <button className="homepage-button homepage-friend-list">
              Friend List <span>23</span>
            </button>
            <button className="homepage-button homepage-add-friend">Add New Friends</button>
            <button className="homepage-button homepage-edit-profile" onClick={handleEditPageClick}>Edit Profile</button>
            <button className="homepage-button homepage-add-photo">Add Photo</button>
            <button className="homepage-button homepage-logout" onClick={handleLogout}>Log Out</button>
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
