import React, { useEffect, useState } from "react";
import "../HomePage/HomePage.css";
import "./ViewProfile.css"
import { useParams, useHistory } from "react-router-dom";
import { getUserById, getUserPhotos, getPostByImageUrl, getUsernameById } from "../../API/user-account";
import { likePost, unlikePost, getLikes, getComments, addComment } from "../../API/post-interactions";
import SearchBar from "../../GeneralComponents/SearchBar/SearchBar";
import ClickableLogo from "../../ClickableLogo";

export default function ViewProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [userPhotos, setUserPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [activePhotoPostId, setActivePhotoPostId] = useState(null);
  const [activeAlbumPostId, setActiveAlbumPostId] = useState(null);

  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const [usernamesById, setUsernamesById] = useState({});

  const handleMessageClick = () => {
    if (user?.username) {
      history.push(`/chat/${user.username}`);
    }
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


  useEffect(() => {
    if (id) {
      getUserPhotos(id, (result, status) => {
        if (status === 200 && result?.photos) {
          const individualPhotos = [];
          const tempAlbums = {};

          result.photos.forEach(item => {
            const pathParts = item.split(`/${id}/`)[1];
            if (!pathParts) return;
            if (pathParts.includes("/")) {
              const albumParts = pathParts.split("/");
              const albumName = albumParts[0];
              if (!tempAlbums[albumName]) tempAlbums[albumName] = [];
              tempAlbums[albumName].push(item);
            } else {
              individualPhotos.push(item);
            }
          });

          const albumsArray = Object.keys(tempAlbums).map(name => ({
            name,
            photos: tempAlbums[name]
          }));

          setUserPhotos(individualPhotos);
          setAlbums(albumsArray);
        } else {
          setUserPhotos([]);
          setAlbums([]);
        }
      });
    }
  }, [id]);

  const fetchLikesAndComments = (postId) => {
    console.log("📥 fetchLikesAndComments for postId:", postId);

    getLikes(postId, (res, status) => {
      console.log("👍 Likes response:", res, "status:", status);
      if (status === 200 && Array.isArray(res)) {
        setLikesMap(prev => ({ ...prev, [postId]: res }));
        const updated = new Set(likedPosts);
        res.find(u => u.id === currentUser.id) ? updated.add(postId) : updated.delete(postId);
        setLikedPosts(updated);
      }
    });

    getComments(postId, (res, status) => {
      console.log("💬 Comments response:", res, "status:", status);
      if (status === 200) {
        setCommentsMap(prev => ({ ...prev, [postId]: res }));
      }
    });
  };

  const handlePhotoClick = (url) => {
    getPostByImageUrl(url, (post, status) => {
      if (status === 200 && post?.id) {
        const postId = post.id;
        console.log("✅ handlePhotoClick - postId:", postId);
        setActivePhoto(url);
        setActivePhotoPostId(postId);
        fetchLikesAndComments(postId);
      } else {
        console.error("❌ Nu s-a găsit postarea pentru imaginea:", url);
      }
    });
  };

  const handleAlbumPhotoClick = (url) => {
    getPostByImageUrl(url, (post, status) => {
      if (status === 200 && post?.id) {
        const postId = post.id;
        console.log("✅ handleAlbumPhotoClick - postId:", postId);
        setActivePhoto(url);
        setActiveAlbumPostId(postId);
        fetchLikesAndComments(postId);
      } else {
        console.error("❌ Nu s-a găsit postarea pentru imaginea:", url);
      }
    });
  };

  const handleToggleLike = (postId) => {
    if (!postId || !currentUser.id) return;

    const isLiked = likedPosts.has(postId);
    const toggle = isLiked ? unlikePost : likePost;

    toggle(currentUser.id, postId, (_, status) => {
      if (status === 200 || status === 201) {
        getLikes(postId, (res, status) => {
          if (status === 200 && Array.isArray(res)) {
            const updated = new Set(likedPosts);
            res.find(u => u.id === currentUser.id) ? updated.add(postId) : updated.delete(postId);
            setLikesMap(prev => ({ ...prev, [postId]: res }));
            setLikedPosts(updated);
          }
        });
      } else {
        console.error("❌ Eroare la like/unlike:", status);
      }
    });
  };

  const handleAddComment = (postId) => {
    const content = newComment[postId];
    const userId = currentUser?.id;

    if (!postId || !content?.trim()) return;

    addComment(userId, postId, content, (_, status) => {
      if (status === 200 || status === 201) {
        getComments(postId, (res, status) => {
          if (status === 200) {
            setCommentsMap(prev => ({ ...prev, [postId]: res }));
            setNewComment(prev => ({ ...prev, [postId]: "" }));
          }
        });
      } else {
        console.error("❌ Eroare la addComment, status:", status);
      }
    });
  };

  const getCommentValue = (postId) => newComment[postId] || "";

  const closeModal = () => {
    setActivePhoto(null);
    setActivePhotoPostId(null);
    setActiveAlbum(null);             
    setActiveAlbumPostId(null);       
  };


  const closeAlbumModal = () => {
  setActiveAlbum(null);
  setActiveAlbumPostId(null);
  setActivePhoto(null);             
  setActivePhotoPostId(null);      
};


  return (
    <div className="homepage-container">
      <SearchBar />
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
                {user?.description?.trim() ? user.description : "This user has no description."}
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
        {userPhotos.map((photoUrl, idx) => (
          <div key={idx} className="homepage-photo-wrapper">
            <div
              className="homepage-photo"
              style={{ backgroundImage: `url(${photoUrl})` }}
              onClick={() => handlePhotoClick(photoUrl)}
            ></div>
          </div>
        ))}

        {albums.map((album, idx) => (
          <div key={idx} className="homepage-photo-wrapper">
            <div
              className="homepage-photo"
              style={{ backgroundImage: `url(${album.photos[0]})` }}
              onClick={() => {
                setActiveAlbum(album);
                setActiveAlbumIndex(0);
                handleAlbumPhotoClick(album.photos[0]);
              }}
            ></div>
            <p className="album-name">{album.name}</p>
          </div>
        ))}

        {userPhotos.length === 0 && albums.length === 0 && (
          <div className="no-photos-message">
            <img src="/public/poze/no-photos-icon.png" alt="No Photos" />
            <p>This space is so boring...<br />Maybe add some photos?</p>
          </div>
        )}
      </div>

      {activePhoto && (
        <div className="photo-modal-overlay" onClick={closeModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>✖</span>
            <img src={activePhoto} alt="Expanded" />
            <div className="photo-info">
              <div className="likes" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => handleToggleLike(activePhotoPostId)}>
                  {likedPosts.has(activePhotoPostId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span>Total: {likesMap[activePhotoPostId]?.length || 0}</span>
              </div>
              <div className="desc"><b>Description:</b> Poza adăugată de utilizator</div>
              <div className="comments">
                <h4>Comments</h4>
               {(commentsMap[activePhotoPostId] || []).slice().reverse().map((c, i) => {
                  const username = usernamesById[c.userId] || "...";
                  return (
                    <div key={i} className="comment">
                      <span><b>@{username}</b>: {c.content}</span>
                    </div>
                  );
                })}

                <div className="add-comment" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    style={{ flex: "1", minWidth: "200px" }}
                    value={getCommentValue(activePhotoPostId)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewComment(prev => ({ ...prev, [activePhotoPostId]: value }));
                    }}
                  />
                  <button onClick={() => handleAddComment(activePhotoPostId)}>➕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAlbum && (
        <div className="photo-modal-overlay" onClick={closeAlbumModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeAlbumModal}>✖</span>

            <button className="album-nav-btn prev" onClick={() => {
              const prevIdx = activeAlbumIndex === 0 ? activeAlbum.photos.length - 1 : activeAlbumIndex - 1;
              const prevPhoto = activeAlbum.photos[prevIdx];
              setActiveAlbumIndex(prevIdx);
              handleAlbumPhotoClick(prevPhoto);
            }}>⬅️</button>

            <img src={activeAlbum.photos[activeAlbumIndex]} alt="Album" />

            <button className="album-nav-btn next" onClick={() => {
              const nextIdx = (activeAlbumIndex + 1) % activeAlbum.photos.length;
              const nextPhoto = activeAlbum.photos[nextIdx];
              setActiveAlbumIndex(nextIdx);
              handleAlbumPhotoClick(nextPhoto);
            }}>➡️</button>

            <div className="photo-info">
              <div className="likes" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => handleToggleLike(activeAlbumPostId)}>
                  {likedPosts.has(activeAlbumPostId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span>Total: {likesMap[activeAlbumPostId]?.length || 0}</span>
              </div>
              <div className="desc"><b>Description:</b> {activeAlbum.name}</div>
              <div className="comments">
                <h4>Comments</h4>
                {(commentsMap[activeAlbumPostId] || []).slice().reverse().map((c, i) => {
                  const username = usernamesById[c.userId] || "...";
                  return (
                    <div key={i} className="comment">
                      <span><b>@{username}</b>: {c.content}</span>
                    </div>
                  );
                })}

                <div className="add-comment" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    style={{ flex: "1", minWidth: "200px" }}
                    value={getCommentValue(activeAlbumPostId)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewComment(prev => ({ ...prev, [activeAlbumPostId]: value }));
                    }}
                  />
                  <button onClick={() => handleAddComment(activeAlbumPostId)}>➕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
