import React, { useState } from 'react';
import SearchModal from './SearchModal';

export default function Search() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Open the modal when the search box is clicked
  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="search-box" onClick={openModal}>
        <span className="search-icon" role="img" aria-label="Search">🔍</span>
        <input
          type="text"
          placeholder="Search docs..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={openModal} // Open modal when focused
        />
        <span className="shortcut-key">⌘K</span>
      </div>
      {isModalOpen && (
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          searchQuery={searchQuery} // Pass the search query to the modal
        />
      )}
      <style jsx>{`
        .search-box {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          position: fixed;
          right: 20px;
          top: 20px; /* Adjust this as per your layout */
        }
        .search-icon {
          margin-right: 8px; /* Increased margin for more space */
        }
        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          flex-grow: 1;
          cursor: text; /* Change cursor to text to indicate typing */
        }
        .shortcut-key {
          margin-left: 8px; /* Increased margin for more space */
          background: #e0e0e0;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
