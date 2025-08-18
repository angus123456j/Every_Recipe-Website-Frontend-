import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MyRecipesPage from './myRecipesPage';
import AddRecipePage from './AddRecipePage';
import SearchResultsPage from './SearchResultsPage';
import RecipePage from './RecipePage';
import SavedRecipesPage from './SavedRecipesPage'; // New import
import SignUpPage from './SignUpPage'; // New import
import SignInPage from './SignInPage'; // New import
import AlbumsPage from './AlbumsPage'; // New import
import AlbumDetailPage from './AlbumDetailPage'; // New import
import { RecipeProvider } from './context/RecipeContext';
import { AlbumsProvider } from './context/AlbumsContext'; // New import
import { AuthProvider } from './context/AuthContext'; // New import
import ProtectedRoute from './components/ProtectedRoute'; // New import
import ProfilePage from './ProfilePage';
import UserPerksPage from './UserPerksPage';


function App() {
  return (
    <AuthProvider>
      <AlbumsProvider>
        <RecipeProvider>
          <BrowserRouter>
            <Routes>
                          <Route path="/" element={<HomePage />} />
            <Route path="/my-recipes" element={
              <ProtectedRoute>
                <MyRecipesPage />
              </ProtectedRoute>
            } />
            <Route path="/add-recipe" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/edit-recipe/:recipeId" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/perks" element={<UserPerksPage />} />
            <Route path="/saved-recipes" element={
              <ProtectedRoute>
                <SavedRecipesPage />
              </ProtectedRoute>
            } />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/albums" element={
              <ProtectedRoute>
                <AlbumsPage />
              </ProtectedRoute>
            } />
            <Route path="/album/:albumId" element={
              <ProtectedRoute>
                <AlbumDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            </Routes>
          </BrowserRouter>
        </RecipeProvider>
      </AlbumsProvider>
    </AuthProvider>
  );
}

export default App;