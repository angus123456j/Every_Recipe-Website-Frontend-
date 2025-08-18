import React, { useState, useEffect} from 'react';
import { getRecipeById, deleteRecipe } from './api/recipeAPI';

import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// Remove hard-coded image imports since images will come from backend
import TagPill from './components/TagPill';
import SaveToAlbumModal from './components/SaveToAlbumModal';
import { useAlbums } from './context/AlbumsContext';
import { useAuth } from './context/AuthContext';

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

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isRecipeSaved } = useAlbums();
  const { user } = useAuth();

  const toggleSave = () => {
    setShowSaveModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRecipe(recipe._id);
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
  };

  useEffect(() => {
    const fetchRecipe = async() => {
      try{
        const data = await getRecipeById(id);
        setRecipe(data);
        setLoading(false);
      }catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchRecipe();
  },[id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600">404 - Recipe Not Found</h1>
          <p className="mt-4">The recipe you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          {/* Main Content */}
          <div>
            {/* Image floated to the right */}
            <div className="float-right ml-8 mb-8 w-1/2">
              <div className="aspect-w-16 aspect-h-15 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={recipe.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-gray-600 font-semibold">{recipe.userId} | {formatTime(recipe.time)}</p>
              
              {/* Save button - only show for authenticated users */}
              {user && (
                <button
                  onClick={toggleSave}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
                >
                  {isRecipeSaved(recipe._id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutlineIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
                  )}
                  <span className="font-semibold text-gray-700">Save</span>
                </button>
              )}
              
              {/* Edit and Delete buttons - only show for recipe owner */}
              {user && recipe.userId === user.username && (
                <div className="flex gap-2">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors focus:outline-none"
                  >
                    <PencilIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-700">Edit</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className={`h-5 w-5 text-red-600 ${isDeleting ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold text-red-700">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
            
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 -mt-3 mb-6">
                {recipe.tags.map(tag => (
                  <TagPill key={tag} tag={tag} isSelected={true} onSelect={() => {}} />
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <p className="text-gray-700 mb-6">{recipe.description}</p>

            <h2 className="text-2xl font-bold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside mb-6">
              {recipe.ingredients && recipe.ingredients.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-2">Steps</h2>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.steps && recipe.steps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
            
            {/* Clear the float */}
            <div className="clear-both"></div>
          </div>
        </div>
      </div>

      {/* Save to Album Modal */}
      <SaveToAlbumModal
        isOpen={showSaveModal}
        onClose={handleCloseSaveModal}
        recipeId={recipe._id}
        recipeTitle={recipe.title}
        recipeData={recipe}
      />
    </div>
  );
}

export default RecipePage;