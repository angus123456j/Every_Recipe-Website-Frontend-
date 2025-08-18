import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import CollapsibleSection from './components/CollapsibleSection';
import TagPill from './components/TagPill'; // New import for the tags
import { getRecipeById, updateRecipe } from './api/recipeAPI';
import { useAuth } from './context/AuthContext';

import { allTags } from './tagsDta';

function AddRecipePage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [recipeName, setRecipeName] = useState('');
  const [time, setTime] = useState('');
  // In your component's state management
  const [minutes, setMinutes] = useState(0);
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageURL, setExistingImageURL] = useState(null);
  const fileInputRef = useRef(null);

  // Load existing recipe data if editing
  useEffect(() => {
    if (recipeId) {
      setIsEditing(true);
      setIsLoading(true);
      loadRecipeData();
    }
  }, [recipeId]);

  const loadRecipeData = async () => {
    try {
      const recipe = await getRecipeById(recipeId);
      setRecipeName(recipe.title || '');
      setMinutes(recipe.time || 0);
      setDescription(recipe.description || '');
      setIngredients(Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '');
      setSteps(Array.isArray(recipe.steps) && recipe.steps.length > 0 ? recipe.steps : ['']);
      setSelectedTags(Array.isArray(recipe.tags) ? recipe.tags : []);
      if (recipe.imageURL) {
        setExistingImageURL(recipe.imageURL);
        setImagePreview(recipe.imageURL);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      alert('Error loading recipe data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index] = e.target.value;
    setSteps(newSteps);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!recipeName.trim()) {
      alert('Please enter a recipe name');
      return;
    }
    
    if (!minutes || minutes <= 0) {
      alert('Please enter a valid cooking time');
      return;
    }
    
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (!ingredients.trim()) {
      alert('Please enter at least one ingredient');
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    if (!file && !existingImageURL){
      console.log("No image selected - proceeding without image");
    } else if (file) {
      console.log("Image selected:", file.name, file.size, file.type);
    }
    
    // Handle ingredients - split by comma and filter out empty strings
    const ingredientsArray = ingredients 
      ? ingredients.split(',').map(item => item.trim()).filter(item => item.length > 0)
      : [];

    console.log("Ingredients:", ingredientsArray);

    const formData = new FormData()
    formData.append('title', recipeName);
    formData.append('time', minutes);
    formData.append('description',description);
    formData.append('ingredients',JSON.stringify(ingredientsArray));

    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('steps', JSON.stringify(steps));
    if (file) {
      formData.append('imageURL', file);
    }
    // userId is set on the server from the session; do not send from client

    console.log("Form data being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      let data;
      if (isEditing) {
        // updateRecipe returns the data directly
        data = await updateRecipe(recipeId, formData);
        console.log('Recipe updated successfully:', data);
        alert('Recipe updated successfully!');
        // Navigate to the recipe page
        navigate(`/recipe/${data._id || recipeId}`);
      } else {
        // For new recipes, we need to handle the response
        const response = await fetch("http://localhost:2356/recipes",{
          method: "POST",
          body: formData,
          credentials: 'include',
        });
        
        data = await response.json();
        
        if(response.ok){
          console.log('Recipe created successfully:', data);
          alert('Recipe created successfully!');
          // Navigate to the recipe page
          navigate(`/recipe/${data._id}`);
        }else{
          console.log('Recipe creation failed:', data);
          const serverMsg = data?.error || (Array.isArray(data?.errors) ? data.errors.join(', ') : '') || data?.details || 'Unknown error';
          alert(`Recipe creation failed: ${serverMsg}`);
        }
      }

    } catch (error){
      console.log('Upload error:', error);
      alert('Error saving recipe');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto p-8">
          <div className="mt-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recipe...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-8">
        <div className="mt-12">
          <div className="flex items-center space-x-4 mt-14 mb-6">
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editing Recipe:' : 'Uploading Recipe:'}
            </h1>
            <button 
              type="submit" 
              className="p-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Recipe' : 'Submit Recipe'}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Form Sections */}
              <div className="flex-grow space-y-4">
                <CollapsibleSection title="Add recipe name:">
                  <p className="text-sm text-gray-500 mb-2">Add the name of the recipe.</p>
                  <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    placeholder="e.g. Italian Burger"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                  />
                </CollapsibleSection>

                {/*<CollapsibleSection title="Add time:">
                  <p className="text-sm text-gray-500 mb-2">Add the amount of time this recipe takes.</p>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    placeholder="e.g. 30 min"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </CollapsibleSection>*/}

              <CollapsibleSection title="Add time:">
              <p className="text-sm text-gray-500 mb-2">Add the amount of time this recipe takes in minutes.</p>
              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">Minutes</label>
                <input
                  id="minutes"
                  type="number"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </CollapsibleSection>



                <CollapsibleSection title="Add tags:"> {/* New Collapsible Section for tags */}
                  <p className="text-sm text-gray-500 mb-2">Select relevant tags for your recipe.</p>
                  {Object.entries(allTags).map(([category, tags]) => (
                    <div key={category} className="mb-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <TagPill
                            key={tag}
                            tag={tag}
                            isSelected={selectedTags.includes(tag)}
                            onSelect={handleTagSelect}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleSection>

                <CollapsibleSection title="Add Description:">
                  <p className="text-sm text-gray-500 mb-2">Add a decription for your recipe. 
                  </p>
                  <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    placeholder="e.g. A warm, hearty meal that brings back the taste of home with every bite."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </CollapsibleSection>


                <CollapsibleSection title="Add ingredients:">
                  <p className="text-sm text-gray-500 mb-2">Add the ingredients needed for the recipe. <br/> <strong>Seperate ingredients with a coma.</strong>
                  </p>
                  <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                    placeholder="e.g. 1 lb ground beef, 2 slices bread"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                </CollapsibleSection>

                

                <CollapsibleSection title="Add step:">
                  <p className="text-sm text-gray-500 mb-2">Add each individual step needed for the recipe.</p>
                  {steps.map((step, index) => (
                    <textarea
                      key={index}
                      className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 mt-2"
                      placeholder={`Step ${index + 1}:`}
                      value={step}
                      onChange={(e) => handleStepChange(e, index)}
                    />
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddStep} 
                    className="mt-4 w-full flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl text-gray-400 font-light mr-2">+</span>
                    <span className="text-gray-500">Add another step</span>
                  </button>
                </CollapsibleSection>
              </div>

              {/* Right Column: Image Upload */}
              <div className="w-full md:w-1/3 -mt-14">
                <h3 className="text-lg font-bold mb-2">Add image:</h3>
                <p className="text-sm text-gray-500 mb-4">Add an image of your final product.</p>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer relative"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Recipe Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-400">Image Placeholder</span>
                  )}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddRecipePage;