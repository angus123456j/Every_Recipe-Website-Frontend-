import React, {useEffect, useState, createContext} from 'react';
import { getAllRecipes } from '../api/recipeAPI';

export const RecipeContext = createContext();


export const RecipeProvider = ({children}) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const fetchRecipes = async() => {
        try{
          const data = await getAllRecipes();
          setRecipes(data);
        }catch (err) {
          console.log(err)
        }
      };

    useEffect(() => {
        fetchRecipes();
      },[])
    
      return (
        <RecipeContext.Provider value={{recipes, filteredRecipes, setFilteredRecipes, setRecipes, fetchRecipes}}>
            {children}
        </RecipeContext.Provider>

      );




};