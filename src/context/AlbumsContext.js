import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  createAlbum as createAlbumAPI, 
  getUserAlbums, 
  getAlbumById as getAlbumByIdAPI, 
  updateAlbum as updateAlbumAPI, 
  deleteAlbum as deleteAlbumAPI, 
  addRecipeToAlbum as addRecipeToAlbumAPI, 
  removeRecipeFromAlbum as removeRecipeFromAlbumAPI,
  checkRecipeSaved as checkRecipeSavedAPI
} from '../api/albumAPI';

const AlbumsContext = createContext();

export const useAlbums = () => {
  const context = useContext(AlbumsContext);
  if (!context) {
    throw new Error('useAlbums must be used within an AlbumsProvider');
  }
  return context;
};

export const AlbumsProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use authenticated user's id/username
  const { user } = useAuth();
  const userId = user?.username;

  // Load user's albums when auth user becomes available
  useEffect(() => {
    if (userId) {
      loadUserAlbums();
    } else {
      // If not logged in, ensure clean state without errors
      setAlbums([]);
      setError(null);
    }
  }, [userId]);

  const loadUserAlbums = async () => {
    if (!userId) return; // no-op when not authenticated
    setLoading(true);
    setError(null);
    try {
      console.log('Loading albums for userId:', userId);
      const userAlbums = await getUserAlbums(userId);
      console.log('Loaded albums:', userAlbums);
      setAlbums(userAlbums);
    } catch (err) {
      console.error('Error loading albums:', err);
      // Avoid noisy error banners on initial load; keep silent
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async (name, color = '#3B82F6') => {
    setError(null);
    try {
      // Don't send userId - backend gets it from session
      const newAlbum = await createAlbumAPI({ name, color });
      setAlbums(prev => [...prev, newAlbum]);
      return newAlbum;
    } catch (err) {
      console.error('Error creating album:', err);
      setError('Failed to create album');
      throw err;
    }
  };

  const deleteAlbum = async (albumId) => {
    setError(null);
    try {
      await deleteAlbumAPI(albumId);
      setAlbums(prev => prev.filter(album => album._id !== albumId));
    } catch (err) {
      console.error('Error deleting album:', err);
      setError('Failed to delete album');
      throw err;
    }
  };

  const addRecipeToAlbum = async (albumId, recipeData) => {
    setError(null);
    try {
      const updatedAlbum = await addRecipeToAlbumAPI(albumId, recipeData._id);
      
      // Update the albums state with the new data
      setAlbums(prev => prev.map(album => 
        album._id === albumId ? updatedAlbum : album
      ));
      
      return updatedAlbum;
    } catch (err) {
      console.error('Error adding recipe to album:', err);
      
      // Check if it's a duplicate recipe error
      if (err.message && (err.message.includes('already exists') || err.message.includes('Recipe already exists'))) {
        // Don't show error for duplicates, just return success
        console.log('Recipe already exists in album - this is expected behavior');
        return { success: true, message: 'Recipe already saved to this album' };
      }
      
      setError('Failed to add recipe to album');
      throw err;
    }
  };

  const removeRecipeFromAlbum = async (albumId, recipeId) => {
    setError(null);
    try {
      const updatedAlbum = await removeRecipeFromAlbumAPI(albumId, recipeId);
      
      // Update the albums state with the new data
      setAlbums(prev => prev.map(album => 
        album._id === albumId ? updatedAlbum : album
      ));
      
      return updatedAlbum;
    } catch (err) {
      console.error('Error removing recipe from album:', err);
      setError('Failed to remove recipe from album');
      throw err;
    }
  };

  const getAlbumById = async (albumId) => {
    try {
      const album = await getAlbumByIdAPI(albumId);
      return album;
    } catch (err) {
      console.error('Error fetching album:', err);
      throw err;
    }
  };

  const getAlbumRecipes = (albumId) => {
    const album = albums.find(a => a._id === albumId);
    return album ? album.recipes.map(recipe => recipe.recipeId) : [];
  };

  const isRecipeSaved = (recipeId) => {
    return albums.some(album => 
      album.recipes.some(recipe => {
        // Handle both populated and unpopulated recipe data
        if (recipe.recipeId && typeof recipe.recipeId === 'object' && recipe.recipeId._id) {
          return recipe.recipeId._id === recipeId;
        }
        return recipe.recipeId === recipeId;
      })
    );
  };

  const checkRecipeSavedStatus = async (recipeId) => {
    try {
      if (!userId) return false;
      const { isSaved } = await checkRecipeSavedAPI(userId, recipeId);
      return isSaved;
    } catch (err) {
      console.error('Error checking recipe saved status:', err);
      return false;
    }
  };

  const value = {
    albums,
    loading,
    error,
    createAlbum,
    deleteAlbum,
    addRecipeToAlbum,
    removeRecipeFromAlbum,
    getAlbumById,
    getAlbumRecipes,
    isRecipeSaved,
    checkRecipeSavedStatus,
    loadUserAlbums
  };

  return (
    <AlbumsContext.Provider value={value}>
      {children}
    </AlbumsContext.Provider>
  );
};
