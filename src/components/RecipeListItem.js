// src/components/RecipeListItem.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { deleteRecipe } from '../api/recipeAPI';

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

function RecipeListItem({ recipe, onRecipeDeleted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fallback image or placeholder if imageURL is not available
  const imageUrl = recipe.imageURL || 'https://via.placeholder.com/80x80?text=No+Image';

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRecipe(recipe._id);
      // Call the callback to refresh the recipe list
      if (onRecipeDeleted) {
        onRecipeDeleted(recipe._id);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm transition-transform hover:scale-105 hover:z-10">
      <Link to={`/recipe/${recipe._id}`} className="flex items-center flex-grow">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
          }}
        />
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <p className="text-sm text-gray-500">Recipe by: {recipe.userId}</p>
          <p className="text-sm text-gray-500">Time: {formatTime(recipe.time)}</p>
        </div>
      </Link>
      
      {/* Edit and Delete buttons - only show for recipe owner */}
      {user && recipe.userId === user.username && (
        <div className="flex gap-2 ml-4">
          <Link
            to={`/edit-recipe/${recipe._id}`}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <PencilIcon className="h-5 w-5 text-blue-600" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className={`h-5 w-5 text-red-600 ${isDeleting ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeListItem;