import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { uploadUserPhoto, uploadPhotoToAlbum } from "../../API/user-account";
import "./AddPhoto.css";

export default function AddPhotoPage() {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [albumPhotoTitle, setAlbumPhotoTitle] = useState("");
  const [albumFile, setAlbumFile] = useState(null);
  const [albumPreviewUrl, setAlbumPreviewUrl] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleAlbumFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setAlbumFile(selected);
      setAlbumPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUploadPhoto = () => {
    if (!file || !photoTitle.trim()) return alert("Completeaza toate campurile.");
    uploadUserPhoto(user.id, photoTitle, file, (res, status, err) => {
      if (status === 200) {
        alert("Poza adaugata!");
        history.push("/home-user");
      } else {
        alert("Eroare la upload.");
      }
    });
  };

  const handleUploadAlbumPhoto = () => {
    if (!albumName.trim() || !albumPhotoTitle.trim() || !albumFile) return alert("Completeaza toate campurile.");
    
    uploadPhotoToAlbum(user.id, albumName, albumPhotoTitle, albumFile, (res, status, err) => {
      if (status === 200) {
        alert("Poza adaugata in album!");
        history.push("/home-user");
      } else {
        alert("Eroare la upload.");
      }
    });
  };

  return (
    <div className="add-photo-page">
      <div className="add-photo-wrapper">
        
        <div className="add-photo-container">
          <h2>Adauga o poza noua</h2>
          <input
            type="text"
            placeholder="Titlu poza (ex: vacanta2024)"
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            className="photo-title-input"
          />
          <div className="drop-area">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <p>Trage o imagine aici sau selecteaza una manual</p>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button className="upload-btn" onClick={handleUploadPhoto}>
            Upload
          </button>
        </div>

        <div className="or-divider">SAU</div>

        <div className="add-album-container">
          <h2>Adauga o poza in album</h2>
          <input
            type="text"
            placeholder="Nume album (ex: vacanta2024)"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="album-title-input"
          />
          <input
            type="text"
            placeholder="Titlu poza in album (ex: poza1)"
            value={albumPhotoTitle}
            onChange={(e) => setAlbumPhotoTitle(e.target.value)}
            className="album-photo-title-input"
          />
          <div className="drop-area">
            {albumPreviewUrl ? (
              <img src={albumPreviewUrl} alt="Preview" className="preview-image" />
            ) : (
              <p>Trage o imagine aici sau selecteaza una manual</p>
            )}
            <input type="file" accept="image/*" onChange={handleAlbumFileChange} />
          </div>
          <button className="upload-btn" onClick={handleUploadAlbumPhoto}>
            Upload Album Photo
          </button>
        </div>

      </div>
    </div>
  );
}
