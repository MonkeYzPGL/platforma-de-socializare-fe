import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers } from "../../API/user-account";
import { getPendingRequests, acceptFriendRequest, rejectFriendRequest } from "../../API/friend-request";
import { useHistory } from "react-router-dom";
import "./PendingRequests.css";

export default function PendingRequests() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <- loading state
  const [loggedUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const history = useHistory();

  const loadPendingUsers = useCallback(() => {
    if (!loggedUser) return;
    setIsLoading(true); // start loading

    getAllUsers((allUsers, userStatus) => {
      if (userStatus === 200) {
        getPendingRequests(loggedUser.id, (pendingData, pendingStatus) => {
          if (pendingStatus === 200 && Array.isArray(pendingData)) {
            const senderIds = pendingData.map(p => Number(p.senderId));
            const filtered = allUsers.filter(
              user => senderIds.includes(Number(user.id))
            );
            setPendingUsers(filtered);
          } else {
            console.error("Failed to fetch pending requests");
          }
          setIsLoading(false); // end loading
        });
      } else {
        console.error("Failed to fetch users");
        setIsLoading(false); // end loading
      }
    });
  }, [loggedUser]);

  useEffect(() => {
    loadPendingUsers();
  }, [loadPendingUsers]);

  const handleAccept = (senderId) => {
    acceptFriendRequest(senderId, loggedUser.id, (result, status, error) => {
      if (status >= 200 && status < 300) {  
        setPendingUsers(prev => prev.filter(user => user.id !== senderId));
      } else {
        alert("Failed to accept request.");
        console.error(error);
      }
    });
  };
  
  const handleReject = (senderId) => {
    rejectFriendRequest(senderId, loggedUser.id, (result, status, error) => {
      if (status >= 200 && status < 300) { 
        setPendingUsers(prev => prev.filter(user => user.id !== senderId));
      } else {
        alert("Failed to reject request.");
        console.error(error);
      }
    });
  };
  

  const filteredUsers = pendingUsers.filter(user => {
    const username = user?.username?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return username.includes(term);
  });

  return (
    <div className="pending-requests-page">
      <div className="logo" />
      <div className="friend-container">
        <input
          className="search-input"
          placeholder="Search by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="scroll-frame">
          {isLoading ? (
            <div className="spinner"></div> // spinner loading
          ) : (
            filteredUsers.map(user => (
              <div className="friend-card" key={user.id}>
                <img
                  src={user?.profilePicture || "/default-avatar.png"}
                  alt="Avatar"
                  className="avatar"
                />
                <div className="friend-info">
                  <div className="username">@{user.username}</div>
                  <div className="mutual">22 mutual friends</div>
                </div>
                <div className="buttons">
                  <button
                    className="btn-profile"
                    onClick={() => history.push(`/view-profile/${user.id}`)}
                  >
                    View Profile
                  </button>
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(user.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn-decline"
                    onClick={() => handleReject(user.id)}
                  >
                    Decline
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
