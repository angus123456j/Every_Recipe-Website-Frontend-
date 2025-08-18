// src/components/AddRecipeCard.js

import React from 'react';

function AddRecipeCard() {
  return (
    <div className="flex items-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors transition-transform hover:scale-105 hover:z-10 cursor-pointer">
      <div className="flex-shrink-0 mr-4">
        <span className="text-4xl text-gray-400 font-light">+</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-500">Add a recipe:</h3>
      </div>
    </div>
  );
}

export default AddRecipeCard;