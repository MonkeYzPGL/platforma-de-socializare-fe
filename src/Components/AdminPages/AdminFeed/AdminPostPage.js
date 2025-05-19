import React, { useEffect, useState } from "react";
import "./AdminPostPage.css";
import { getAllUsers, deleteUserPhoto, deleteUserAlbum, getUserAlbums, getAlbumPhotos, getPostByImageUrl } from "../../API/user-account";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = () => {
    getAllUsers((users, status) => {
      if (status === 200 && Array.isArray(users)) {
        const allPosts = [];

        const userPromises = users.map(user =>
          new Promise(resolve => {
            getUserAlbums(user.id, (albumsResponse, albumStatus) => {
              const albums = albumsResponse.albums || [];
              console.log(`User ID: ${user.id} Albums:`, albums);

              if (albumStatus === 200 && Array.isArray(albums)) {
                const albumPromises = albums.map(albumName =>
                  new Promise(albumResolve => {
                    getAlbumPhotos(user.id, albumName, (photosResponse, photoStatus) => {
                      const photos = photosResponse.photos || [];
                      console.log(`Album: ${albumName} Photos:`, photos);

                      if (photoStatus === 200) {
                        if (albumName.endsWith(".png")) {
                          // Tratăm poza simplă
                          const photoUrl = `https://platforma-de-socializare-image-pool.s3.eu-north-1.amazonaws.com/${user.id}/${albumName}`;
                          getPostByImageUrl(photoUrl, (post, postStatus) => {
                            if (postStatus === 200 && post?.id) {
                              allPosts.push({
                                type: "photo",
                                userId: user.id,
                                url: photoUrl,
                                postId: post.id,
                                username: user.username,
                                profilePicture: user.profilePicture || "/public/poze/default-avatar.png",
                              });
                            }
                            albumResolve();
                          });
                        } else {
                          // Tratăm albumul complet
                          if (photos.length > 0) {
                            allPosts.push({
                              type: "album",
                              userId: user.id,
                              albumName,
                              photos,
                              username: user.username,
                              profilePicture: user.profilePicture || "/public/poze/default-avatar.png",
                            });
                          }
                          albumResolve();
                        }
                      } else {
                        albumResolve();
                      }
                    });
                  })
                );

                Promise.all(albumPromises).then(() => resolve());
              } else {
                resolve();
              }
            });
          })
        );

        Promise.all(userPromises).then(() => {
          console.log("Loaded Posts:", allPosts);
          setPosts(allPosts);
        });
      }
    });
  };

  const handleDeletePhoto = (userId, photoUrl) => {
    const photoTitle = photoUrl.split("/").pop().replace(/\.[^/.]+$/, "");

    if (window.confirm("Are you sure you want to delete this photo?")) {
      deleteUserPhoto(userId, photoTitle, (res, status) => {
        if (status === 200) {
          alert("Photo deleted successfully!");
          loadAllPosts();
        } else {
          alert("Failed to delete photo.");
        }
      });
    }
  };

  const handleDeleteAlbum = (userId, albumName) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      deleteUserAlbum(userId, albumName, (res, status) => {
        if (status === 200) {
          alert("Album deleted successfully!");
          loadAllPosts();
        } else {
          alert("Failed to delete album.");
        }
      });
    }
  };

  return (
    <div className="admin-posts-page">
      <div className="admin-posts-container">
        {posts.length === 0 && <p>No posts found.</p>}
        {posts.map((post, idx) => (
            <div key={idx} className="admin-post-wrapper">
                {post.type === "album" ? (
                    <div className="admin-album">
                        <h3>{post.username} - {post.albumName}</h3>
                        <div className="admin-album-photos">
                            {post.photos.map((photoUrl, index) => (
                                <div key={index} className="admin-photo-wrapper">
                                    <img src={photoUrl} alt="album" />
                                </div>
                            ))}
                        </div>
                        <button
                            className="delete-album-btn"
                            onClick={() => handleDeleteAlbum(post.userId, post.albumName)}
                        >
                            Delete Album
                        </button>
                    </div>
                ) : (
                    <div className="admin-single-photo">
                      <h3>{post.username}</h3>
                      <div className="admin-photo-wrapper">
                          <img src={post.url} alt="single" />
                          <button
                              className="delete-photo-admin-btn"
                              onClick={() => handleDeletePhoto(post.userId, post.url)}
                          >
                              🗑️
                          </button>
                      </div>
                  </div>
                )}
            </div>
        ))}
    </div>
    </div>
  );
}
