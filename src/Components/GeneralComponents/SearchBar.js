import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
  const [term, setTerm] = useState("");
  const history = useHistory();

  const handleSearch = (e) => {
    if (e.key === "Enter" && term.trim() !== "") {
      history.push(`/search/${term.trim()}`);
      setTerm("");
    }
  };

  return (
    <div className="searchbar-container">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        placeholder="Search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleSearch}
        className="search-input"
      />
    </div>
  );
}
