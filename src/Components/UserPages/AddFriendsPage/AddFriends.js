import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers } from "../../API/user-account";
import { getFriendList } from "../../API/neo-friend";
import { sendFriendRequest } from '../../API/friend-request';
import { useHistory } from "react-router-dom";
import "./AddFriends.css";

export default function AddFriendPage() {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loggedUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const history = useHistory();

    const loadSuggestedUsers = useCallback(() => {
        if (!loggedUser) return;
      
        getAllUsers((allUsers, userStatus) => {
          if (userStatus === 200) {
            getFriendList(loggedUser.id, (friendData, friendStatus) => {
              if (friendStatus === 200 && Array.isArray(friendData)) {
                const friendIds = friendData.map(friend => Number(friend.id));
                const filtered = allUsers.filter(
                  u => Number(u.id) !== Number(loggedUser.id) && !friendIds.includes(Number(u.id))
                );
                setSuggestedUsers(filtered);
              } else {
                console.error("Friend list fetch error");
              }
            });
          }
        });
      }, [loggedUser]);           
  
    useEffect(() => {
        loadSuggestedUsers();
    }, [loadSuggestedUsers]);
  
  const handleAddFriend = (receiverId) => {
    const senderId = loggedUser.id;
  
    sendFriendRequest(senderId, receiverId, (result, status, error) => {
      if (status === 201) {
        alert("Friend request sent!");
        loadSuggestedUsers();
      } else {
        alert("Failed to send friend request.");
        console.error(error);
      }
    });
  };

  const filteredUsers = suggestedUsers.filter(user => {
    const username = user.username.toLowerCase();
    const term = searchTerm.toLowerCase();
  
    return username.includes(term);
  });
  
  return (
    <div className="add-friend-page">
      <div className="logo" />
      <div className="friend-container">
      <input
            className="search-input"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="scroll-frame">
            {filteredUsers.map(user => (
            <div className="friend-card" key={user.id}>
              <div className="avatar" />
              <div className="friend-info">
                <div className="username">@{user.username}</div>
                <div className="mutual">22 mutual friends</div>
              </div>
              <div className="buttons">
                <button className="btn-profile" onClick={() => history.push(`/view-profile/${user.id}`)}>View Profile</button>
                <button className="btn-add" onClick={() => handleAddFriend(user.id)}>Add Friend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
