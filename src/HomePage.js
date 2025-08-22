import React, { useState, useEffect, useContext, useRef} from 'react';
import { useNavigate } from 'react-router-dom'; // New import
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import logo from './assets/logo.png';
import search from './assets/search.png';
import './HomePage.css';
import { allTags } from './tagsDta';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


import TagPill from './components/TagPill'; // Import TagPill

// Remove hard-coded image imports since images will come from backend
import { getAllRecipes, searchRecipes } from './api/recipeAPI';
import { RecipeContext } from './context/RecipeContext';

// Remove hard-coded sampleRecipes array - will use data from backend

// Time filter options
const timeRanges = [
  { label: 'Quick (0-15 min)', min: 0, max: 15 },
  { label: 'Fast (15-30 min)', min: 15, max: 30 },
  { label: 'Medium (30-60 min)', min: 30, max: 60 },
  { label: 'Long (60+ min)', min: 60, max: null }
];

function HomePage() {
 const { recipes, setFilteredRecipes } = useContext(RecipeContext)
 const [searchQuery, setSearchQuery] = useState(''); // New state for search query
 const navigate = useNavigate(); // Hook for programmatic navigation
 const [isSearchFocused, setIsSearchFocused] = useState(false);

 const [selectedTags, setSelectedTags] = useState([]);
 const [selectedTimeRange, setSelectedTimeRange] = useState(null);
 // Create a ref to hold a reference to the search container
const searchRef = useRef(null);

// Refs for scroll containers
const scrollRef1 = useRef(null);
const scrollRef2 = useRef(null);

// State for speed boost animation
const [isSpeedBoost1, setIsSpeedBoost1] = useState(false);
const [isSpeedBoost2, setIsSpeedBoost2] = useState(false);

// Animation state for JavaScript-controlled scrolling
const animationState = useRef({
  row1: { position: 0, speed: 0.3, direction: -1, animationId: null, timeouts: [] },
  row2: { position: 0, speed: 0.3, direction: 1, animationId: null, initialized: false, timeouts: [] }
});

// JavaScript animation function
const animateRow = (rowKey, scrollContent) => {
  const state = animationState.current[rowKey];
  
  // Initialize row2 position to start from the left edge when moving right
  if (rowKey === 'row2' && !state.initialized) {
    const contentWidth = scrollContent.scrollWidth / 2;
    state.position = -contentWidth;
    state.initialized = true;
  }
  
  const animate = () => {
    // Update position based on speed and direction
    state.position += state.speed * state.direction * 0.7;
    
    // Reset position when it goes too far (infinite loop)
    const contentWidth = scrollContent.scrollWidth / 2; // Half because we have duplicated content
    if (state.direction < 0) {
      // Moving left - reset when too far left
      if (state.position <= -contentWidth) {
        state.position = 0;
      }
    } else {
      // Moving right - reset when too far right
      if (state.position >= 0) {
        state.position = -contentWidth;
      }
    }
    
    // Apply transform
    scrollContent.style.transform = `translateX(${state.position}px)`;
    
    // Continue animation
    state.animationId = requestAnimationFrame(animate);
  };
  
  animate();
};

// Initialize animations when component mounts
useEffect(() => {
  if (recipes && recipes.length > 0) {
    // Start row 1 animation (left direction)
    const scrollContent1 = scrollRef1.current?.querySelector('.scroll-content');
    if (scrollContent1) {
      // Disable CSS animation
      scrollContent1.style.animation = 'none';
      animateRow('row1', scrollContent1);
    }
    
    // Start row 2 animation (right direction)
    const scrollContent2 = scrollRef2.current?.querySelector('.scroll-content');
    if (scrollContent2) {
      // Disable CSS animation
      scrollContent2.style.animation = 'none';
      animateRow('row2', scrollContent2);
    }
    
    // Cleanup function
    return () => {
      if (animationState.current.row1.animationId) {
        cancelAnimationFrame(animationState.current.row1.animationId);
      }
      if (animationState.current.row2.animationId) {
        cancelAnimationFrame(animationState.current.row2.animationId);
      }
    };
  }
}, [recipes]);

 

 useEffect(() => {
    function handleClickOutside(event) {
      // If the user clicks outside the search container, set focus to false
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    
    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

 const handleTagClick = (tag) => {
  // Prevent the default form submission behavior
  //e.preventDefault();
  // Stop the event from bubbling up to the parent form
  //e.stopPropagation();

  // Check if the tag is already in the array
  if (selectedTags.includes(tag)) {
    // If it is, remove it (un-select)
    setSelectedTags(selectedTags.filter(t => t !== tag));
  } else {
    // If it's not, add it (select)
    setSelectedTags([...selectedTags, tag]);
  }
};

const handleTimeRangeClick = (timeRange) => {
  if (selectedTimeRange && selectedTimeRange.min === timeRange.min && selectedTimeRange.max === timeRange.max) {
    setSelectedTimeRange(null); // Deselect if same range is clicked
  } else {
    setSelectedTimeRange(timeRange); // Select new range
  }
};

const handleSearch = async (e) => {
  e.preventDefault();
  console.log('Search form submitted!'); // Debug log

  const lowercasedSearchQuery = searchQuery.toLowerCase();
  const hasSearchQuery = lowercasedSearchQuery.trim() !== '';
  const hasSelectedTags = selectedTags.length > 0;
  const hasSelectedTimeRange = selectedTimeRange !== null;

  console.log('Search params:', { hasSearchQuery, hasSelectedTags, hasSelectedTimeRange }); // Debug log

  // Determine if we should use the search API or frontend filtering
  const shouldUseSearchAPI = hasSearchQuery || hasSelectedTags || hasSelectedTimeRange;

  if (shouldUseSearchAPI) {
    try {
      // Prepare search parameters for API
      const searchParams = {};
      
      if (hasSearchQuery) {
        searchParams.query = searchQuery;
      }
      
      if (hasSelectedTags) {
        searchParams.tags = selectedTags;
      }
      
      // Determine time range
      if (hasSelectedTimeRange) {
        searchParams.timeRange = {
          min: selectedTimeRange.min,
          max: selectedTimeRange.max
        };
      }
      
      // Call the search API
      const searchResults = await searchRecipes(searchParams);
      setFilteredRecipes(searchResults);
      
      // Navigate to search results
      navigate(`/search-results?q=${searchQuery}`);
      
    } catch (error) {
      console.error('Search API error:', error);
      // Fallback to frontend filtering if API fails
      performFrontendFiltering();
    }
  } else {
    // No filters, show all recipes
    setFilteredRecipes(recipes);
  }
};

const performFrontendFiltering = () => {
  const lowercasedSearchQuery = searchQuery.toLowerCase();
  const hasSearchQuery = lowercasedSearchQuery.trim() !== '';
  const hasSelectedTags = selectedTags.length > 0;
  const hasSelectedTimeRange = selectedTimeRange !== null;

  let filtered = [];

  // Helper function to check if recipe matches time range
  const matchesTimeRange = (recipe) => {
    if (!selectedTimeRange) return true;
    
    const recipeTime = parseInt(recipe.time);
    if (isNaN(recipeTime)) return false;
    
    if (selectedTimeRange.max === null) {
      return recipeTime >= selectedTimeRange.min;
    } else {
      return recipeTime >= selectedTimeRange.min && recipeTime < selectedTimeRange.max;
    }
  };

  // Scenario 1: Filter by name, tags, AND time
  if (hasSearchQuery && hasSelectedTags && hasSelectedTimeRange) {
    filtered = recipes.filter(recipe => {
      const searchMatches = recipe.title.toLowerCase().includes(lowercasedSearchQuery) ||
                            (Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchQuery)));
      const tagsMatch = Array.isArray(recipe.tags) && selectedTags.every(selectedTag => recipe.tags.includes(selectedTag));
      const timeMatches = matchesTimeRange(recipe);
      return searchMatches && tagsMatch && timeMatches;
    });
  }
  // Scenario 2: Filter by name AND tags
  else if (hasSearchQuery && hasSelectedTags) {
    filtered = recipes.filter(recipe => {
      const searchMatches = recipe.title.toLowerCase().includes(lowercasedSearchQuery) ||
                            (Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchQuery)));
      const tagsMatch = Array.isArray(recipe.tags) && selectedTags.every(selectedTag => recipe.tags.includes(selectedTag));
      return searchMatches && tagsMatch;
    });
  }
  // Scenario 3: Filter by name AND time
  else if (hasSearchQuery && hasSelectedTimeRange) {
    filtered = recipes.filter(recipe => {
      const searchMatches = recipe.title.toLowerCase().includes(lowercasedSearchQuery) ||
                            (Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchQuery)));
      const timeMatches = matchesTimeRange(recipe);
      return searchMatches && timeMatches;
    });
  }
  // Scenario 4: Filter by tags AND time
  else if (hasSelectedTags && hasSelectedTimeRange) {
    filtered = recipes.filter(recipe => {
      const tagsMatch = Array.isArray(recipe.tags) && selectedTags.every(selectedTag => recipe.tags.includes(selectedTag));
      const timeMatches = matchesTimeRange(recipe);
      return tagsMatch && timeMatches;
    });
  }
  // Scenario 5: Filter by NAME ONLY
  else if (hasSearchQuery) {
    filtered = recipes.filter(recipe => {
      return recipe.title.toLowerCase().includes(lowercasedSearchQuery) ||
             (Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchQuery)));
    });
  }
  // Scenario 6: Filter by TAGS ONLY
  else if (hasSelectedTags) {
    filtered = recipes.filter(recipe => {
      return Array.isArray(recipe.tags) && selectedTags.every(selectedTag => recipe.tags.includes(selectedTag));
    });
  }
  // Scenario 7: Filter by TIME ONLY
  else if (hasSelectedTimeRange) {
    filtered = recipes.filter(recipe => {
      return matchesTimeRange(recipe);
    });
  }
  // Scenario 8: No filters, show all recipes
  else {
    filtered = recipes;
  }

  setFilteredRecipes(filtered);
  
  if (hasSearchQuery || hasSelectedTags || hasSelectedTimeRange) {
    navigate(`/search-results?q=${searchQuery}`);
  }
};

// Smooth JavaScript speed/direction control with spam protection
const controlAnimation = (scrollRef, direction, setIsSpeedBoost) => {
  const isTopRow = scrollRef === scrollRef1;
  const rowKey = isTopRow ? 'row1' : 'row2';
  const state = animationState.current[rowKey];
  
  // Prevent spam clicking - ignore if already in progress
  if (state.timeouts.length > 0) {
    return;
  }
  
  // Clear any existing timeouts to prevent conflicts
  state.timeouts.forEach(timeout => clearTimeout(timeout));
  state.timeouts = [];
  
  setIsSpeedBoost(true);
  
  if (direction === 'right') {
    // Speed up in natural direction - much faster
    state.speed = 7;
    
    // Gradually return to normal speed
    const timeout1 = setTimeout(() => {
      state.speed = 5;
    }, 800);
    
    const timeout2 = setTimeout(() => {
      state.speed = 0.3;
      setIsSpeedBoost(false);
      // Clear timeouts array when animation is complete
      state.timeouts = [];
    }, 1600);
    
    state.timeouts = [timeout1, timeout2];
  } else {
    // Temporarily reverse direction at faster speed
    const originalDirection = state.direction;
    state.direction = -originalDirection;
    state.speed = 4;
    
    // Return to original direction and speed
    const timeout1 = setTimeout(() => {
      state.direction = originalDirection;
      state.speed = 0.3;
    }, 1200);
    
    const timeout2 = setTimeout(() => {
      state.speed = 0.3;
      setIsSpeedBoost(false);
      // Clear timeouts array when animation is complete
      state.timeouts = [];
    }, 2000);
    
    state.timeouts = [timeout1, timeout2];
  }
};

const speedUpLeft = (scrollRef, setIsSpeedBoost) => {
  controlAnimation(scrollRef, 'left', setIsSpeedBoost);
};

const speedUpRight = (scrollRef, setIsSpeedBoost) => {
  controlAnimation(scrollRef, 'right', setIsSpeedBoost);
};



 

return (
  <div className="bg-gray-50 min-h-screen">
    {/* Header at the top */}
    <Header />

    <main className="p-0">
      {/* Container for logo and search bar */}
      <div className="container mx-auto p-8 text-center">
        <div className="mt-12 mb-10">
          {/* Logo + Search bar with animation */}
          <div className={`search-animation-container ${isSearchFocused ? 'focused' : ''}`}
            ref={searchRef}>
            {/* Logo Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 logo-section mb-5">
              <img src={logo} alt="Every Recipe Logo" className="h-10 sm:h-12" />
              <h2 className="text-3xl sm:text-5xl font-extrabold text-green-700">Every_Recipe</h2>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="relative search-form"
            >
              <input
                type="text"
                placeholder="Search up recipes"
                className="w-full pl-10 pr-3 py-2 sm:pl-12 sm:pr-4 sm:py-3 border border-gray-300 rounded-full
                  focus:outline-none focus:border-green-500
                  hover:outline outline-1 outline-green-500 hover:outline-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />

             {/* Place the filter section HERE, inside the form */}
              {isSearchFocused && (
                <div className="filter-tags-section">
                  {/* Time Filter Section */}
                  <div className="mb-6">
                    <p className="filter-tags-title">Filter by time</p>
                    <div className="filter-tags-line mb-3"></div>
                    <div className="flex flex-wrap gap-2">
                      {timeRanges.map((timeRange) => (
                        <button
                          key={timeRange.label}
                          type="button"
                          onClick={() => handleTimeRangeClick(timeRange)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            selectedTimeRange && 
                            selectedTimeRange.min === timeRange.min && 
                            selectedTimeRange.max === timeRange.max
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {timeRange.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter Section */}
                  <div>
                    <p className="filter-tags-title">Filter by tags</p>
                    <div className="filter-tags-line"></div>
                    
                    {/* --- Correct placement: the tags are now inside this div --- */}
                    {Object.entries(allTags).map(([category, tags]) => (
                      <div key={category} className="tags-category">
                        <h4 className="tags-category-title">{category}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map(tag => (
                         

                          <TagPill
                            key={tag}
                            tag={tag}
                            // Pass a new function that handles the event and then calls the main handler
                            onSelect={handleTagClick}
                            isSelected={selectedTags.includes(tag)}
                          />
                            
                          ))}


                        </div>
                      </div>
                    ))}
                    {/* --- All of the above is now inside the conditional block --- */}
                  </div>
                </div>
              )}

              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-grey-400">
                <img src={search} alt="magnifying glass logo" className="h-3 sm:h-4" />
              </span>
            </form>

          </div>
        </div>
      </div>

      {/* Horizontal scroll sections for recipe cards */}
      <div className="space-y-4">
        {/* First scroll row */}
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => speedUpRight(scrollRef1, setIsSpeedBoost1)}
            className="scroll-button scroll-button-left"
            aria-label="Speed up forward to see more recipes"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => speedUpLeft(scrollRef1, setIsSpeedBoost1)}
            className="scroll-button scroll-button-right"
            aria-label="Go backward to see previous recipes"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          <div className="scroll-container scroll-container-with-buttons" ref={scrollRef1}>
            <div className="scroll-content scroll-animation-left gap-x-4">
              {recipes && recipes.length > 0 ? (
                <>
                  {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                  {recipes.map(recipe => (
                    <RecipeCard key={`${recipe._id}-duplicate`} recipe={recipe} />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-80">
                  <p className="text-gray-500">Loading recipes...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second scroll row */}
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => speedUpLeft(scrollRef2, setIsSpeedBoost2)}
            className="scroll-button scroll-button-left"
            aria-label="Go backward to see previous recipes"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          {/* Right scroll button */}
          <button
            onClick={() => speedUpRight(scrollRef2, setIsSpeedBoost2)}
            className="scroll-button scroll-button-right"
            aria-label="Speed up forward to see more recipes"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          <div className="scroll-container scroll-container-with-buttons" ref={scrollRef2}>
            <div className="scroll-content scroll-animation-right gap-x-4">
              {recipes && recipes.length > 0 ? (
                <>
                  {recipes.map(recipe => (
                    <RecipeCard key={`${recipe._id}-right`} recipe={recipe} />
                  ))}
                  {recipes.map(recipe => (
                    <RecipeCard key={`${recipe._id}-right-duplicate`} recipe={recipe} />
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-80">
                  <p className="text-gray-500">Loading recipes...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}
export default HomePage;