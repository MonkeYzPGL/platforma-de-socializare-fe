import React, { useEffect, useState, useCallback } from "react";
import { getUserById } from "../../API/user-account";
import { getSuggestedFriends, getMutualFriendsNr } from "../../API/neo-friend";
import { sendFriendRequest } from '../../API/friend-request';
import { useHistory } from "react-router-dom";
import "./AddFriends.css";
import ClickableLogo from "../../ClickableLogo";

export default function AddFriendPage() {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loggedUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const history = useHistory();

    const loadSuggestedUsers = useCallback(() => {
        if (!loggedUser) return;
      
        getSuggestedFriends(loggedUser.id, async (suggestions, status, error) => {
          if (status === 200 && Array.isArray(suggestions)) {
            try {
              const detailedUsers = await Promise.all(
                suggestions.map(suggestion =>
                  new Promise((resolve) => {
                    getUserById(suggestion.id, (result, status) => {
                      if (status === 200) {
                        getMutualFriendsNr(loggedUser.id, result.id, (mutualResult, mutualStatus) => {
                          if (mutualStatus === 200) {
                            resolve({
                              ...result,
                              mutualFriendsCount: mutualResult
                            });
                          } else {
                            console.error("Failed to fetch mutual friends for id:", result.id);
                            resolve({
                              ...result,
                              mutualFriendsCount: 0
                            });
                          }
                        });
                      } else {
                        console.error("Failed to fetch user details for id:", suggestion.id);
                        resolve(null);
                      }
                    });
                  })
                )
              );
              const validUsers = detailedUsers.filter(user => user !== null);
              setSuggestedUsers(validUsers);
      
            } catch (err) {
              console.error("Error loading full user details", err);
            }
          } else {
            console.error("Failed to fetch suggested friends", error);
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
      <ClickableLogo className="admin-logo" disableNavigation={true} />
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
              <img
                className="avatar"
                src={user.profilePicture && user.profilePicture.trim() !== "" ? user.profilePicture : "/poze/no_photo.png"}
                alt="avatar"
              />
              <div className="friend-info">
                <div className="username">@{user.username}</div>
                <div className="mutual">
                    {user.mutualFriendsCount} {user.mutualFriendsCount === 1 ? " mutual friend" : " mutual friends"}
                </div>              
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
