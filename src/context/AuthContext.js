import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, confirmSignUp, login, logout, checkAuthStatus, forgotPassword, confirmForgotPassword } from '../api/authAPI';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication status on app load
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const userData = await checkAuthStatus();
            if (userData) {
                setUser(userData);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signUpUser = async (userData) => {
        try {
            setError(null);
            const result = await signUp(userData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const confirmSignUpUser = async (username, confirmationCode) => {
        try {
            setError(null);
            const result = await confirmSignUp(username, confirmationCode);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const loginUser = async (username, password) => {
        try {
            setError(null);
            const result = await login(username, password);
            
            // Update user state after successful login
            await checkAuth();
            
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logoutUser = async () => {
        try {
            setError(null);
            await logout();
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const forgotPasswordUser = async (username) => {
        try {
            setError(null);
            const result = await forgotPassword(username);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const confirmForgotPasswordUser = async (username, confirmationCode, newPassword) => {
        try {
            setError(null);
            const result = await confirmForgotPassword(username, confirmationCode, newPassword);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        signUpUser,
        confirmSignUpUser,
        loginUser,
        logoutUser,
        forgotPasswordUser,
        confirmForgotPasswordUser,
        clearError,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

