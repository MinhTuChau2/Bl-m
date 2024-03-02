import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Redirect to the profile page with the search query
    if (searchQuery.trim() !== "") {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      navigate(`/profile/${encodedQuery}`);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
