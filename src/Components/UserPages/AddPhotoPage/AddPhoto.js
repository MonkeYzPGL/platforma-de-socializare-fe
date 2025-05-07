import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { uploadUserPhoto } from "../../API/user-account";
import "./AddPhoto.css";

export default function AddPhotoPage() {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoTitle, setPhotoTitle] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = () => {
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

  return (
    <div className="add-photo-page">
        <div className="add-photo-container">
            <h2>Adauga o poza noua</h2>
            <input
                type="text"
                placeholder="Titlu poza (ex: vacanta2024)"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                className="photo-title-input"
            />
            <div
                className="drop-area"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-image" />
                ) : (
                <p>Trage o imagine aici sau selecteaza una manual</p>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <button className="upload-btn" onClick={handleUpload}>
                Upload
            </button>
        </div>
    </div>
  );
}
