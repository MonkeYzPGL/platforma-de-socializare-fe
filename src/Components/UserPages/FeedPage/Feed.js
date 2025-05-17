import React, { useEffect, useState } from "react";
import "./Feed.css";
import { getFriendList } from "../../API/neo-friend";
import {
  getUserById,
  getAlbumPhotos,
  getUserAlbums,
  getPostByImageUrl,
  getUsernameById
} from "../../API/user-account";
import {
  getLikes,
  getComments,
  likePost,
  unlikePost,
  addComment,
} from "../../API/post-interactions";
import ClickableLogo from "../../ClickableLogo";
import SearchBar from "../../GeneralComponents/SearchBar/SearchBar";
import { useHistory } from "react-router-dom";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [albumIndexes, setAlbumIndexes] = useState({});
  const [hasNoFriends, setHasNoFriends] = useState(false);
  const [usernamesById, setUsernamesById] = useState({});

  const history = useHistory();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const getCommentValue = (postId) => newComment[postId] || "";

  useEffect(() => {
    if (!currentUser?.id) return;

    getFriendList(currentUser.id, async (friends, status) => {
      if (status === 200 && Array.isArray(friends)) {
        if (friends.length === 0) {
          setHasNoFriends(true);
          return;
        }

        const allPosts = [];

        for (const friend of friends) {
          await getUserById(friend.id, async (userData, statusUser) => {
            if (statusUser === 200) {
              await getUserAlbums(friend.id, async (albumsResult, statusAlbums) => {
                if (statusAlbums === 200 && albumsResult.albums) {
                  const albums = [];

                  for (const item of albumsResult.albums) {
                    if (item.endsWith(".png")) {
                      const url = `https://platforma-de-socializare-image-pool.s3.eu-north-1.amazonaws.com/${friend.id}/${item}`;
                      await getPostByImageUrl(url, (post, status) => {
                        if (status === 200 && post?.id) {
                          allPosts.push({
                            type: "photo",
                            userId: friend.id,
                            url,
                            postId: post.id,
                            username: userData.username,
                            profilePicture: userData.profilePicture || "/public/poze/default-avatar.png",
                          });
                          fetchPostData(post.id);
                        }
                      });
                    } else {
                      albums.push(item);
                    }
                  }

                  for (const albumName of albums) {
                    await getAlbumPhotos(friend.id, albumName, (photosResult, statusPhotos) => {
                      if (statusPhotos === 200 && Array.isArray(photosResult.photos)) {
                        const firstPhoto = photosResult.photos[0];
                        getPostByImageUrl(firstPhoto, (post, status) => {
                          if (status === 200 && post?.id) {
                            allPosts.push({
                              type: "album",
                              userId: friend.id,
                              albumName,
                              photos: photosResult.photos,
                              postId: post.id,
                              username: userData.username,
                              profilePicture: userData.profilePicture || "/public/poze/default-avatar.png",
                            });
                            fetchPostData(post.id);
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }

        setTimeout(() => {
          const shuffled = allPosts.sort(() => 0.5 - Math.random());
          setPosts(shuffled);
          shuffled.forEach(p => {
            if (p.postId) fetchPostData(p.postId);
          });
        }, 1000);
      }
    });
  }, []);

  const fetchPostData = (postId) => {
    getLikes(postId, (res, status) => {
      if (status === 200 && Array.isArray(res)) {
        setLikesMap(prev => ({ ...prev, [postId]: res }));

        setLikedPosts(prev => {
          const updated = new Set(prev);
          const alreadyLiked = res.find(u => u.id === currentUser.id);
          alreadyLiked ? updated.add(postId) : updated.delete(postId);
          return updated;
        });
      }
    });

    getComments(postId, (res, status) => {
      if (status === 200) {
        setCommentsMap(prev => ({ ...prev, [postId]: res }));
      }
    });
  };

  useEffect(() => {
    const allUserIds = new Set();

    Object.values(commentsMap).forEach(comments => {
      comments.forEach(comment => {
        if (comment.userId && !usernamesById[comment.userId]) {
          allUserIds.add(comment.userId);
        }
      });
    });

    allUserIds.forEach(userId => {
      getUsernameById(userId, (res, status) => {
        if (status === 200 && res.username) {
          setUsernamesById(prev => ({ ...prev, [userId]: res.username }));
        }
      });
    });
  }, [commentsMap]);

  const handleToggleLike = (postId) => {
    if (!postId || !currentUser?.id) return;

    const isLiked = likedPosts.has(postId);
    const toggle = isLiked ? unlikePost : likePost;

    toggle(currentUser.id, postId, (_, status) => {
      if (status === 200 || status === 201) {
        fetchPostData(postId);
      }
    });
  };

  const handleAddComment = (postId) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    addComment(currentUser.id, postId, content, (_, status) => {
      if (status === 200 || status === 201) {
        fetchPostData(postId);
        setNewComment(prev => ({ ...prev, [postId]: "" }));
      }
    });
  };

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
            {post.type === "photo" ? (
              <img src={post.url} alt="post" className="feed-photo" />
            ) : (
              <div className="feed-album">
                <button
                  className="album-nav-btn prev"
                  onClick={() => {
                    const currentIndex = albumIndexes[post.albumName] || 0;
                    const newIndex = currentIndex === 0 ? post.photos.length - 1 : currentIndex - 1;
                    setAlbumIndexes({ ...albumIndexes, [post.albumName]: newIndex });
                  }}
                >
                  ⬅️
                </button>
                <img
                  src={post.photos[albumIndexes[post.albumName] || 0]}
                  alt="album"
                  className="feed-photo"
                />
                <button
                  className="album-nav-btn next"
                  onClick={() => {
                    const currentIndex = albumIndexes[post.albumName] || 0;
                    const newIndex = (currentIndex + 1) % post.photos.length;
                    setAlbumIndexes({ ...albumIndexes, [post.albumName]: newIndex });
                  }}
                >
                  ➡️
                </button>
              </div>
            )}
            <div className="feed-right">
              <div
                className="feed-username"
                onClick={() => history.push(`/view-profile/${post.userId}`)}
                style={{ cursor: "pointer" }}
              >
                @{post.username}
              </div>
              <div className="likes" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => handleToggleLike(post.postId)}>
                  {likedPosts.has(post.postId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span>Total: {likesMap[post.postId]?.length || 0}</span>
              </div>
              <div className="comments">
                <h4>Comments</h4>
                {(commentsMap[post.postId] || []).slice().reverse().map((c, i) => (
                  <div key={i} className="comment">
                    <span><b>@{usernamesById[c.userId] || "..."}</b>: {c.content}</span>
                  </div>
                ))}
                <div className="add-comment" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  <input
                    type="text"
                    className="feed-comment-input"
                    placeholder="Write a comment..."
                    value={getCommentValue(post.postId)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewComment(prev => ({ ...prev, [post.postId]: value }));
                    }}
                  />
                  <button className="feed-comment-button" onClick={() => handleAddComment(post.postId)}>
                    ➕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
