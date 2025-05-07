import React, { useEffect, useState } from "react";
import "./Feed.css";
import { getFriendList } from "../../API/neo-friend";
import { getUserById, getUserPhotos } from "../../API/user-account";
import ClickableLogo from "../../ClickableLogo";
import SearchBar from "../../GeneralComponents/SearchBar/SearchBar";
import { useHistory } from "react-router-dom";


export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const history = useHistory();
  const [hasNoFriends, setHasNoFriends] = useState(false);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) return;

    getFriendList(loggedUser.id, async (friends, status) => {
      if (status === 200 && Array.isArray(friends)) {
        if (friends.length === 0) {
          setHasNoFriends(true);
          return;
        }
        const allPosts = [];

        for (const friend of friends) {
          await getUserById(friend.id, async (userData, statusUser) => {
            if (statusUser === 200) {
              await getUserPhotos(friend.id, (photoResult, statusPhoto) => {
                if (statusPhoto === 200 && photoResult?.photos?.length > 0) {
                  photoResult.photos.forEach((photoUrl) => {
                    allPosts.push({
                      userId: friend.id,
                      photoUrl,
                      username: userData.username,
                      profilePicture: userData.profilePicture || "/public/poze/default-avatar.png"
                    });
                  });
                }
              });
            }
          });
        }

        setTimeout(() => {
          const shuffled = allPosts.sort(() => 0.5 - Math.random());
          setPosts(shuffled);
        }, 1000);
      }
    });
  }, []);

  return (
    <div className="feed-page">
      <SearchBar />
      <ClickableLogo className="feed-logo" />
      <div className="feed-container">
              {hasNoFriends && (
          <div className="no-friends-message">
            <p>You have no friends, maybe try to add someone!</p>
            <button onClick={() => history.push("/add-friends")} className="add-friends-button">
              Go to Add Friends
            </button>
          </div>
        )}
        {posts.map((post, idx) => (
          <div className="feed-card" key={idx}>
            <img src={post.photoUrl} alt="post" className="feed-photo" />
            <div className="feed-right">
            <div className="feed-username" onClick={() => history.push(`/view-profile/${post.userId}`)} style={{ cursor: "pointer" }}>@{post.username}</div>
              <div className="feed-likes">❤️ 128</div>
              <div className="feed-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <input className="feed-comment-input" placeholder="Leave a comment..." disabled />
              <button className="feed-comment-button" disabled>Post</button>
              <div className="feed-comments">
                <div className="comment"><b>@sample_username</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit...</div>
                <div className="comment"><b>@sample_username</b> Nice shot!</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
