import React from "react";
import "./HomePage.css";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFriendList } from "../../API/neo-friend";
import { getPendingRequests } from "../../API/friend-request";
import SearchBar from "../../GeneralComponents/SearchBar";
import ClickableLogo from "../../ClickableLogo";
import { uploadProfilePicture, deleteProfilePicture, getUserPhotos, deleteUserPhoto } from "../../API/user-account";

export default function HomePage() {

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const history = useHistory();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);

      getFriendList(storedUser.id, (result, status, error) => {
        if (status === 200 && result) setFriends(result);
      });

      getPendingRequests(storedUser.id, (result, status, error) => {
        if (status === 200 && Array.isArray(result)) setPendingRequests(result);
      });

      getUserPhotos(storedUser.id, (result, status, error) => {
        if (status === 200 && result?.photos) {
          setUserPhotos(result.photos);
        } else {
          setUserPhotos([]);
        }
      });
    }
  }, []);

  const handleDeletePhoto = (photoUrl) => {
    const parts = photoUrl.split('/');
    const userId = parts[parts.length - 2];
    const photoTitleWithExt = parts[parts.length - 1];
    const photoTitle = photoTitleWithExt.replace(/\.[^/.]+$/, "");
    const confirmDelete = window.confirm("Sigur vrei sa stergi aceasta poza?");

    if (!confirmDelete) return;
    
    deleteUserPhoto(userId, photoTitle, (result, status, error) => {
      if (status === 200) {
        alert("Poza a fost stearsa!");
        setUserPhotos(prev => prev.filter(p => p !== photoUrl));
        setActivePhoto(null);
      } else {
        alert("Eroare la stergerea pozei.");
      }
    });
  };

  const handleDeleteProfilePicture = () => {
    deleteProfilePicture(user.id, (result, status, error) => {
      if (status === 200) {
        alert("Poza de profil a fost stearsa!");
        setSelectedImage(null);
        const updatedUser = { ...user, profilePicture: null };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        alert("Eroare la stergerea pozei.");
      }
    });
  };

  const handleProfileEditClick = () => {
    setShowUploadForm(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setSelectedImage(URL.createObjectURL(file));
      setPendingFile(file);
    } else {
      alert("Doar fisiere .png sunt permise.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setPendingFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Poti incarca doar fisiere PNG.");
    }
  };

  const handleUploadConfirm = () => {
    if (!pendingFile) return;
  
    uploadProfilePicture(user.id, pendingFile, (result, status, error) => {
      if (status === 200 && result?.url) {
        alert("Poza a fost actualizata!");

        const updatedUser = { ...user, profilePicture: result.url };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        setSelectedImage(result.url);
  
        setShowUploadForm(false);
        setPendingFile(null);
      } else {
        alert("Eroare la actualizare.");
      }
    });
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleEditPageClick = () => {
    history.push("/edit-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);                    
    history.push("/");               
  };

  const handleAddFriendsClick = () => {
    history.push("/add-friends");
  }

  const handleFriendListClick = () => {
    history.push("/friend-list");
  };  

  const handlePendingRequestsClick = () => {
    history.push("/pending-requests");
  };
  
  const handlePhotoClick = (photoUrl) => {
    setActivePhoto(photoUrl);
  };
  
  const closeModal = () => {
    setActivePhoto(null);
  };

  return (
    <div className="homepage-container">
      <SearchBar />
      <div className="homepage-profile-header">
        <ClickableLogo className="homepage-logo" />

        <div className="homepage-profile-main">
          =
          <div className="homepage-profile-info">
          <div className="homepage-profile-pic" onClick={handleProfileEditClick}>
          <img
            src={selectedImage || (user?.profilePicture || "/public/poze/no_photo.jpg")}
            alt="Profile"
            className="profile-preview-img"
          />
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
              {showUploadForm && (
                <div className="upload-form" onDrop={handleDrop} onDragOver={handleDragOver}>
                  <p>Trage o poza .png aici sau selecteaza manual:</p>
                  <input type="file" accept="image/png" onChange={handleFileChange} />
                  {pendingFile && (
                    <button onClick={handleUploadConfirm} className="update-button">Update</button>
                  )}
                  {user?.profilePicture && (
                    <button onClick={handleDeleteProfilePicture} className="delete-button">Delete</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="homepage-divider" />

          <div className="homepage-profile-buttons">
          <button className="homepage-button homepage-friend-list" onClick={handleFriendListClick}>
              Friend List <span>{friends.length}</span>
            </button>

            <button className="homepage-button homepage-add-friend" onClick={handleAddFriendsClick}>Add New Friends</button>
            <button className="homepage-button homepage-pending-requests" onClick={handlePendingRequestsClick}>
              Pending Requests <span>{pendingRequests.length}</span>
            </button>
            <button className="homepage-button homepage-edit-profile" onClick={handleEditPageClick}>Edit Profile</button>
            <button className="homepage-button homepage-add-photo" onClick={() => history.push("/add-photo")}>Add Photo</button>
            <button className="homepage-button homepage-logout" onClick={handleLogout}>Log Out</button>
          </div>
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
          <div className="photo-modal" onClick={e => e.stopPropagation()}>
            <button className="delete-photo-btn" onClick={() => handleDeletePhoto(activePhoto)}>
              🗑️
            </button>
            <img src={activePhoto} alt="Expanded" />
            <div className="photo-info">
              <div className="likes">❤️ 128</div>
              <div className="desc"><b>Description:</b> Primul meu InternSHIP...💀💀💀💀💀</div>

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