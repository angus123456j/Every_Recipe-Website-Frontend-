const API_BASE = 'http://localhost:2356/recipes';

export const getAllRecipes = async () => {
    try{
        const result = await fetch(API_BASE, { credentials: 'include' });
        if(!result.ok) throw new Error('Failed to fetch recipes');
        return await result.json()

    }catch(err){
        console.error('Error fetching all recipes', err);
        throw err;
    }
};

export const searchRecipes = async (searchParams) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (searchParams.query) {
            queryParams.append('q', searchParams.query);
        }
        
        if (searchParams.tags && searchParams.tags.length > 0) {
            queryParams.append('tags', searchParams.tags.join(','));
        }
        
        if (searchParams.timeRange) {
            if (searchParams.timeRange.min !== undefined) {
                queryParams.append('minTime', searchParams.timeRange.min);
            }
            if (searchParams.timeRange.max !== undefined) {
                queryParams.append('maxTime', searchParams.timeRange.max);
            }
        }
        
        const url = `${API_BASE}/search?${queryParams.toString()}`;
        const result = await fetch(url, { credentials: 'include' });
        
        if (!result.ok) throw new Error('Failed to search recipes');
        return await result.json();
        
    } catch (err) {
        console.error('Error searching recipes', err);
        throw err;
    }
};

export const getRecipeById = async (id) => {
    try{
        const result = await fetch(`${API_BASE}/${id}`, { credentials: 'include' });
        if(!result.ok) throw new Error('Failed to fetch recipe');
        return await result.json()

    }catch(err){
        console.error('Error fetching recipe by ID', err);
        throw err;
    }
};

export const getRecipesByUserId = async (userId) => {
    try{
        const result = await fetch(`${API_BASE}?userId=${userId}`, { credentials: 'include' });
        if(!result.ok) throw new Error('Failed to fetch user recipes');
        return await result.json()

    }catch(err){
        console.error('Error fetching recipes by user ID', err);
        throw err;
    }
};

export const updateRecipe = async (id, formData) => {
    try{
        const result = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });
        if(!result.ok) throw new Error('Failed to update recipe');
        return await result.json()

    }catch(err){
        console.error('Error updating recipe', err);
        throw err;
    }
};

export const deleteRecipe = async (id) => {
    try{
        const result = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if(!result.ok) throw new Error('Failed to delete recipe');
        return await result.json()

    }catch(err){
        console.error('Error deleting recipe', err);
        throw err;
    }
};

