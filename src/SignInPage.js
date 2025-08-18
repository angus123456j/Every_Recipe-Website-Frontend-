import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import { useAuth } from './context/AuthContext';

function SignInPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetFormData, setResetFormData] = useState({
    username: '',
    confirmationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetStep, setResetStep] = useState(1); // 1: enter username, 2: enter code & new password
  const [isResetting, setIsResetting] = useState(false);
  const [resetErrors, setResetErrors] = useState({});
  const navigate = useNavigate();
  const { loginUser, forgotPasswordUser, confirmForgotPasswordUser, error, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (resetErrors[name]) {
      setResetErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateResetStep1 = () => {
    const newErrors = {};
    
    if (!resetFormData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!resetFormData.username.includes('@')) {
      newErrors.username = 'Please enter a valid email address';
    }
    
    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep2 = () => {
    const newErrors = {};
    
    if (!resetFormData.confirmationCode.trim()) {
      newErrors.confirmationCode = 'Verification code is required';
    } else if (resetFormData.confirmationCode.length !== 6) {
      newErrors.confirmationCode = 'Verification code must be 6 digits';
    }
    
    if (!resetFormData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (resetFormData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        clearError();
        
        await loginUser(formData.username, formData.password);
        
        alert('Login successful!');
        navigate('/'); // Redirect to home page
        
      } catch (err) {
        console.error('Login error:', err);
        // Error is already set in the context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateResetStep1()) {
      return;
    }

    try {
      setIsResetting(true);
      clearError();
      setResetErrors({});
      
      await forgotPasswordUser(resetFormData.username);
      setResetStep(2);
      alert('Password reset code sent to your email!');
      
    } catch (err) {
      console.error('Forgot password error:', err);
      // Error will be displayed via the global error state
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateResetStep2()) {
      return;
    }

    try {
      setIsResetting(true);
      clearError();
      setResetErrors({});
      
      await confirmForgotPasswordUser(
        resetFormData.username,
        resetFormData.confirmationCode,
        resetFormData.newPassword
      );
      
      alert('Password reset successful! You can now sign in with your new password.');
      setShowForgotPassword(false);
      setResetStep(1);
      setResetFormData({
        username: '',
        confirmationCode: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      console.error('Confirm reset password error:', err);
      // Error will be displayed via the global error state
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Every Recipe Logo" className="h-12" />
            <h1 className="text-3xl font-bold text-green-700">Every_Recipe</h1>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back! Please sign in to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                Create your account
              </Link>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Reset Password
                    </h3>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetStep(1);
                        setResetFormData({
                          username: '',
                          confirmationCode: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setResetErrors({});
                        clearError();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Display error message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Step 1: Enter Username */}
                  {resetStep === 1 && (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          Enter your username (email) to receive a password reset code.
                        </p>
                        <label htmlFor="resetUsername" className="block text-sm font-medium text-gray-700">
                          Username (Email)
                        </label>
                        <input
                          id="resetUsername"
                          name="username"
                          type="email"
                          required
                          className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                            resetErrors.username ? 'border-red-300' : 'border-gray-300'
                          }`}
                          value={resetFormData.username}
                          onChange={handleResetInputChange}
                          placeholder="Enter your email"
                        />
                        {resetErrors.username && (
                          <p className="mt-2 text-sm text-red-600">{resetErrors.username}</p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setResetErrors({});
                            clearError();
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isResetting}
                          className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {isResetting ? 'Sending...' : 'Send Code'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 2: Enter Code and New Password */}
                  {resetStep === 2 && (
                    <form onSubmit={handleConfirmResetSubmit} className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          Enter the verification code sent to your email and your new password.
                        </p>
                        
                        {/* Confirmation Code */}
                        <div className="mb-4">
                          <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700">
                            Verification Code
                          </label>
                          <input
                            id="confirmationCode"
                            name="confirmationCode"
                            type="text"
                            required
                            maxLength="6"
                            className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                              resetErrors.confirmationCode ? 'border-red-300' : 'border-gray-300'
                            }`}
                            value={resetFormData.confirmationCode}
                            onChange={handleResetInputChange}
                            placeholder="Enter 6-digit code"
                          />
                          {resetErrors.confirmationCode && (
                            <p className="mt-2 text-sm text-red-600">{resetErrors.confirmationCode}</p>
                          )}
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                              resetErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            value={resetFormData.newPassword}
                            onChange={handleResetInputChange}
                            placeholder="Enter new password"
                          />
                          {resetErrors.newPassword && (
                            <p className="mt-2 text-sm text-red-600">{resetErrors.newPassword}</p>
                          )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                              resetErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            value={resetFormData.confirmPassword}
                            onChange={handleResetInputChange}
                            placeholder="Confirm new password"
                          />
                          {resetErrors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-600">{resetErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setResetStep(1)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isResetting}
                          className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {isResetting ? 'Resetting...' : 'Reset Password'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
