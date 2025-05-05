import React, { useEffect, useState } from "react";
import "../HomePage/HomePage.css";
import "./ViewProfile.css"
import { useParams } from "react-router-dom";
import { getUserById } from "../../API/user-account";
import { useHistory } from "react-router-dom";
import ClickableLogo from "../../ClickableLogo";

export default function ViewProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();

  const handleMessageClick = () => {
    history.push(`/send-message/${user.id}`);
  };

  useEffect(() => {
    if (id) {
      getUserById(id, (result, status, error) => {
        if (status === 200 && result) {
          setUser(result);
        } else {
          console.error("User fetch failed", error);
        }
      });
    }
  }, [id]);

  return (
    <div className="homepage-container">
      <div className="homepage-profile-header">
        <ClickableLogo className="homepage-logo" />

        <div className="homepage-profile-main">
          <div className="homepage-profile-info">
            <div className="profile-pic" />
            <div className="homepage-profile-text">
              <h1 className="homepage-name">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </h1>
              <h2 className="homepage-mail">
                {user ? user.email : "Loading..."}
              </h2>
              <p className="homepage-description">
                {user?.description?.trim()
                  ? user.description
                  : "This user has no description."}
              </p>
            </div>
            <button className="message-button" title="Send Message" onClick={handleMessageClick}>
              <i className="fas fa-envelope"></i>
            </button>
          </div>
          <div className="homepage-divider" />
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
