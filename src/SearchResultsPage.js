// src/SearchResultsPage.js

import React, {useContext} from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import SearchCard from './components/SearchCard';

// Remove hard-coded image imports since images will come from backend
import {RecipeContext} from './context/RecipeContext';

// Remove hard-coded sampleSearchResults array - will use data from backend

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const {filteredRecipes} = useContext(RecipeContext);
  console.log(filteredRecipes);

  // Use filteredRecipes if available, otherwise show message
  const recipesToShow = filteredRecipes && filteredRecipes.length > 0 ? filteredRecipes : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="mt-2 text-gray-500">Search Result: {searchQuery}</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {recipesToShow.length > 0 ? (
            recipesToShow.map(recipe => (
              <SearchCard key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center py-8">No recipes found matching your search criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;