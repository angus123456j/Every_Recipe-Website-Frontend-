import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlbums } from './context/AlbumsContext';
import Header from './components/Header';
import { PlusIcon, FolderIcon, TrashIcon } from '@heroicons/react/24/outline';

function AlbumsPage() {
  const { albums, createAlbum, deleteAlbum, loading, error, loadUserAlbums } = useAlbums();
  
  // Helper function to get valid recipe count
  const getValidRecipeCount = (album) => {
    if (!album.recipes) return 0;
    return album.recipes.filter(recipe => recipe.recipeId != null).length;
  };

  // Refresh albums when navigating back to this page to get clean data
  useEffect(() => {
    // Only refresh if we have cached albums that might be stale
    const hasStaleData = albums.some(album => 
      album.recipes && album.recipes.some(recipe => recipe.recipeId == null)
    );
    if (hasStaleData) {
      loadUserAlbums();
    }
  }, []); // Only run once on mount
  
  // Debug logging
  console.log('AlbumsPage - albums:', albums);
  console.log('AlbumsPage - loading:', loading);
  console.log('AlbumsPage - error:', error);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-yellow-100');

  const colors = [
    'bg-yellow-100', 'bg-orange-100', 'bg-red-100', 'bg-pink-100',
    'bg-purple-100', 'bg-blue-100', 'bg-green-100', 'bg-teal-100',
    'bg-cyan-100', 'bg-indigo-100', 'bg-gray-100'
  ];

  // Map CSS color classes to hex colors
  const colorMap = {
    'bg-yellow-100': '#FEF3C7',
    'bg-orange-100': '#FFEDD5',
    'bg-red-100': '#FEE2E2',
    'bg-pink-100': '#FCE7F3',
    'bg-purple-100': '#F3E8FF',
    'bg-blue-100': '#DBEAFE',
    'bg-green-100': '#DCFCE7',
    'bg-teal-100': '#CCFBF1',
    'bg-cyan-100': '#CFFAFE',
    'bg-indigo-100': '#E0E7FF',
    'bg-gray-100': '#F3F4F6'
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (newAlbumName.trim()) {
      try {
        await createAlbum(newAlbumName.trim(), colorMap[selectedColor]);
        setNewAlbumName('');
        setShowCreateForm(false);
      } catch (err) {
        console.error('Failed to create album:', err);
        // Error is already handled in the context
      }
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm('Are you sure you want to delete this album? All recipes in it will be removed.')) {
      try {
        await deleteAlbum(albumId);
      } catch (err) {
        console.error('Failed to delete album:', err);
        // Error is already handled in the context
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Recipe Albums</h1>
            <p className="text-gray-600 mt-2">Organize your favorite recipes into custom collections</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Album</span>
          </button>
        </div>

        {/* Error Display (hidden on initial load/noise suppressed) */}
        {error && albums.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
            Loading albums...
          </div>
        )}

        {/* Create Album Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Create New Album</h2>
              <form onSubmit={handleCreateAlbum}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Album Name
                  </label>
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Morning, Snacks, Dinner..."
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Album Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${color} border-2 ${
                          selectedColor === color ? 'border-green-500' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    Create Album
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Link to={`/album/${album._id}`} className="block p-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: album.color }}>
                  <FolderIcon className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{album.name}</h3>
                <p className="text-gray-600">{getValidRecipeCount(album)} recipe{getValidRecipeCount(album) !== 1 ? 's' : ''}</p>
              </Link>
              <div className="px-6 pb-4">
                <button
                  onClick={() => handleDeleteAlbum(album._id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {albums.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums yet</h3>
            <p className="text-gray-600 mb-4">Create your first album to start organizing your recipes</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Create Your First Album
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumsPage;
