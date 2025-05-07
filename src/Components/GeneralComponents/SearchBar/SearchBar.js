import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {searchUserByUsername} from '../../API/user-account';
import "./SearchBar.css";

export default function SearchBar() {
  const [term, setTerm] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (term.trim() === "") {
      setUser(null);
      setShowDropdown(false);
      return;
    }
  
    const delayDebounce = setTimeout(() => {
      searchUserByUsername(term.trim(), (result, status, error) => {
        if (status === 200) {
          console.log("Fetched user data:", result);
          setUser(result);
        } else {
          console.warn("User not found");
          setUser(null);
        }
        setShowDropdown(true);
      });
    }, 300);
  
    return () => clearTimeout(delayDebounce);
  }, [term]);

  const handleSelect = (userId) => {
    console.log("Selected user ID for redirect:", userId);
    if (!userId) {
      console.warn("User ID is missing. Cannot redirect.");
      return;
    }
  
    history.push(`/view-profile/${userId}`);
    setTerm("");
    setShowDropdown(false);
  };  

  return (
    <div className="searchbar-container">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        placeholder="Search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="search-input"
      />
      {showDropdown && (
        <ul className="search-dropdown">
          {user ? (
            <li onClick={() => handleSelect(user.id)}>
              {user.username} ({user.lastName} {user.firstName})
            </li>          
          ) : (
            <li className="no-results">No users found</li>
          )}
        </ul>
      )}
    </div>
  );
}
