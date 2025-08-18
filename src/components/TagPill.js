// src/components/TagPill.js

import React from 'react';

function TagPill({ tag, isSelected, onSelect }) {
  const selectedClass = isSelected 
    ? "bg-green-200 text-green-800" 
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <button
      type="button"
      // Change the onClick to a function that calls onSelect with just the tag
      onClick={() => onSelect(tag)}
      className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedClass}`}
    >
      {tag}
    </button>
  );
}

export default TagPill;