import React, { useEffect, useState, useCallback } from "react";
import { getFriendList, deleteFriendship, getMutualFriendsNr } from "../../API/neo-friend";
import { getUserById } from "../../API/user-account"; 
import { useHistory } from "react-router-dom";
import "./FriendList.css";
import ClickableLogo from "../../ClickableLogo";

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [loggedUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const history = useHistory();

  const loadFriends = useCallback(() => {
    if (!loggedUser) return;
    setIsLoading(true);


    getFriendList(loggedUser.id, async (friendData, friendStatus) => {
      if (friendStatus === 200 && Array.isArray(friendData)) {
        const fullFriends = await Promise.all(
          friendData.map(friend =>
            new Promise((resolve) => {
              getUserById(friend.id, (userData, userStatus) => {
                if (userStatus === 200) {
                  getMutualFriendsNr(loggedUser.id, userData.id, (mutualData, mutualStatus) => {
                    if (mutualStatus === 200) {
                      resolve({
                        ...userData,
                        mutualFriendsCount: mutualData
                      });
                    } else {
                      resolve({
                        ...userData,
                        mutualFriendsCount: 0
                      });
                    }
                  });
                } else {
                  resolve(null);
                }
              });
            })
          )
        );
  
        const filtered = fullFriends.filter(f => f !== null);
        setFriends(filtered);
      } else {
        console.error("Failed to load friends");
      }
  
      setIsLoading(false);
    });
  }, [loggedUser]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleRemoveFriend = (friendId) => {
    setIsLoading(true);
    deleteFriendship(loggedUser.id, friendId, (result, status, error) => {
      if (status >= 200 && status < 300) {
        loadFriends();
      } else {
        alert("Failed to remove friend.");
        console.error(error);
        setIsLoading(false);
      }
    });
  };


  const filteredFriends = friends.filter(friend => {
    const username = friend?.username?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return username.includes(term);
  });

  return (
    <div className="friend-list-page">
      <ClickableLogo className="logo" />
      <div className="friend-container">
        <input
          className="search-input"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="scroll-frame">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            filteredFriends.map(friend => (
              <div className="friend-card" key={friend.id}>
                <img
                  src={friend?.profilePicture || "/poze/no_photo.png"}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="friend-info">
                  <div className="username">@{friend.username}</div>
                  <div className="mutual">
                      {friend.mutualFriendsCount} 
                      {friend.mutualFriendsCount === 1 ? " mutual friend" : " mutual friends"}
                    </div>
                </div>
                <div className="buttons">
                  <button
                    className="btn-profile"
                    onClick={() => history.push(`/view-profile/${friend.id}`)}
                  >
                    View Profile
                  </button>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Remove Friend
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
