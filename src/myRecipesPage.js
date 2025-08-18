import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // New import
import Header from './components/Header';
import AddRecipeCard from './components/AddRecipeCard';
import RecipeListItem from './components/RecipeListItem';
import { useAuth } from './context/AuthContext';

// Remove hard-coded image imports since images will come from backend
import { getRecipesByUserId } from './api/recipeAPI';

// Remove hard-coded sampleRecipes array - will use data from backend

function MyRecipesPage() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const handleRecipeDeleted = (deletedRecipeId) => {
    setMyRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== deletedRecipeId));
  };

  useEffect(() => {
    const fetchMyRecipes = async () => {
      if (!user?.username) return;
      try {
        const recipes = await getRecipesByUserId(user.username);
        setMyRecipes(recipes);
      } catch (err) {
        console.error('Error fetching my recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    // Reset when auth state changes
    setMyRecipes([]);
    setLoading(true);
    fetchMyRecipes();
  }, [user?.username]);

  if (authLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Recipes I uploaded</h1>
        <p className="mt-1 text-gray-500">My community contributions:</p>
        
        <div className="mt-8 space-y-4">
          <Link to="/add-recipe">
            <AddRecipeCard />
          </Link>
          {myRecipes.length > 0 ? (
            myRecipes.map(recipe => (
              <RecipeListItem key={recipe._id} recipe={recipe} onRecipeDeleted={handleRecipeDeleted} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recipes uploaded yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyRecipesPage;