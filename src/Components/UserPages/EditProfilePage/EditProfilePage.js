import React, { useState, useEffect } from "react";
import "./EditProfilePage.css";
import { updateUser } from "../../API/user-account";

export default function EditProfilePage() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFormData(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData) return;

    updateUser(formData, (result, status, error) => {
      if (status === 200) {
        localStorage.setItem("user", JSON.stringify(result));
        alert("Profile updated successfully!");
        window.history.back();
      } else {
        alert("Error while updating profile.");
        console.error(error);
      }
    });
  };


  if (!formData) return null;

  return (
    <div className="edit-profile-page">
      <div className="edit-logo" />
      <div className="edit-profile-container">
        <div className="close-button" onClick={() => window.history.back()}>×</div>

        <div className="edit-profile-header">
          <div className="profile-avatar" />
          <div className="profile-info">
            <div className="name">{`${formData.firstName} ${formData.lastName}`}</div>
            <div className="email">{formData.email}</div>
          </div>
        </div>

        <div className="edit-profile-divider" />

        <div className="edit-profile-section">
          <div className="edit-profile-row">
            <label className="edit-profile-label">First Name</label>
            <input
              className="edit-profile-input clean"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>
          <div className="edit-profile-divider light" />

          <div className="edit-profile-row">
            <label className="edit-profile-label">Last Name</label>
            <input
              className="edit-profile-input clean"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
          <div className="edit-profile-divider light" />

          <div className="edit-profile-row">
            <label className="edit-profile-label">Username</label>
            <input
              className="edit-profile-input clean"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>
          <div className="edit-profile-divider light" />

          <div className="edit-profile-row">
            <label className="edit-profile-label">Email account</label>
            <input
              className="edit-profile-input clean"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@gmail.com"
            />
          </div>
          <div className="edit-profile-divider light" />

          <div className="edit-profile-row">
            <label className="edit-profile-label">Description</label>
            <input
              className="edit-profile-input clean"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Something about yourself..."
            />
          </div>
        </div>

        <div className="edit-profile-actions">
          <button className="save-button" onClick={handleSave}>Save Change</button>
        </div>
      </div>
    </div>
  );
}

