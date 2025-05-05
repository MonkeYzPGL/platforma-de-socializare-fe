import React from "react";
import "./HomePage.css";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFriendList } from "../../API/neo-friend";
import { getPendingRequests } from "../../API/friend-request";
import SearchBar from "../../GeneralComponents/SearchBar";
import ClickableLogo from "../../ClickableLogo";

export default function HomePage() {

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser) {
      setUser(storedUser);
  
      getFriendList(storedUser.id, (result, status, error) => {
        if (status === 200 && result) {
          setFriends(result);
        } else {
          console.error('Failed to fetch friends list:', error);
        }
      });
  
      getPendingRequests(storedUser.id, (result, status, error) => {
        if (status === 200 && Array.isArray(result)) {
          setPendingRequests(result);
        } else {
          console.error('Failed to fetch pending requests:', error);
        }
      });
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

  const handleAddFriendsClick = () => {
    history.push("/add-friends");
  }

  const handleFriendListClick = () => {
    history.push("/friend-list");
  };  

  const handlePendingRequestsClick = () => {
    history.push("/pending-requests");
  };
  

  return (
    <div className="homepage-container">
      <SearchBar />
      <div className="homepage-profile-header">
        <ClickableLogo className="homepage-logo" />

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
          <button className="homepage-button homepage-friend-list" onClick={handleFriendListClick}>
              Friend List <span>{friends.length}</span>
            </button>

            <button className="homepage-button homepage-add-friend" onClick={handleAddFriendsClick}>Add New Friends</button>
            <button className="homepage-button homepage-pending-requests" onClick={handlePendingRequestsClick}>
              Pending Requests <span>{pendingRequests.length}</span>
            </button>
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
