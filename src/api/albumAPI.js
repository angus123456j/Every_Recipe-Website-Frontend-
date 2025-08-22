const API_BASE = 'https://every-recipe-53da6eac62e6.herokuapp.com/albums';

// Create a new album
export const createAlbum = async (albumData) => {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(albumData),
            credentials: 'include',
        });
        
        if (!response.ok) {
            let errMsg = 'Failed to create album';
            try {
                const ct = response.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const errorData = await response.json();
                    if (Array.isArray(errorData?.errors)) {
                        errMsg = errorData.errors.join(', ');
                    } else {
                        errMsg = errorData?.details || errorData?.error || errMsg;
                    }
                } else {
                    const text = await response.text();
                    if (text) errMsg = text;
                }
            } catch (_) {}
            throw new Error(errMsg);
        }
        return await response.json();
    } catch (err) {
        console.error('Error creating album', err);
        throw err;
    }
};

// Get all albums for a user
export const getUserAlbums = async (userId) => {
    try {
        console.log('API: Fetching albums for userId:', userId);
        const response = await fetch(`${API_BASE}/${userId}`, { credentials: 'include' });
        console.log('API: Response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch user albums');
        const data = await response.json();
        console.log('API: Received albums:', data);
        return data;
    } catch (err) {
        console.error('Error fetching user albums', err);
        throw err;
    }
};

// Get a specific album by ID
export const getAlbumById = async (albumId) => {
    try {
        const response = await fetch(`${API_BASE}/detail/${albumId}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch album');
        return await response.json();
    } catch (err) {
        console.error('Error fetching album', err);
        throw err;
    }
};

// Update an album
export const updateAlbum = async (albumId, updateData) => {
    try {
        const response = await fetch(`${API_BASE}/${albumId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to update album');
        return await response.json();
    } catch (err) {
        console.error('Error updating album', err);
        throw err;
    }
};

// Delete an album
export const deleteAlbum = async (albumId) => {
    try {
        console.log('API: Deleting album with ID:', albumId);
        const response = await fetch(`${API_BASE}/${albumId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        
        console.log('API: Delete response status:', response.status);
        if (!response.ok) throw new Error('Failed to delete album');
        const data = await response.json();
        console.log('API: Delete response data:', data);
        return data;
    } catch (err) {
        console.error('Error deleting album', err);
        throw err;
    }
};

// Add a recipe to an album
export const addRecipeToAlbum = async (albumId, recipeId) => {
    try {
        console.log('API: Adding recipe to album');
        console.log('API: AlbumId:', albumId);
        console.log('API: RecipeId:', recipeId);
        
        const response = await fetch(`${API_BASE}/${albumId}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeId }),
            credentials: 'include',
        });
        
        console.log('API: Add recipe response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('API: Error response:', errorData);
            
            // Check if it's a duplicate recipe error
            if (errorData.details && errorData.details.includes('Recipe already exists')) {
                console.log('API: Recipe already exists - this is expected behavior');
                throw new Error('Recipe already exists in this album');
            }
            
            throw new Error('Failed to add recipe to album');
        }
        
        const data = await response.json();
        console.log('API: Add recipe response data:', data);
        return data;
    } catch (err) {
        console.error('Error adding recipe to album', err);
        throw err;
    }
};

// Remove a recipe from an album
export const removeRecipeFromAlbum = async (albumId, recipeId) => {
    try {
        const response = await fetch(`${API_BASE}/${albumId}/recipes/${recipeId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to remove recipe from album');
        return await response.json();
    } catch (err) {
        console.error('Error removing recipe from album', err);
        throw err;
    }
};

// Check if a recipe is saved by a user
export const checkRecipeSaved = async (userId, recipeId) => {
    try {
        const response = await fetch(`${API_BASE}/${userId}/check-saved/${recipeId}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to check recipe saved status');
        return await response.json();
    } catch (err) {
        console.error('Error checking recipe saved status', err);
        throw err;
    }
};
