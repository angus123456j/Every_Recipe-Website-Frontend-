const API_BASE = 'https://every-recipe-53da6eac62e6.herokuapp.com/auth';

// Sign up a new user
export const signUp = async (userData) => {
    try {
        const response = await fetch(`${API_BASE}/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password,
                email: userData.email
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            // Extract more detailed error message from AWS Cognito
            let errorMessage = data.error || 'Sign up failed';
            
            // Clean up common AWS Cognito error messages
            if (errorMessage.includes('Password did not conform with policy')) {
                errorMessage = 'Password must contain: uppercase letter, lowercase letter, number, and special character (!@#$%^&*)';
            } else if (errorMessage.includes('An account with the given email already exists')) {
                errorMessage = 'An account with this email already exists. Try signing in instead.';
            } else if (errorMessage.includes('Username should be an email')) {
                errorMessage = 'Please use a valid email format for your username';
            }
            
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (err) {
        console.error('Error in signUp:', err);
        throw err;
    }
};

// Confirm sign up with verification code
export const confirmSignUp = async (username, confirmationCode) => {
    try {
        const response = await fetch(`${API_BASE}/confirmSignUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                confirmationcode: confirmationCode
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Confirmation failed');
        }
        
        return data;
    } catch (err) {
        console.error('Error in confirmSignUp:', err);
        throw err;
    }
};

// Login user
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials: 'include', // Important for session cookies
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        return data;
    } catch (err) {
        console.error('Error in login:', err);
        throw err;
    }
};

// Check if user is authenticated
export const checkAuthStatus = async () => {
    try {
        const response = await fetch(`${API_BASE}/check-status`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        
        return null;
    } catch (err) {
        console.error('Error checking auth status:', err);
        return null;
    }
};

// Forgot password - send reset code to email
export const forgotPassword = async (username) => {
    try {
        const response = await fetch(`${API_BASE}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send password reset code');
        }
        
        return data;
    } catch (err) {
        console.error('Error in forgotPassword:', err);
        throw err;
    }
};

// Confirm forgot password - reset password with code
export const confirmForgotPassword = async (username, confirmationCode, newPassword) => {
    try {
        const response = await fetch(`${API_BASE}/confirm-forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username, 
                confirmationCode, 
                newPassword 
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to reset password');
        }
        
        return data;
    } catch (err) {
        console.error('Error in confirmForgotPassword:', err);
        throw err;
    }
};

// Logout user
export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            return true;
        }
        
        return false;
    } catch (err) {
        console.error('Error in logout:', err);
        return false;
    }
};

