import React from "react";
import "./HomePage.css";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFriendList } from "../../API/neo-friend";
import { getPendingRequests } from "../../API/friend-request";
import SearchBar from "../../GeneralComponents/SearchBar/SearchBar";
import ClickableLogo from "../../ClickableLogo";
import { uploadProfilePicture, deleteProfilePicture, deleteUserPhoto, getAlbumPhotos, getUserAlbums, getPostByImageUrl, getUserById, getUsernameById } from "../../API/user-account";
import { likePost, unlikePost, getLikes, getComments, addComment } from "../../API/post-interactions";

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
  const [albums, setAlbums] = useState([]);
  const [activePhotoPostId, setActivePhotoPostId] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [activeAlbumPostId, setActiveAlbumPostId] = useState(null);;

  const [likesMap, setLikesMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  const [usernamesById, setUsernamesById] = useState({});
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      getFriendList(storedUser.id, (res, status) => status === 200 && setFriends(res));
      getPendingRequests(storedUser.id, (res, status) => status === 200 && setPendingRequests(res));

      getUserAlbums(storedUser.id, (res, status) => {
        if (status === 200 && Array.isArray(res.albums)) {
          const photos = [], albumsArr = [];
          res.albums.forEach(item => {
            if (item.endsWith(".png")) {
              photos.push(`https://platforma-de-socializare-image-pool.s3.eu-north-1.amazonaws.com/${storedUser.id}/${item}`);
            } else {
              albumsArr.push({ name: item, photos: [] });
            }
          });
          setUserPhotos(photos);
          setAlbums(albumsArr);
          albumsArr.forEach((album, idx) => {
            getAlbumPhotos(storedUser.id, album.name, (res, status) => {
              if (status === 200) {
                albumsArr[idx].photos = res.photos;
                setAlbums([...albumsArr]);
              }
            });
          });
        }
      });
    }
  }, []);

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


  const fetchLikesAndComments = (postId) => {
    getLikes(postId, (res, status) => {
      if (status === 200) {
        setLikesMap(prev => ({ ...prev, [postId]: res }));
        const updated = new Set(likedPosts);
        res.find(u => u.id === user.id) ? updated.add(postId) : updated.delete(postId);
        setLikedPosts(updated);
      }
    });
    getComments(postId, (res, status) => status === 200 && setCommentsMap(prev => ({ ...prev, [postId]: res })));
  };

  const handlePhotoClick = (url) => {
    setActivePhoto(url);
    getPostByImageUrl(url, (post, status) => {
      if (status === 200) {
        setActivePhotoPostId(post.id);
        fetchLikesAndComments(post.id);
      }
    });
  };

  const handleAlbumPhotoClick = (url, album, index) => {
  setActiveAlbum(album);
  setActiveAlbumIndex(index);
  setActivePhoto(null); // ← asigură-te că modalul de poză NU se activează
  getPostByImageUrl(url, (post, status) => {
    if (status === 200) {
      setActiveAlbumPostId(post.id);
      fetchLikesAndComments(post.id);
    }
  });
};


  const handleToggleLike = (postId) => {
    const isLiked = likedPosts.has(postId);
    const toggle = isLiked ? unlikePost : likePost;
    toggle(user.id, postId, (_, status) => {
      if (status === 200 || status === 201) {
        getLikes(postId, (res, status) => {
          if (status === 200) {
            const updated = new Set(likedPosts);
            res.find(u => u.id === user.id) ? updated.add(postId) : updated.delete(postId);
            setLikesMap(prev => ({ ...prev, [postId]: res }));
            setLikedPosts(updated);
          }
        });
      }
    });
  };

  const handleAddComment = (postId) => {
    const content = newComment[postId];
    if (!content?.trim()) return;
    addComment(user.id, postId, content, (_, status) => {
      if (status === 200 || status === 201) {
        getComments(postId, (res, status) => {
          if (status === 200) {
            setCommentsMap(prev => ({ ...prev, [postId]: res }));
            setNewComment(prev => ({ ...prev, [postId]: "" }));
          }
        });
      }
    });
  };

  const getCommentValue = (postId) => newComment[postId] || "";

  const closeModal = () => {
    setActivePhoto(null);
    setActivePhotoPostId(null);
  };

  const closeAlbumModal = () => {
    setActiveAlbum(null);
    setActiveAlbumPostId(null);
  };

  

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
          {/* Afiseaza poze individuale */}
          {userPhotos.length > 0 && userPhotos.map((photoUrl, idx) => (
              <div key={idx} className="homepage-photo-wrapper">
                  <div
                      className="homepage-photo"
                      style={{ backgroundImage: `url(${photoUrl})` }}
                      onClick={() => handlePhotoClick(photoUrl)}
                  ></div>
              </div>
          ))}

          {/* Afiseaza albume */}
          {albums.map((album, idx) => (
            <div key={idx} className="homepage-photo-wrapper">
              <div className="homepage-photo" style={{ backgroundImage: `url(${album.photos[0]})` }}
                onClick={() => {
                  handleAlbumPhotoClick(album.photos[0], album, 0);
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
          <div className="photo-modal" onClick={e => e.stopPropagation()}>

          
            <button className="delete-photo-btn" onClick={() => handleDeletePhoto(activePhoto)}>
              🗑️
            </button>

            <img src={activePhoto} alt="Expanded" />
            <div className="photo-info">
              <div className="likes">
                <button onClick={() => handleToggleLike(activePhotoPostId)}>
                  {likedPosts.has(activePhotoPostId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span>Total: {likesMap[activePhotoPostId]?.length || 0}</span>
              </div>
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
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
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

          
            <span className="close-modal" onClick={closeModal}>✖</span>
          </div>
        </div>
      )}


      {activeAlbum && (
        <div className="photo-modal-overlay" onClick={closeAlbumModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>

            <button
              className="delete-photo-btn"
              onClick={() => handleDeletePhoto(activeAlbum.photos[activeAlbumIndex])}
            >
              🗑️
            </button>

            <span className="close-modal" onClick={closeAlbumModal}>✖</span>

            <button className="album-nav-btn prev" onClick={() => {
              const prevIdx = activeAlbumIndex === 0 ? activeAlbum.photos.length - 1 : activeAlbumIndex - 1;
              const prevPhoto = activeAlbum.photos[prevIdx];
              setActiveAlbumIndex(prevIdx);
              handleAlbumPhotoClick(prevPhoto, activeAlbum, prevIdx);
            }}>⬅️</button>

            <img src={activeAlbum.photos[activeAlbumIndex]} alt="Album" />

            <button className="album-nav-btn next" onClick={() => {
              const nextIdx = (activeAlbumIndex + 1) % activeAlbum.photos.length;
              const nextPhoto = activeAlbum.photos[nextIdx];
              setActiveAlbumIndex(nextIdx);
              handleAlbumPhotoClick(nextPhoto, activeAlbum, nextIdx);
            }}>➡️</button>

            <div className="photo-info">
              <div className="likes">
                <button onClick={() => handleToggleLike(activeAlbumPostId)}>
                  {likedPosts.has(activeAlbumPostId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span>Total: {likesMap[activeAlbumPostId]?.length || 0}</span>
              </div>
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
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
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