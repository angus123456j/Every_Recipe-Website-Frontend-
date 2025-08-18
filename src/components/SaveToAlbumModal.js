import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAlbums } from '../context/AlbumsContext';

function SaveToAlbumModal({ isOpen, onClose, recipeId, recipeTitle, recipeData }) {
  const { albums, createAlbum, addRecipeToAlbum, loading, error } = useAlbums();
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

  const handleSaveToAlbum = async (albumId) => {
    try {
      console.log(`Saving recipe ${recipeId} to album ${albumId}`);
      console.log('Recipe data:', recipeData);
      
      const result = await addRecipeToAlbum(albumId, recipeData);
      
      // Check if it was a duplicate (handled gracefully)
      if (result && result.message && result.message.includes('already saved')) {
        alert(`"${recipeTitle}" is already saved to this album!`);
      } else {
        // Show success message
        alert(`"${recipeTitle}" saved to album!`);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving to album:', error);
      alert('Failed to save recipe to album');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (newAlbumName.trim()) {
      try {
        const newAlbum = await createAlbum(newAlbumName.trim(), colorMap[selectedColor]);
        setNewAlbumName('');
        setShowCreateForm(false);
        
        // Automatically save the recipe to the newly created album
        await handleSaveToAlbum(newAlbum._id);
      } catch (error) {
        console.error('Error creating album:', error);
        alert('Failed to create album');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Save to Album</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Choose an album to save "{recipeTitle}" to:
          </p>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Albums List */}
          {albums.length > 0 ? (
            <div className="space-y-2 mb-4">
              {albums.map((album) => (
                <button
                  key={album._id}
                  onClick={() => handleSaveToAlbum(album._id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
                  disabled={loading}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: album.color }}>
                    <span className="text-sm font-bold text-gray-700">{album.name.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-gray-900">{album.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 mb-4">
              <p className="text-gray-500 mb-4">You don't have any albums yet</p>
            </div>
          )}

          {/* Create New Album Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors duration-200"
            disabled={loading}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create New Album</span>
          </button>
        </div>

        {/* Create Album Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Create New Album</h3>
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
                    Create & Save
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
      </div>
    </div>
  );
}

export default SaveToAlbumModal;
