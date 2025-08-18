import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './components/Header';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAlbums } from './context/AlbumsContext';

// Helper function to format time display
const formatTime = (time) => {
  if (!time) return '';
  
  if (typeof time === 'string' && (time.includes('minute') || time.includes('hour') || time.includes('hr'))) {
    return time;
  }
  
  const timeValue = parseInt(time);
  if (!isNaN(timeValue)) {
    return `${timeValue} minute${timeValue !== 1 ? 's' : ''}`;
  }
  
  return `${time} minutes`;
};

function AlbumDetailPage() {
  const { albumId } = useParams();
  const { getAlbumById, removeRecipeFromAlbum } = useAlbums();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlbum = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Loading album with ID:', albumId);
        const albumData = await getAlbumById(albumId);
        console.log('Loaded album data:', albumData);
        setAlbum(albumData);
      } catch (err) {
        console.error('Error loading album:', err);
        setError('Failed to load album');
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      loadAlbum();
    }
  }, [albumId, getAlbumById]);

  const handleRemoveRecipe = async (recipeId) => {
    if (window.confirm('Remove this recipe from the album?')) {
      try {
        await removeRecipeFromAlbum(albumId, recipeId);
        // Refresh the album data
        const updatedAlbum = await getAlbumById(albumId);
        setAlbum(updatedAlbum);
      } catch (err) {
        console.error('Error removing recipe:', err);
        alert('Failed to remove recipe from album');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading album...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600">404 - Album Not Found</h1>
          <p className="mt-4">The album you are looking for does not exist.</p>
          <Link 
            to="/albums" 
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  // Extract recipes from the album data
  // Filter out null/undefined recipe references (deleted recipes)
  const recipes = album.recipes 
    ? album.recipes
        .map(recipe => recipe.recipeId)
        .filter(recipe => recipe != null) // Remove null/undefined recipes
    : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/albums" className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Albums</span>
          </Link>
        </div>

        {/* Album Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: album.color }}>
              <span className="text-2xl font-bold text-gray-700">{album.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
              <p className="text-gray-600">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes
              .filter(recipe => recipe && recipe._id) // Filter out invalid recipes
              .map((recipe) => (
                <div key={recipe._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <Link to={`/recipe/${recipe._id}`} className="block">
                    <img
                      src={recipe.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={recipe.title || 'Recipe'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title || 'Untitled Recipe'}</h3>
                      <p className="text-sm text-gray-500">Recipe by: {recipe.userId || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Time: {formatTime(recipe.time)}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleRemoveRecipe(recipe._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Remove from album"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes in this album yet</h3>
            <p className="text-gray-600 mb-4">Start adding recipes to your "{album.name}" album</p>
            <Link
              to="/"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Browse Recipes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumDetailPage;
