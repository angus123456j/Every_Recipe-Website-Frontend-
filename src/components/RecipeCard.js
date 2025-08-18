import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  // Fallback image or placeholder if imageURL is not available
  const imageUrl = recipe.imageURL || 'https://via.placeholder.com/320x320?text=No+Image';
  
  return (
    <Link to={`/recipe/${recipe._id}`} className="block">
      <div className="w-80 h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/320x320?text=No+Image';
          }}
        />
      </div>
    </Link>
  );
}

export default RecipeCard;
