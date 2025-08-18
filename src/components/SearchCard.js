import React from 'react';
import { Link } from 'react-router-dom';

// Helper function to format time display
const formatTime = (time) => {
  if (!time) return '';
  
  // If time already contains "minute" or "hour", return as is
  if (typeof time === 'string' && (time.includes('minute') || time.includes('hour') || time.includes('hr'))) {
    return time;
  }
  
  // If it's just a number, assume it's minutes
  const timeValue = parseInt(time);
  if (!isNaN(timeValue)) {
    return `${timeValue} minute${timeValue !== 1 ? 's' : ''}`;
  }
  
  // If it's a string that doesn't contain time units, assume minutes
  return `${time} minutes`;
};

function SearchCard({ recipe }) {
  // Fallback image or placeholder if imageURL is not available
  const imageUrl = recipe.imageURL || 'https://via.placeholder.com/96x96?text=No+Image';
  
  return (
    <Link to={`/recipe/${recipe._id}`} className="block">
      <div
        className="relative flex items-center gap-4 rounded-lg p-4 bg-white shadow-sm transition-transform hover:scale-105 hover:z-10 cursor-pointer"
      >
        <div className="flex-grow">
          <h3 className="text-xl font-bold">{recipe.title}</h3>
          <p className="text-gray-500">Recipe by: {recipe.userId}</p>
          <p className="text-gray-500">Time: {formatTime(recipe.time)}</p>
        </div>
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
          }}
        />
      </div>
    </Link>
  );
}

export default SearchCard;