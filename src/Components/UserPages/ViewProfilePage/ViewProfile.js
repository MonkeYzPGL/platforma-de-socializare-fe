import React, { useEffect, useState } from "react";
import "../HomePage/HomePage.css";
import "./ViewProfile.css"
import { useParams } from "react-router-dom";
import { getUserById, getUserPhotos } from "../../API/user-account";
import { useHistory } from "react-router-dom";
import SearchBar from "../../GeneralComponents/SearchBar/SearchBar";
import ClickableLogo from "../../ClickableLogo";

export default function ViewProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [userPhotos, setUserPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

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

  getUserPhotos(id, (result, status) => {
    if (status === 200 && result?.photos) {
      setUserPhotos(result.photos);
    } else {
      setUserPhotos([]);
    }
  });
  
  const handlePhotoClick = (url) => {
    setActivePhoto(url);
  };
  const closeModal = () => {
    setActivePhoto(null);
  };
  
  return (
    <div className="homepage-container">
      <SearchBar/>
      <div className="homepage-profile-header">
        <ClickableLogo className="homepage-logo" />

        <div className="homepage-profile-main">
          <div className="homepage-profile-info">
            <div className="homepage-profile-pic">
              <img
                src={user?.profilePicture || "/public/poze/no_photo.jpg"}
                alt="Profile"
                className="profile-preview-img"
              />
            </div>
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
        {userPhotos.length > 0 ? (
          userPhotos.map((photoUrl, idx) => (
            <div key={idx} className="homepage-photo-wrapper">
              <div
                className="homepage-photo"
                style={{ backgroundImage: `url(${photoUrl})` }}
                onClick={() => handlePhotoClick(photoUrl)}
              ></div>
            </div>
          ))
        ) : (
          <div className="no-photos-message">
            <img src="/public/poze/no-photos-icon.png" alt="No Photos" />
            <p>This space is so boring...<br />Maybe add some photos?</p>
          </div>
        )}
      </div>
      {activePhoto && (
        <div className="photo-modal-overlay" onClick={closeModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <img src={activePhoto} alt="Expanded" />
            <div className="photo-info">
              <div className="likes">❤️ 128</div>
              <div className="desc"><b>Description:</b> Aceasta este o fotografie postată de utilizator.</div>
              <div className="comments">
                <h4>Comments</h4>
                <div className="comment">
                  <img src="/public/poze/default-avatar.png" alt="avatar" />
                  <span><b>sampleUser:</b> Super poza!</span>
                </div>
                <div className="comment">
                  <img src="/public/poze/default-avatar.png" alt="avatar" />
                  <span><b>sampleUser:</b> Mi-a placut vibe-ul!</span>
                </div>
              </div>
            </div>
            <span className="close-modal" onClick={closeModal}>✖</span>
          </div>
        </div>
      )}
    </div>
  );
}
